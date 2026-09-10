#!/usr/bin/env bash
# One-time setup for this template: toolchain check, Python venv, .env, One config.
# Run it from the template folder: ./setup.sh
set -euo pipefail
cd "$(dirname "$0")"

need() { command -v "$1" >/dev/null 2>&1 || { echo "missing: $1 ($2)"; exit 1; }; }
need node "install Node 18+ from https://nodejs.org"
need python3 "install Python 3.10 to 3.13"
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

set -a
# shellcheck disable=SC1091
source .env
set +a

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
