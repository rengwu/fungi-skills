---
title: Shared interface support
updated: 2026-10-27
---
# Shared interface support

**FEAT-fungi-support**

Intent: let workflow skills concentrate on their tasks while sharing Fungi’s availability, presentation and session instructions. Basis: [the accepted extraction](../planning.md).

## Entry points and prerequisites

`skills/fungi/SKILL.md` is the supporting skill. A caller explicitly reads it through a sibling link before preparing an interaction. Install it alongside callers such as `skills/grill-form/`; the relative dependency must resolve in both the source and installed layout.

The host needs command/file access on the desktop machine. Runtime availability means `fungi` resolves on PATH and `fungi version` succeeds with `kind: version`, `protocol: 1` and a nonempty version string. Missing or unrecognized commands halt with brief install/PATH instructions. No fallback directory search or mandatory health preflight is part of the gate.

## Expected behavior

- The calling skill owns its workflow, interface/assets, input, answer schema and interpretation.
- Shared instructions launch the prepared interface, retain its exact receipt/environment, follow callback/manual delivery and collect once on a completion cue. No polling or extra waiter.
- Only a supported submitted result is passed to the caller for schema validation. Cancellation, close, failure and pending do not become answers.
- Shared artifact handling preserves returned files and maps keys to workflow references. Explicit reopen creates a new linked session; it does not rewrite the old result.
- Interface authors consult relevant installed help when needed. Existing interfaces use their prepared invocation without rereading the full manual.
- General recovery and diagnostics live with the supporting skill. Each workflow contains one dependency instruction and may show its concrete launch command.

## Verification recipes and limits

See [setup](../verification/setup.md). Validate both skill frontmatters and all local Markdown links; check the sibling link through the actual installed paths. Confirm extraction leaves UI/runtime asset hashes unchanged from the tested baseline.

A later behavioral trial should invoke a caller with a missing, unrecognized and valid PATH command, then exercise a human submission. Document checks alone do not prove that an agent follows the shared dependency correctly. Earlier native/callback evidence covers the same unchanged runtime, not the newly split instructions.

## Verification history

- [Shared support extraction checks](../verification/runs/2026-10-27-shared-support.md)
