#!/usr/bin/env bash
# Repo-side checks for the templates. Run from anywhere: templates/check.sh
set -euo pipefail
cd "$(dirname "$0")"
fail=0
note() { echo "  $1"; }
bad() { echo "FAIL: $1"; fail=1; }

echo "vendored helpers are identical"
for f in one_cli.py llm.py setup.sh; do
  ref="self-repairing-research/$f"
  for d in market-watch pr-reviewer-that-learns support-triage-crew; do
    if ! cmp -s "$ref" "$d/$f"; then bad "$d/$f differs from $ref"; fi
  done
done

echo "every python file compiles"
for f in */*.py; do python3 -m py_compile "$f" || bad "$f does not compile"; done
find . -name __pycache__ -type d -exec rm -rf {} + 2>/dev/null || true

echo "every template has the required files"
for d in self-repairing-research market-watch pr-reviewer-that-learns support-triage-crew; do
  for f in README.md .env.example requirements.txt setup.sh one_cli.py llm.py; do
    [ -f "$d/$f" ] || bad "$d/$f missing"
  done
done

echo "no credentials or pasted action ids in tracked files"
# Only files git would commit are scanned, so a local .env or .onerc is never read or echoed.
# A plausible key has a long random tail; documented placeholders like sk_live_... do not.
tracked() { git ls-files --cached --others --exclude-standard . | grep -v '^check.sh$'; }
scan() { tracked | xargs grep -lnE "$1" 2>/dev/null | sed 's/^/  /'; }
if [ -n "$(scan 'sk_(live|test)_[A-Za-z0-9_-]{20,}')" ]; then scan 'sk_(live|test)_[A-Za-z0-9_-]{20,}'; bad "a One key is committed"; fi
if [ -n "$(scan '(live|test)::[a-z0-9-]+::default::[0-9a-f]{32}')" ]; then scan '(live|test)::[a-z0-9-]+::default::[0-9a-f]{32}'; bad "a connection key is committed"; fi
if [ -n "$(scan 'conn_mod_def::[A-Za-z0-9_-]{6,}::[A-Za-z0-9_-]{10,}')" ]; then scan 'conn_mod_def::[A-Za-z0-9_-]{6,}::[A-Za-z0-9_-]{10,}'; bad "a hardcoded action id is committed"; fi
if [ -n "$(scan 'sk-[A-Za-z0-9]{20,}|sk-proj-[A-Za-z0-9_-]{20,}')" ]; then scan 'sk-[A-Za-z0-9]{20,}|sk-proj-[A-Za-z0-9_-]{20,}'; bad "an LLM API key is committed"; fi

echo "readme voice"
if grep -rn -- '—' */README.md README.md 2>/dev/null; then bad "em-dash in a README"; fi

echo "guard tests"
python3 test_guards.py > /tmp/one-template-guards.log 2>&1 || { cat /tmp/one-template-guards.log; bad "guard tests failed"; }
grep -c '^PASS' /tmp/one-template-guards.log | sed 's/^/  /;s/$/ assertions passed/'

if [ "$fail" = 0 ]; then echo "all checks passed"; else exit 1; fi
