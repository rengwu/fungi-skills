---
title: Shared support extraction checks
updated: 2026-10-27
result: Passed
---
# Shared support extraction checks

**Passed for the selected instruction and packaging checks.** Scope: [FEAT-fungi-support](../../features/fungi-support.md) and the dependency extraction in [FEAT-grill-form](../../features/grill-form.md).

## Change and build identity

Shared availability, launch/completion, result-envelope, artifact and recovery instructions moved into `skills/fungi/`. The caller now explicitly reads its sibling dependency, then focuses on preparing, presenting, interpreting and continuing the review. Workflow schema details remain with grill-form. API details are routed to relevant installed help topics.

The [check record](../../evidence/2026-10-27-shared-support/checks.json) fingerprints all current skill files, records the platform and validator outputs, and lists resolved links in the source and installed layouts. The spike has no Git revision. Both local skill links resolve to their workspace directories under `/Users/rengwu/.codex/skills/`.

## Results

| Scenario | Expected | Observed | Result |
| --- | --- | --- | --- |
| Skill metadata | Both skill entrypoints pass the skill-creator validator | Both passed | Passed |
| Explicit dependency and references | Shared skill, recovery, authoring and asset links resolve in both layouts | All 12 local Markdown links resolved | Passed |
| Runtime preservation | Instruction extraction leaves the tested UI/runtime assets intact | All 13 asset hashes match the first-skill manifest | Passed |
| Responsibility review | Workflow owns the review and its schema; shared skill owns runtime lifecycle | Caller has prepare/present/interpret/continue sections and one explicit dependency; common recovery lives under the supporting skill | Passed |

The README, planning decision, feature records and verification setup now describe the paired installation. Historical runs retain their original tested scope.

## Limits

This was a documentation and packaging change. Native UI tests were not repeated because runtime assets are byte-for-byte unchanged. These checks do not establish that an independent agent will follow the shared instructions or that the PATH gate works in every host. The [earlier native and human round trip](2026-10-27-first-skill.md) remains evidence for its original build and scope; it does not certify the new instruction split.

The current authoring shell still does not resolve `fungi` on PATH. No fallback lookup, environment change, installation or live form launch was performed for this extraction. A future invocation must follow the shared PATH-only gate.

## Naming normalization — 2026-10-27

Skill names and paths in this report and its project-owned evidence copies were normalized to `grill-form` during the requested rename. This does not rerun or extend the historical result. Retained hashes identify the original pre-rename bytes; see [current rename verification](2026-10-27-grill-form-rename.md) for the renamed build.
