#!/usr/bin/env bash
#
# update-claude-context.sh
# Auto-updates the generated sections of CLAUDE.md after each commit.
# Called by .git/hooks/post-commit
#

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLAUDE_MD="$REPO_ROOT/CLAUDE.md"
TMPDIR="${REPO_ROOT}/.git/tmp-claude-ctx"
FENCE='```'

mkdir -p "$TMPDIR"

if [ ! -f "$CLAUDE_MD" ]; then
  echo "CLAUDE.md not found at $CLAUDE_MD, skipping update."
  exit 0
fi

# Helper: replace content between <!-- AUTO:TAG --> and <!-- /AUTO:TAG -->
# Reads replacement from a temp file to avoid awk multiline issues.
replace_section() {
  local tag="$1"
  local content_file="$2"
  local file="$3"
  local start_marker="<!-- AUTO:${tag} -->"
  local end_marker="<!-- /AUTO:${tag} -->"

  awk -v start="$start_marker" -v end="$end_marker" -v cfile="$content_file" '
    $0 == start {
      print
      while ((getline line < cfile) > 0) print line
      close(cfile)
      skip=1
      next
    }
    $0 == end { skip=0 }
    !skip     { print }
  ' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
}

# ── Section: Project Structure ──────────────────────────────────────────

tree_output=$(cd "$REPO_ROOT" && find . -maxdepth 4 \
  -not -path '*/node_modules/*' \
  -not -path '*/.next/*' \
  -not -path '*/.git/*' \
  -not -path '*/.turbo/*' \
  -not -path '*/dist/*' \
  -not -path '*/.cache/*' \
  -not -name '*.lock' \
  -not -name 'package-lock.json' \
  -not -name '.DS_Store' \
  \( -type f -o -type d \) | sort | head -80 | sed 's|^\./||')

cat > "$TMPDIR/structure.md" <<EOF

## Project Structure

${FENCE}
${tree_output}
${FENCE}
EOF

replace_section "STRUCTURE" "$TMPDIR/structure.md" "$CLAUDE_MD"

# ── Section: Routes ─────────────────────────────────────────────────────

{
  echo ""
  echo "## App Routes (Web)"
  echo ""
  while IFS= read -r page; do
    route=$(echo "$page" | sed 's|apps/web/src/app||' | sed 's|/page\.tsx$||')
    [ -z "$route" ] && route="/"
    echo "- ${route} — ${page}"
  done < <(cd "$REPO_ROOT" && find apps/web/src/app -name 'page.tsx' 2>/dev/null | sort)
  echo ""
} > "$TMPDIR/routes.md"

replace_section "ROUTES" "$TMPDIR/routes.md" "$CLAUDE_MD"

# ── Section: Components ─────────────────────────────────────────────────

{
  echo ""
  echo "## Component Inventory (Web)"
  echo ""
  for dir in workspace workspace/sidebar workspace/content workspace/chat workspace/mobile ui snapshot; do
    full_path="$REPO_ROOT/apps/web/src/components/$dir"
    if [ -d "$full_path" ]; then
      count=$(find "$full_path" -maxdepth 1 -name '*.tsx' | wc -l | tr -d ' ')
      files=$(cd "$full_path" && ls -1 *.tsx 2>/dev/null | sed 's/\.tsx$//' | paste -sd, - )
      echo "- **components/${dir}/** (${count}): ${files}"
    fi
  done
  echo ""
} > "$TMPDIR/components.md"

replace_section "COMPONENTS" "$TMPDIR/components.md" "$CLAUDE_MD"

# ── Section: API Routes ─────────────────────────────────────────────────

{
  echo ""
  echo "## API Routes"
  echo ""
  while IFS= read -r route_file; do
    route=$(echo "$route_file" | sed 's|apps/api/src/app||' | sed 's|/route\.ts$||')
    echo "- ${route} — ${route_file}"
  done < <(cd "$REPO_ROOT" && find apps/api/src/app -name 'route.ts' 2>/dev/null | sort)
  echo ""
  echo "**Lib modules:**"
  echo ""
  while IFS= read -r lib_file; do
    name=$(echo "$lib_file" | sed 's|apps/api/src/lib/||')
    echo "- lib/${name}"
  done < <(cd "$REPO_ROOT" && find apps/api/src/lib -name '*.ts' 2>/dev/null | sort)
  echo ""
} > "$TMPDIR/api.md"

replace_section "API" "$TMPDIR/api.md" "$CLAUDE_MD"

# ── Section: Recent Changes ─────────────────────────────────────────────

log_output=$(cd "$REPO_ROOT" && git log --oneline -10 2>/dev/null || echo '(no git history)')

cat > "$TMPDIR/recent.md" <<EOF

## Recent Commits

${FENCE}
${log_output}
${FENCE}
EOF

replace_section "RECENT_CHANGES" "$TMPDIR/recent.md" "$CLAUDE_MD"

# ── Cleanup temp files ──────────────────────────────────────────────────

rm -rf "$TMPDIR"

# ── Stage the updated CLAUDE.md ─────────────────────────────────────────

cd "$REPO_ROOT"
git add CLAUDE.md

# Amend the commit silently to include the updated CLAUDE.md
# Use --no-verify to prevent infinite hook loop
git commit --amend --no-edit --no-verify -- CLAUDE.md >/dev/null 2>&1

echo "[claude-context] CLAUDE.md updated and amended into commit."
