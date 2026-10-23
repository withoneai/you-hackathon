#!/usr/bin/env bash
# One-time setup for this template: toolchain check, Python venv, .env, One config.
# Run it from the template folder: ./setup.sh
set -euo pipefail
cd "$(dirname "$0")"

need() { command -v "$1" >/dev/null 2>&1 || { echo "missing: $1 ($2)"; exit 1; }; }
need node "install Node 22.23.4+, 24.22.1+ or 26.12.1+ from https://nodejs.org"
need python3 "install Python 3.10 to 3.13"
# The One CLI and MCP server refuse Node 18, 20, 23 and 25, and older patch releases of 22, 24 and 26.
node_ok() {
  local v major minor patch min mmin mpatch
  v="$(node -p 'process.versions.node')"
  IFS=. read -r major minor patch <<<"$v"
  case "$major" in
    22) min="23 4" ;; 24) min="22 1" ;; 26) min="12 1" ;;
    *) [ "$major" -gt 26 ] && [ $((major % 2)) = 0 ]; return ;;  # a later LTS line is assumed fine
  esac
  read -r mmin mpatch <<<"$min"
  [ "$minor" -gt "$mmin" ] || { [ "$minor" = "$mmin" ] && [ "$patch" -ge "$mpatch" ]; }
}
if ! node_ok; then
  echo "Node $(node -v) is too old or unsupported for the One CLI. Install 22.23.4+, 24.22.1+ or 26.12.1+"
  exit 1
fi
if ! command -v one >/dev/null 2>&1; then
  echo "installing the One CLI"
  npm i -g @withone/cli
fi

py_ok=$(python3 -c 'import sys; print(int((3,10) <= sys.version_info[:2] <= (3,13)))')
if [ "$py_ok" != "1" ]; then
  echo "python3 is $(python3 --version); this template needs 3.10 to 3.13"
  exit 1
fi

if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate
pip install -q -r requirements.txt

if [ ! -f .env ]; then
  cp .env.example .env
  echo "created .env from .env.example. Fill it in, then run ./setup.sh again"
  exit 0
fi

# Read the key instead of sourcing .env: a value with spaces in an older, unquoted .env
# would otherwise run as a command. The Python script loads the rest of .env itself.
envval() { sed -n "s/^$1=//p" .env | tail -n 1 | sed -e "s/^[\"']//" -e "s/[\"']\$//"; }
export ONE_SECRET="$(envval ONE_SECRET)"  # the `one` calls below read it

if [ -z "${ONE_SECRET:-}" ]; then
  echo "ONE_SECRET is empty in .env. Get a key at https://app.withone.ai/settings/api-keys"
  exit 1
fi

# One memory needs a config file, not just the env var. `one init` writes it without prompting.
if one --agent mem list note --limit 1 2>&1 | grep -q 'No One config'; then
  echo "writing the One config (one init)"
  one init --auth manual --api-key "$ONE_SECRET" -g -y >/dev/null
fi
echo "first memory call bootstraps a local store (about 25 seconds, once)"

python3 "$(ls *.py | grep -vE '^(one_cli|llm)\.py$' | head -1)" --check
echo "setup complete. Run: source .venv/bin/activate && python3 $(ls *.py | grep -vE '^(one_cli|llm)\.py$' | head -1)"
