---
title: Feedback log
updated: 2026-10-27
---
# Feedback log

Keep actionable findings here. For each: date, skill fingerprint, Fungi version, triggering action, expected/observed behavior, classification, reproduction/evidence, disposition. Link a new verification run after a fix; preserve earlier failures.

## 2026-10-27 — PATH discovery

Observed at kickoff: the agent shell could not resolve `fungi`, but `~/.fungi/bin/fungi` existed and passed doctor. The initial skill added managed-location fallback. The user subsequently rejected that complexity: **only `fungi` on PATH counts**, identified by its expected version response. Disposition: fallback removed; missing or unrecognized `fungi` halts with brief install/PATH instructions. This is an accepted authoring preference, not a Fungi defect.

## Human trial

Completed on installed Fungi `v0.1.0-alpha.2`, with skill files unchanged from the [tested manifest](evidence/2026-10-27-first-skill/manifest.json). Native accessibility and screenshot inspection confirmed both questions, unselected choices, editable notes, the sandboxed slider preview and actions. No synthetic answer was entered.

The [receipt](evidence/2026-10-27-first-skill/human-receipt.json) armed a callback for session `bc4cdecc3736c4fd9b81065518f78122`. Its completion notice resumed the conversation after handoff. The exact argv and environment were executed **once**, yielding the [submitted result](evidence/2026-10-27-first-skill/human-result.json). Protocol, kind, outcome and skill schema matched. There were no artifacts or region comments. The [questions](evidence/2026-10-27-first-skill/human-questions.json) preserve the trial input.

The user selected **Start the trial**. They are unsure whether the default font should be smaller and explicitly deferred deciding until after more use. The submitted preview size was **14 px**, preserved as sample state only. Classification: **deferred UI preference**, not a bug or an instruction to change typography. Disposition: continue daily use; leave the skill unchanged.

## 2026-10-27 — Main-page script policy during port

The first native attempts displayed only disabled actions: the upstream generated-file CSP allowed inline scripts but blocked this port’s local modules and vendor script files. Classification: **skill port defect**. The main page now permits its packaged scripts/modules; preview isolation stays unchanged. A module-load failure also gets a visible diagnostic. The fixture additionally had a stale diagram-ready marker, corrected before the next attempt. Evidence and final outcome are in the first verification run.
