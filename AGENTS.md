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

## Setup Notes

- **Agent 1** runs automatically on GitHub — no local setup needed.
- **Agent 2** requires the git hook at `.git/hooks/post-commit`. Since `.git/hooks/` is not tracked by git, this hook must be set up on each new clone:
  ```bash
  cp scripts/setup-hooks.sh .git/hooks/post-commit  # or recreate manually
  ```
  The script itself (`scripts/update-claude-context.sh`) is committed to the repo.
