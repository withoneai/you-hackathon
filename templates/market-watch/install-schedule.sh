#!/usr/bin/env bash
# Install a cron entry that runs the brief every weekday at 08:00 local time.
# Everything machine-specific is discovered here, so nothing absolute is committed.
set -euo pipefail
cd "$(dirname "$0")"

DIR="$(pwd)"
PY="$DIR/.venv/bin/python"
[ -x "$PY" ] || { echo "run ./setup.sh first (no .venv here)"; exit 1; }

ONE_BIN="$(command -v one || true)"
[ -n "$ONE_BIN" ] || { echo "the \`one\` CLI is not on PATH: npm i -g @withone/cli"; exit 1; }
NODE_BIN="$(command -v node || true)"
[ -n "$NODE_BIN" ] || { echo "node is not on PATH"; exit 1; }

# cron runs with a minimal PATH, so both binaries' directories have to be named explicitly.
# They are usually the same directory, so keep it once.
ONE_DIR="$(dirname "$ONE_BIN")"
NODE_DIR="$(dirname "$NODE_BIN")"
CRON_PATH="$ONE_DIR:/usr/bin:/bin"
[ "$NODE_DIR" != "$ONE_DIR" ] && CRON_PATH="$ONE_DIR:$NODE_DIR:/usr/bin:/bin"
# ONE_HOME only matters when it is set to something other than the default.
ONE_HOME_PREFIX=""
[ -n "${ONE_HOME:-}" ] && ONE_HOME_PREFIX="ONE_HOME='$ONE_HOME' "

mkdir -p "$DIR/out"

# A marker unique to this folder, so re-running only replaces this checkout's line and leaves
# a schedule installed from a different copy of the template alone.
MARKER="# one-market-watch:$(printf '%s' "$DIR" | shasum | cut -c1-12)"
LINE="0 8 * * 1-5 cd '$DIR' && PATH='$CRON_PATH' ${ONE_HOME_PREFIX}'$PY' market_watch.py run >> '$DIR/out/cron.log' 2>&1 $MARKER"

# `crontab -l` exits non-zero when there is no crontab yet, and `grep -v` exits non-zero when it
# filters everything out. Neither is an error here, so keep both from tripping `set -e`.
EXISTING="$(crontab -l 2>/dev/null || true)"
KEPT="$(printf '%s\n' "$EXISTING" | grep -vF "$MARKER" || true)"
printf '%s\n%s\n' "$KEPT" "$LINE" | grep -v '^$' | crontab -
echo "installed this cron line:"
echo "  $LINE"
echo
echo "check it with:      crontab -l"
echo "watch the output:   tail -f '$DIR/out/cron.log'"
echo "remove it with:     crontab -l | grep -vF '$MARKER' | crontab -"
echo
echo "macOS: cron needs Full Disk Access (System Settings, Privacy and Security) to read ~/.one and the venv."
echo "Windows: there is no cron. Use Task Scheduler to run the same command from this folder."
