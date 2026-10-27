---
title: First skill verification
updated: 2026-10-27
result: Passed
---
# First skill verification

**Passed for the selected scope, including one completed human round trip.** This report was initially Untested while the human submission was pending; the 2026-10-27 completion below resolves that selected scenario. Scope: [FEAT-grill-form](../../features/grill-form.md), installation discovery, prepared native page, feedback preservation and live delivery.

## Build and environment

macOS 27.0 (26A5368g), arm64, Node 22.19.0; existing Fungi `v0.1.0-alpha.2` at `/Users/rengwu/.fungi/bin/fungi`. The spike began without Git. The [manifest](../../evidence/2026-10-27-first-skill/manifest.json) fingerprints every skill/test file plus the launcher, resolved executable and native renderer. No source build or Fungi installation/update was performed.

Tests use unique temporary directories and isolated Fungi state; no synthetic answer entered a human review. See [setup](../setup.md). This is maintainer-run verification, not an independent-agent skill trial.

## Results

| Scenario | Expected | Observed | Result | Evidence |
| --- | --- | --- | --- | --- |
| Installed but not on PATH | Find existing managed executable and check runtime | PATH resolution failed; documented root exists, protocol-1 doctor reports available WKWebView, version alpha.2 | Passed | [Native environment](../../evidence/2026-10-27-first-skill/native-final.json) |
| Feedback validation and artifacts | Preserve partial/required/other semantics, comment states, PNG bytes and error boundaries | Five transport/model tests passed | Passed | [Test output](../../evidence/2026-10-27-first-skill/unit-tests.txt) |
| Real native save/cancel/reopen/submit | Restore controls, PNG and state; return labelled answers and an untouched item | UI restored choice/notes/image, diagram rendered, final state was 20, submitted image SHA-256 matched durable artifact | Passed | [Final native run](../../evidence/2026-10-27-first-skill/native-final.json), [saved PNG](../../evidence/2026-10-27-first-skill/native-image.png) |
| Skill packaging | Valid frontmatter and self-contained runtime resources | Skill validator passed; local skill link resolves to workspace directory | Passed | [Source manifest](../../evidence/2026-10-27-first-skill/manifest.json) |
| Human use and automatic answer return | Actual user interaction, notification consumption and one collection | Completion notice resumed the conversation after handoff; one collection returned Start the trial, the user’s note and preview size 14 | Passed | [Live receipt](../../evidence/2026-10-27-first-skill/human-receipt.json), [saved result](../../evidence/2026-10-27-first-skill/human-result.json), [feedback log](../../feedback.md) |

An [earlier repaired-build native run](../../evidence/2026-10-27-first-skill/native.json) also passed. A subsequent source review tightened cancel locking, draft acknowledgment freshness and action spacing; the final native run above passed after those changes. [Initial failed attempts](2026-10-27-initial-port.md) preserve the CSP port defect and fixture correction.

## Limits and follow-up

No claim yet for an independently executed missing-install skill invocation, Windows/Linux, physical image paste/region drag, OS close recovery, rejected bridge save/submit UI, prolonged idle, sleep/wake, or repeat-use callback reliability. The fixture’s clipboard event is synthetic. Model-level comment-state checks do not establish native region-comment usability. One consumed callback establishes only this session’s return path. Fungi readiness alone does not prove its window is usable.

A local development link was created at `/Users/rengwu/.codex/skills/grill-form`, pointing to this workspace’s complete skill directory. No existing skill was replaced. Daily changes here therefore affect that local trial; capture hashes with future bug reports.

## Naming normalization — 2026-10-27

Skill names and paths in this report and its project-owned evidence copies were normalized to `grill-form` during the requested rename. This does not rerun or extend the historical result. Retained hashes identify the original pre-rename bytes; see [current rename verification](2026-10-27-grill-form-rename.md) for the renamed build.
