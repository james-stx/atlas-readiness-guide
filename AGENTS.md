# Agent Registry

All automations, hooks, and agents running in this project. **This file must be updated whenever a new agent is created or an existing one is modified/removed.**

---

## 1. MVP Docs Updater

| Field | Value |
|-------|-------|
| **Type** | GitHub Action |
| **Trigger** | Push to `main` (ignores docs/MVP-BUILD-DOCUMENTATION.md changes) |
| **Files** | `.github/workflows/update-docs.yml`, `scripts/update-docs.ts` |
| **Requires** | `ANTHROPIC_API_KEY` secret in GitHub repo settings |
| **Created** | Pre-V2 |

**What it does:** On every push to main, analyzes the commit diff using the Claude API (claude-sonnet), determines which sections of the MVP build documentation are affected, and rewrites `docs/MVP-BUILD-DOCUMENTATION.md` accordingly. Commits the updated doc back to the repo with `[skip ci]` to prevent loops.

**How it works:**
1. GitHub Action checks out repo, installs deps
2. Runs `scripts/update-docs.ts` which reads the diff and changed files
3. Sends the diff to Claude for analysis — Claude returns structured JSON of needed updates
4. Sends the current doc + updates back to Claude to generate the full updated doc
5. Writes the file and commits if changed

---

## 2. Claude Context Agent

| Field | Value |
|-------|-------|
| **Type** | Git post-commit hook (local) |
| **Trigger** | Every local commit |
| **Files** | `scripts/update-claude-context.sh`, `.git/hooks/post-commit` |
| **Requires** | Nothing (runs locally, no API keys) |
| **Created** | 2025-02-06 |

**What it does:** After every commit, scans the project and regenerates the auto-generated sections of `CLAUDE.md` (project structure, routes, components, API routes, recent commits). Amends the commit to include the updated file.

**How it works:**
1. Post-commit hook calls `scripts/update-claude-context.sh`
2. Script scans dirs with `find`, collects page.tsx routes, component .tsx files, API route.ts files, and git log
3. Writes each section to a temp file, uses `awk` to replace content between `<!-- AUTO:TAG -->` markers in CLAUDE.md
4. Stages and amends the commit with `--no-verify` to prevent hook loops

**Note:** Because it amends commits, the first push after a commit that was already pushed will need `--force-with-lease`. In normal workflow (commit then push), this is not an issue.

---

## 3. Model Currency Agent

| Field | Value |
|-------|-------|
| **Type** | GitHub Action (scheduled) |
| **Trigger** | Daily cron at 09:00 UTC · `workflow_dispatch` for manual runs |
| **Files** | `.github/workflows/update-models.yml`, `scripts/update-models.ts` |
| **Requires** | `ANTHROPIC_API_KEY` secret in GitHub repo settings |
| **Created** | 2026-03-08 |
| **Permissions** | `contents: write` — commits directly to `main`, no human approval needed |

**What it does:** Once a day, fetches the full list of available models from the Anthropic `/v1/models` API, determines the newest model in each family (opus / sonnet / haiku) by `created_at` timestamp, then scans every `.ts / .tsx / .js / .jsx` file in the repo for quoted model-ID strings and replaces any that are behind with the newest in the same family. Commits the changes back to `main` automatically. If all models are already current, no commit is made.

**Design constraints:**
- **Same-family only**: a Haiku reference is always updated to the newest Haiku — never promoted to Sonnet or Opus. This preserves the intent of each model placement (speed vs. quality trade-off) while ensuring currency.
- **No human approval**: the workflow has `contents: write` permission and pushes directly to `main`. The commit message includes `[skip ci]` to avoid triggering downstream CI on a mechanical change.
- **Non-blocking**: if the Anthropic API is unreachable the step exits non-zero and the job fails visibly, but no partial changes are committed.

**How it works:**
1. Calls `GET https://api.anthropic.com/v1/models?limit=100` with the API key
2. Groups models by family, sorts by `created_at` descending, records the top of each family
3. Walks `apps/api/src`, `apps/web/src`, `scripts`, `packages` recursively (skips `node_modules`, `.next`, etc.)
4. Applies `/'"`claude-[a-z0-9][-a-z0-9.]*'"`/g` regex to each file; replaces matches where a newer same-family model exists
5. If any files were modified, runs `git add -A && git commit && git push`

---

## Setup Notes

- **Agent 1** runs automatically on GitHub — no local setup needed.
- **Agent 2** requires the git hook at `.git/hooks/post-commit`. Since `.git/hooks/` is not tracked by git, this hook must be set up on each new clone:
  ```bash
  cp scripts/setup-hooks.sh .git/hooks/post-commit  # or recreate manually
  ```
  The script itself (`scripts/update-claude-context.sh`) is committed to the repo.
