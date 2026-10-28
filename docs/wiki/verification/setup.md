---
title: Verification setup
updated: 2026-10-28
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

Adapt tool paths on other machines. Runtime assembly uses Node 22+; Python is only used by the development skill validator. Native smoke runs a bounded synthetic check with one pending `--delivery wait` per session. It is never used to wait for human input. It assembles the workflow with the shared kit into a retained temporary directory, appends a fixture driver there and isolates `FUNGI_STATE_DIR`; it clears the inherited callback target so synthetic results cannot notify a real conversation.

The absolute executable paths above identify the earlier native test build; they do not override the skill’s PATH-only availability gate. Instruction-only changes need skill/link validation and wiki checks. Confirm unchanged asset hashes when retaining earlier runtime evidence; a structural pass does not establish agent behavior. Keep `fungi`, `fungi-ui` and caller skill directories as siblings in installed-layout checks.

The fixture uses the visible page controls and public bridge. It does not set Fungi’s internal storage. PNG paste is a synthetic clipboard event; preview state is changed by its authored inline script. The original skill assets remain untouched. Temporary session/evidence paths are printed. Retain evidence before removing only the fixture directory; never remove the user’s default Fungi sessions.

Human trials use a separate unique input directory and the shared skill's host-specific route: Codex `auto`, or a supported host-managed `wait` (local interactive Claude Code uses background Bash). Preserve a launch receipt and `collectEnv` when returned, then collect once on its notification or “done.” A completed `wait` contains the result directly. Never submit a synthetic answer into a human trial.

Build identity: early runs predate Git and retain their SHA-256 manifests. For new runs, record the tested Git revision and any dirty-source fingerprint, plus the installed executable hash, version, OS and Node version. A sorted SHA-256 manifest remains useful for portable skill copies. Fungi source is dirty and is not the tested binary’s identity. Generated wiki HTML is not a behavior fingerprint.

## Show-outcome checks

From the repository root:

```sh
node --test scripts/*.test.mjs
node scripts/show-outcome-native-smoke.mjs /Users/rengwu/.fungi/bin/fungi docs/wiki/evidence/2026-10-27-outcome-independent/native.json
node scripts/native-smoke.mjs /Users/rengwu/.fungi/bin/fungi docs/wiki/evidence/2026-10-27-outcome-independent/grill-regression.json
python3 /Users/rengwu/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/show-outcome
node scripts/show-outcome-browser-smoke.mjs /private/tmp/imparo-learnharness-reference/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' docs/wiki/evidence/2026-10-27-outcome-independent
```

The browser driver takes an already-installed Puppeteer module and Chromium executable; those absolute paths identify this machine's existing tools, not runtime skill dependencies. It starts an isolated headless browser and loopback fixture server, blocks external requests, injects a public page-API test double, captures desktop/narrow screenshots, and checks save/submit error recovery. The helper closes its browser/server on completion. The native driver exercises real controls/public Fungi APIs in isolated synthetic sessions; explicit absolute binary paths are for development tests, not a runtime fallback for the skill's PATH gate.

Use a fresh evidence destination for later runs. Native drivers print their retained temporary directories; evidence JSON includes exact session IDs. Preserve relevant artifact bytes and screenshots before cleaning only the fixture directory. Do not touch human sessions. Fingerprint current skill/script bytes and the tested executable; then run metadata checks and rebuild/check the wiki. Show-outcome owns `skills/show-outcome/assets/outcome.html`; grill-form owns its original page. The show-outcome native driver assembles show-outcome plus the shared kit, without the interview skill. Check each workflow with its `fungi` and `fungi-ui` siblings independently.


## Shared UI kit checks

Both workflow smoke drivers call the shared assembler, then append their driver inside that isolated bundle. New assemblies exclude generated compatibility directories and duplicate vendor assets. The original direct-source page paths have ignored compatibility bundles on this machine so historical sessions can still find their local assets; new launches use immutable retained bundles. Never edit or copy generated bundles back into component source.

```sh
node skills/fungi-ui/scripts/gallery.mjs
node scripts/ui-browser-smoke.mjs /private/tmp/imparo-learnharness-reference/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' docs/wiki/evidence/2026-10-28-ui-kit
```

Theme checks render every theme and capture screenshots for inspection:

```sh
node scripts/ui-theme-smoke.mjs /private/tmp/imparo-learnharness-reference/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' docs/wiki/evidence/2026-10-28-theming/themes
node scripts/ui-theme-native-smoke.mjs /Users/rengwu/.fungi/bin/fungi docs/wiki/evidence/2026-10-28-theming/native-themes.json
```

The browser theme driver fails on page errors, a missing bundled font, a collapsed icon button, overflow at 420 px, text contrast below 4.5:1, or a focus ring below 3:1. It does not paint sandboxed preview frames into full-page screenshots; the gallery driver covers previews. The native driver opens one self-submitting synthetic session per theme. Smoke drivers that assert colours pin `theme:'classic'`, so a personal theme setting cannot change their results.

The gallery driver uses an isolated headless browser and a public bridge test double. It exercises styling overrides, PNG paste/preview, keyboard deletion and the browser undo command, interactive state, keyboard region comments, distinct captured/final state, narrow layout and duplicate submission. Its output records what was actually exercised. Physical OS clipboard and system keyboard shortcuts are outside this check.
