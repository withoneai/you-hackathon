# An agent that learns: a pull-request reviewer

A code reviewer that gets better because you tell it what you wanted. It reviews a pull request through One's GitHub connection, and every review lists which learned rules it applied. Reply to a review with `one-learn: <rule>` and the next review follows that rule.

## Why this counts as a self-improving agent

It improves its results after feedback and remembers what worked.

- The first review has no rules and says so.
- A human replies on the PR: `one-learn: When a README changes, check that the Quick start section still lists the install and run commands in order.`
- `python review.py --remember` finds that reply and stores it as a rule in One memory.
- The next review recalls the rule, applies it, and prints it under "Applied learned rules" so the reader can see the change.

On our verification run the second review recalled one rule and applied it to a different pull request.

## What it uses from One

Path B in the hackathon skill: the `one` CLI, called from Python. Action ids are resolved at run time by method and path, with the title as a tie-breaker where GitHub's paths repeat.

| Action | Used for |
|---|---|
| `GET /repos/{owner}/{repo}/pulls/{pullNumber}/files` | The diff, file by file |
| `POST /repos/{owner}/{repo}/pulls/{pullNumber}/reviews` | Posting the review with `event: COMMENT`, so the bot never blocks a merge |
| `GET /repos/{owner}/{repo}/issues/{issueNumber}/comments` | Reading replies on the Conversation tab |
| `GET /repos/{owner}/{repo}/pulls` | `--watch` mode |
| `GET /user` | The connection's own login, so its comments are never mistaken for feedback |

Memory is One's `one mem`: rules are keyed on their text, reviewed PRs are keyed on the PR number.

## Setup

Node 18+, Python 3.10 to 3.13, a One account, a GitHub connection that can post reviews on the repository.

```bash
one add github

cd templates/pr-reviewer-that-learns
./setup.sh
```

Fill in `.env`: `ONE_SECRET`, your model key, `GITHUB_OWNER`, `GITHUB_REPO`, and `FEEDBACK_LOGINS`. Then `./setup.sh` again to write the One config that memory needs.

`FEEDBACK_LOGINS` is a comma-separated list of the GitHub logins allowed to teach this agent, and `--remember` refuses to run without it. A feedback comment becomes a standing rule the agent applies to every later review, so anyone who can comment on the repository could otherwise write its instructions. Name yourself and your teammates, nobody else.

## Run

```bash
source .venv/bin/activate
python review.py --pr 4          # review pull request 4
# reply on PR 4's Conversation tab, from your own account:
#   one-learn: <the rule you want next time>
python review.py --remember      # learn from the replies
python review.py --pr 2          # review another PR with the rule applied
python review.py --rules         # what it knows
python review.py --watch         # review PRs opened from now on, polling every minute
```

Feedback is accepted only when the whole comment is that single line, only from a login named in `FEEDBACK_LOGINS`, and only when posted after the review. A `one-learn:` line inside a longer comment or a quoted diff is ignored, because that would let anyone who can comment write the agent's rules. The diff is handed to the model as untrusted data with an instruction never to follow directions found inside it; accepted rules are treated as the review criteria, which is why who can set them matters.

## What you will see

First review:

```text
Recalled: 0 rule(s)
Reviewed PR #4 (event COMMENT, never blocks a merge). Applied 0 rule(s).
```

After a reply and `--remember`:

```text
Learned from PR #4 (@your-login): When a README changes, check that the Quick start section still lists the install and run commands in order.
Learned: 1 rule(s) from feedback
```

Second review:

```text
Recalled: 1 rule(s)
  - When a README changes, check that the Quick start section still lists the install and run commands in order.
Reviewed PR #2 (event COMMENT, never blocks a merge). Applied 1 rule(s).
```

The posted review ends with the list of applied rules and a one-line reminder of the feedback syntax.

## How it is built

- `review.py` has four modes: `--pr N`, `--remember`, `--rules`, `--watch`, plus `--check` and `--forget`.
- `--watch` only reviews pull requests opened after the watch started, so pointing it at a busy repository does not post a review on every open PR.
- `one_cli.py` and `llm.py` are the helpers every template vendors: CLI wrapper, action resolution, memory upsert, preflight with a `.onerc` allowlist, one `complete` function over `MODEL`.
- Reviews use `event: COMMENT`; the agent never approves or requests changes.

## How to extend

- Wake it with a relay instead of polling: `one relay create --connection-key <github key> --create-webhook --event-filters '["pull_request"]'` and forward the event to a URL that runs `review.py --pr`.
- Post a Slack line per review by searching the `slack` platform for `chat.postMessage`.
- Learn what to keep doing, not only what to change: add a second prefix such as `one-keep:` and store those rules with a higher weight.

Verified 2026-09-10 on `openai/gpt-4o` against a production One account, on a public sample repository, with the feedback comment posted from a second GitHub account.
