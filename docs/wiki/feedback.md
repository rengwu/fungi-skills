---
title: Feedback log
updated: 2026-10-28
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


## 2026-10-27 — Outcome follow-up selection and helper copy

Trigger: the user reviewed the Imparo labels report. Expected: select recommended next work directly and submit, without retyping it into Notes. Observed: the recommendations were a plain numbered list; Notes was the only response control. The user also highlighted the delivery explanation, Optional tag and paste hint as unnecessary text. Classification: **skill UI/authoring gap**. Disposition: add optional multiple-selection next steps, support selection-only submission and remove the three helper captions. The [verification run](verification/runs/2026-10-27-outcome-next-steps.md) identifies the changed build and records native persistence, keyboard/pointer interaction, retry and layout checks.

## 2026-10-27 — Outcome asked for manual completion in Claude

Trigger: the same report opened in local interactive Claude Code and requested a manual “done” after submission. Expected: automatic continuation. The [diagnostic excerpt](evidence/2026-10-27-outcome-next-steps/delivery-diagnosis.json) preserves only the session ID, page source and delivery reason from the launch record; private report content and feedback are omitted. Installed Fungi is `v0.1.0-alpha.2`. The skill source at base `d402fae` prescribed `auto` for all callers.

Observed cause: Fungi's `auto` mode only discovers the Codex callback; the receipt explicitly suggests host-managed `wait` as another route. Its installed delivery capability describes Claude's native background Bash route. Classification: **shared skill instruction gap**, not an outcome-page or Fungi persistence failure. Disposition: choose the host route before launch and remove hard-coded `auto` from workflow/reopen examples. Existing session results were not collected again or changed. A fresh human Claude completion using the corrected instructions remains unverified.


## 2026-10-28 — Shared UI extraction and table wrapping

The user identified an Outcome table whose `D60` identifier wrapped one character per line, then requested central reusable UI for all workflows. The [accepted interview](planning.md#shared-ui-decisions-accepted-on-2026-10-28) expands the extraction to all existing controls, including previews/comments, permits free workflow styling and local assemblers, and chooses inline image Notes. Shared table styles preserve identifiers and constrain overflow to a table region. The [verification run](verification/runs/2026-10-28-ui-kit.md) covers both migrated workflows and the component gallery.

During the preparation interview, the installed `v0.1.0-alpha.2` rejected `--width`. The form opened successfully without sizing flags and its callback was consumed once. Invocation guidance now preserves the 1200 × 900 preference where supported while allowing older CLIs to use their default size.
