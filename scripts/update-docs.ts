/**
 * Auto-Documentation Update Script
 *
 * This script runs as part of the GitHub Action workflow to automatically
 * update the MVP-BUILD-DOCUMENTATION.md file whenever changes are deployed.
 *
 * It analyzes the git diff and uses Claude to generate appropriate documentation
 * updates based on the changes made.
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

const DOCS_PATH = path.join(process.cwd(), 'docs', 'MVP-BUILD-DOCUMENTATION.md');

interface ChangeAnalysis {
  category: 'architecture' | 'feature' | 'ui' | 'api' | 'config' | 'bugfix' | 'other';
  description: string;
  affectedSections: string[];
  significance: 'major' | 'minor' | 'patch';
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is not set');
    process.exit(1);
  }

  const changedFiles = process.env.CHANGED_FILES || '';
  const diffSummary = process.env.DIFF_SUMMARY || '';
  const commitMessage = process.env.COMMIT_MESSAGE || '';

  if (!changedFiles.trim()) {
    console.log('No files changed, skipping documentation update');
    return;
  }

  console.log('Changed files:', changedFiles);
  console.log('Commit message:', commitMessage);

  // Read current documentation
  const currentDocs = fs.readFileSync(DOCS_PATH, 'utf-8');

  // Filter out non-relevant files (node_modules, lock files, etc.)
  const relevantFiles = changedFiles
    .split('\n')
    .filter(f => f.trim())
    .filter(f => !f.includes('node_modules'))
    .filter(f => !f.includes('pnpm-lock'))
    .filter(f => !f.includes('.turbo'))
    .filter(f => !f.endsWith('.md') || f.includes('README'))
    .filter(f => !f.startsWith('.github/workflows/update-docs'));

  if (relevantFiles.length === 0) {
    console.log('No relevant files changed, skipping documentation update');
    return;
  }

  // Read the content of key changed files for better context
  const fileContents: Record<string, string> = {};
  for (const file of relevantFiles.slice(0, 10)) { // Limit to first 10 files
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      try {
        const stat = fs.statSync(filePath);
        if (stat.isFile() && stat.size < 50000) { // Only read files under 50KB
          fileContents[file] = fs.readFileSync(filePath, 'utf-8');
        }
      } catch (e) {
        // Skip files we can't read
      }
    }
  }

  const client = new Anthropic({ apiKey });

  // Analyze the changes
  console.log('Analyzing changes with Claude...');

  const analysisPrompt = `You are analyzing code changes to determine what documentation updates are needed for an MVP build documentation file.

## Current Commit
Message: ${commitMessage}

## Changed Files
${relevantFiles.join('\n')}

## Diff Summary
${diffSummary}

## File Contents (for context)
${Object.entries(fileContents)
  .map(([file, content]) => `### ${file}\n\`\`\`\n${content.slice(0, 3000)}\n\`\`\``)
  .join('\n\n')}

## Current Documentation Structure
The documentation has these sections:
1. Overview & Executive Summary
2. Glossary
3. User Flows
4. UX/UI Design
5. Technical Architecture
6. Codebase Structure
7. Data Model & Storage
8. Integrations
9. API Reference
10. Configuration & Secrets
11. Local Development Setup
12. Deployment & Environments
13. Manual Testing & Troubleshooting
14. Decision Log
15. Known Limitations & Future Roadmap
16. Maintenance Guide

## Task
Analyze these changes and provide:
1. A brief description of what changed
2. Which documentation sections might need updating
3. The specific updates needed for each affected section (if any)

If the changes are minor (like typo fixes, dependency updates, or internal refactoring that doesn't change functionality), respond with "NO_UPDATE_NEEDED".

If updates are needed, provide them in this JSON format:
\`\`\`json
{
  "summary": "Brief description of changes",
  "updates": [
    {
      "section": "Section name",
      "action": "add" | "modify" | "remove",
      "content": "The new or modified content to add",
      "location": "Where in the section this should go (e.g., 'after Key Features table')"
    }
  ]
}
\`\`\`

Only suggest updates for significant changes that users of the documentation would need to know about.`;

  const analysisResponse = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: analysisPrompt }],
  });

  const analysisText = analysisResponse.content[0].type === 'text'
    ? analysisResponse.content[0].text
    : '';

  console.log('Analysis result:', analysisText);

  if (analysisText.includes('NO_UPDATE_NEEDED')) {
    console.log('No documentation updates needed for these changes');
    return;
  }

  // Extract JSON from the response
  const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/);
  if (!jsonMatch) {
    console.log('No structured updates found in analysis');
    return;
  }

  let updates;
  try {
    updates = JSON.parse(jsonMatch[1]);
  } catch (e) {
    console.error('Failed to parse update instructions:', e);
    return;
  }

  // Apply the updates
  console.log('Generating updated documentation...');

  const updatePrompt = `You are updating technical documentation for the Atlas Readiness Guide MVP.

## Current Documentation
${currentDocs}

## Changes to Apply
${JSON.stringify(updates, null, 2)}

## Task
Apply the specified updates to the documentation. Return the complete updated documentation file.

Important:
- Maintain the existing structure and formatting
- Keep all existing content that isn't being changed
- Add a changelog entry at the end of the document if one exists, or create a simple "## Changelog" section
- Use proper markdown formatting
- Be concise but complete

Return ONLY the updated documentation content, no explanations.`;

  const updateResponse = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [{ role: 'user', content: updatePrompt }],
  });

  const updatedDocs = updateResponse.content[0].type === 'text'
    ? updateResponse.content[0].text
    : '';

  if (!updatedDocs.includes('# Atlas Readiness Guide')) {
    console.error('Updated documentation seems invalid, skipping write');
    return;
  }

  // Write the updated documentation
  fs.writeFileSync(DOCS_PATH, updatedDocs);
  console.log('Documentation updated successfully!');
}

main().catch((error) => {
  console.error('Error updating documentation:', error);
  process.exit(1);
});
