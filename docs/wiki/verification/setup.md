---
title: Verification setup
updated: 2026-10-27
---
# Verification setup

Run commands from this spike’s root. The first machine is macOS 27.0 (26A5368g), arm64, Node 22.19.0; installed Fungi is `v0.1.0-alpha.2` at `/Users/rengwu/.fungi/bin/fungi`.

```sh
/Users/rengwu/.fungi/bin/fungi doctor
/Users/rengwu/.fungi/bin/fungi describe
node --test scripts/*.test.mjs
node scripts/native-smoke.mjs /Users/rengwu/.fungi/bin/fungi docs/wiki/evidence/2026-10-27-first-skill/native.json
python3 /Users/rengwu/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/grill-form
python3 /Users/rengwu/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/fungi
node ../jstack/skills/verify-change/scripts/check-reports.mjs docs/wiki
node docs/wiki/_build.mjs
node docs/wiki/_build.mjs --check
```

Adapt tool paths on other machines. Runtime use of the skill itself does not need Node/Python. Native smoke runs a bounded synthetic check with one pending `--delivery wait` per session. It is never used to wait for human input. It copies the skill into a temporary directory, appends a fixture driver there and isolates `FUNGI_STATE_DIR`; it clears the inherited callback target so synthetic results cannot notify a real conversation.

The absolute executable paths above identify the earlier native test build; they do not override the skill’s PATH-only availability gate. Instruction-only changes need skill/link validation and wiki checks. Confirm unchanged asset hashes when retaining earlier runtime evidence; a structural pass does not establish agent behavior. Keep the shared `fungi` and caller skill directories as siblings in installed-layout checks.

The fixture uses the visible page controls and public bridge. It does not set Fungi’s internal storage. PNG paste is a synthetic clipboard event; preview state is changed by its authored inline script. The original skill assets remain untouched. Temporary session/evidence paths are printed. Retain evidence before removing only the fixture directory; never remove the user’s default Fungi sessions.

Human trials use a separate unique input directory and `--delivery auto`. Preserve the launch receipt and `collectEnv`; end the turn after presentation, then collect once on its notification or “done.” Never submit a synthetic answer into a human trial.

Build identity: early runs predate Git and retain their SHA-256 manifests. For new runs, record the tested Git revision and any dirty-source fingerprint, plus the installed executable hash, version, OS and Node version. A sorted SHA-256 manifest remains useful for portable skill copies. Fungi source is dirty and is not the tested binary’s identity. Generated wiki HTML is not a behavior fingerprint.
