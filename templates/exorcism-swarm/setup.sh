#!/usr/bin/env bash
# One-time setup for a Halloween template: toolchain check, Python venv, .env, preflight.
# Run it from anywhere: ./setup.sh. Identical in exorcism-swarm and haunted-command-station;
# templates/check.sh compares the copies.
set -euo pipefail
cd "$(dirname "$0")"

need() { command -v "$1" >/dev/null 2>&1 || { echo "missing: $1 ($2)"; exit 1; }; }
need node "install Node 18+ from https://nodejs.org"
if ! command -v one >/dev/null 2>&1; then
  echo "installing the One CLI"
  npm i -g @withone/cli
fi

# CrewAI 1.15.2 needs Python 3.10 to 3.13. Use the newest of those that is installed.
PY=""
for cand in python3.13 python3.12 python3.11 python3.10 python3; do
  if command -v "$cand" >/dev/null 2>&1 && \
     [ "$("$cand" -c 'import sys; print(int((3,10) <= sys.version_info[:2] <= (3,13)))')" = "1" ]; then
    PY="$cand"; break
  fi
done
if [ -z "$PY" ]; then
  echo "need Python 3.10 to 3.13 (python3 is $(python3 --version 2>&1)). Install 3.12 or 3.13 and run this again"
  exit 1
fi

if [ ! -d .venv ]; then
  "$PY" -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate
pip install -q -r requirements.txt

if [ -f mcp_wrapper.py ]; then
  echo "downloading the One MCP server once, so the first crew run is not slow"
  npx -y @withone/mcp --help >/dev/null 2>&1 || echo "  could not pre-download @withone/mcp; the first run will fetch it"
fi

if [ ! -f .env ]; then
  cp .env.example .env
  echo "created .env from .env.example. Fill it in, then run ./setup.sh again"
  exit 0
fi

set -a
# shellcheck disable=SC1091
source .env
set +a
if [ -z "${PARASAIL_API_KEY:-}" ]; then
  echo "PARASAIL_API_KEY is empty in .env. Get a key at https://www.saas.parasail.io/keys"
  exit 1
fi
if [ -z "${ONE_SECRET:-}" ]; then
  echo "ONE_SECRET is empty in .env. Get a key at https://app.withone.ai/settings/api-keys"
  exit 1
fi

python main.py --check
echo "setup complete. Run: source .venv/bin/activate && python main.py"
