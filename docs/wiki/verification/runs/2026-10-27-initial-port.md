---
title: Initial port attempts
updated: 2026-10-27
result: Failed
---
# Initial port attempts

Scope: [FEAT-grill-form](../../features/grill-form.md), first native rendering of the port on installed Fungi `v0.1.0-alpha.2`, macOS 27.0 arm64.

| Scenario | Expected | Observed | Result | Evidence |
| --- | --- | --- | --- | --- |
| Native fixture, attempt 1 | Questions render, draft/cancel/reopen/submit completes | Command exceeded 25-second fixture timeout; only disabled actions rendered | Failed | [Receipt](../../evidence/2026-10-27-first-skill/native-attempt-1.json), [asset hashes](../../evidence/2026-10-27-first-skill/native-attempt-1-manifest.json) |
| Native fixture, attempt 2 | Corrected diagram-ready selector allows the round trip | Same blank content/timeout before fixture execution | Failed | [Receipt](../../evidence/2026-10-27-first-skill/native-attempt-2.json), [asset hashes](../../evidence/2026-10-27-first-skill/native-attempt-2-manifest.json) |

Diagnosis: the generated browser template’s main-page CSP allowed only inline scripts. The port moved code into local modules and script assets without updating that policy, so neither UI nor fixture code ran. Native screenshot observation showed only disabled Cancel/Submit actions. This was a **skill port defect**, not evidence of a Fungi engine defect. An independent fixture mistake used `rendered` instead of the UI’s `ready` diagram marker.

Repair: allow packaged same-origin scripts/modules on the main page, preserve stricter preview sandboxing, show dynamic module load errors, and correct the fixture marker. Failed fixture windows were closed through native UI. No user interview was involved.

The [first skill verification](2026-10-27-first-skill.md) records the repaired build and remaining gaps. These failures remain part of the spike history.

## Naming normalization — 2026-10-27

Skill names and paths in this report and its project-owned evidence copies were normalized to `grill-form` during the requested rename. This does not rerun or extend the historical result. Retained hashes identify the original pre-rename bytes; see [current rename verification](2026-10-27-grill-form-rename.md) for the renamed build.
