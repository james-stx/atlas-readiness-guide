/**
 * Model Currency Agent
 *
 * Runs daily via GitHub Actions. No human approval required.
 *
 * What it does:
 *   1. Fetches the list of available models from the Anthropic API
 *   2. Groups them by family (opus / sonnet / haiku) and finds the latest in each
 *   3. Scans every .ts / .tsx / .js / .jsx file in the repo for quoted model strings
 *   4. Replaces any out-of-date model ID with the newest in the same family
 *      (haiku → newest haiku, sonnet → newest sonnet — never cross-promotes families)
 *   5. Reports all changes; exits 0 whether or not changes were made
 *
 * The GitHub Action then commits any modified files back to main.
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Config ──────────────────────────────────────────────────────────────────

const SCAN_DIRS = ['apps/api/src', 'apps/web/src', 'scripts', 'packages'];
const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);
const IGNORE_SEGMENTS = ['node_modules', '.next', '.turbo', 'dist', 'build'];

// ─── Types ───────────────────────────────────────────────────────────────────

type ModelFamily = 'opus' | 'sonnet' | 'haiku';

interface AnthropicModel {
  id: string;
  display_name: string;
  created_at: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function detectFamily(modelId: string): ModelFamily | null {
  const id = modelId.toLowerCase();
  if (id.includes('opus'))   return 'opus';
  if (id.includes('sonnet')) return 'sonnet';
  if (id.includes('haiku'))  return 'haiku';
  return null;
}

async function fetchLatestModels(apiKey: string): Promise<Record<ModelFamily, string>> {
  const res = await fetch('https://api.anthropic.com/v1/models?limit=100', {
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
  });

  if (!res.ok) {
    throw new Error(`Anthropic /v1/models returned ${res.status}: ${await res.text()}`);
  }

  const body = await res.json() as { data: AnthropicModel[] };

  const byFamily: Record<ModelFamily, AnthropicModel[]> = { opus: [], sonnet: [], haiku: [] };

  for (const model of body.data) {
    const family = detectFamily(model.id);
    if (family) byFamily[family].push(model);
  }

  const latest: Partial<Record<ModelFamily, string>> = {};

  for (const family of ['opus', 'sonnet', 'haiku'] as ModelFamily[]) {
    const sorted = byFamily[family].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    if (sorted.length > 0) {
      latest[family] = sorted[0].id;
      console.log(`  [${family.padEnd(6)}] latest = ${sorted[0].id}  (${sorted[0].created_at.slice(0, 10)})`);
    } else {
      console.log(`  [${family.padEnd(6)}] no models found in API response`);
    }
  }

  return latest as Record<ModelFamily, string>;
}

function collectFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (IGNORE_SEGMENTS.some(seg => full.includes(`${path.sep}${seg}${path.sep}`) || full.endsWith(`${path.sep}${seg}`))) continue;
    if (entry.isDirectory()) results.push(...collectFiles(full));
    else if (entry.isFile() && SCAN_EXTENSIONS.has(path.extname(entry.name))) results.push(full);
  }

  return results;
}

// Matches quoted model strings: 'claude-...' / "claude-..." / `claude-...`
// Captures the quote char and the model ID separately so we can restore them.
const MODEL_RE = /(['"`])(claude-[a-z0-9][-a-z0-9.]*)\1/g;

interface FileResult {
  file: string;
  changes: Array<{ from: string; to: string; line: number }>;
}

function processFile(filePath: string, latestPerFamily: Record<ModelFamily, string>): FileResult {
  const original = fs.readFileSync(filePath, 'utf-8');
  const lines = original.split('\n');
  const changes: FileResult['changes'] = [];

  const updated = lines.map((line, lineIdx) =>
    line.replace(MODEL_RE, (match, quote, modelId) => {
      const family = detectFamily(modelId);
      if (!family) return match;

      const latest = latestPerFamily[family];
      if (!latest || modelId === latest) return match;

      changes.push({ from: modelId, to: latest, line: lineIdx + 1 });
      return `${quote}${latest}${quote}`;
    })
  ).join('\n');

  if (changes.length > 0) {
    fs.writeFileSync(filePath, updated, 'utf-8');
  }

  return { file: filePath, changes };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not set — cannot fetch model list');
    process.exit(1);
  }

  // 1. Fetch latest model IDs from Anthropic
  console.log('Fetching available models from Anthropic API...');
  const latestPerFamily = await fetchLatestModels(apiKey);

  // 2. Collect all source files
  const cwd = process.cwd();
  const allFiles = SCAN_DIRS.flatMap(d => collectFiles(path.join(cwd, d)));
  console.log(`\nScanning ${allFiles.length} source files...`);

  // 3. Process each file
  const updatedFiles: FileResult[] = [];

  for (const file of allFiles) {
    const result = processFile(file, latestPerFamily);
    if (result.changes.length > 0) updatedFiles.push(result);
  }

  // 4. Report
  if (updatedFiles.length === 0) {
    console.log('\n✓ All model references are already up to date. No changes needed.');
    return;
  }

  console.log(`\nUpdated ${updatedFiles.length} file(s):\n`);
  for (const { file, changes } of updatedFiles) {
    const rel = path.relative(cwd, file);
    console.log(`  ${rel}`);
    for (const c of changes) {
      console.log(`    line ${c.line}: ${c.from}  →  ${c.to}`);
    }
  }

  console.log('\nModel update complete.');
}

main().catch(err => {
  console.error('Fatal error in update-models:', err);
  process.exit(1);
});
