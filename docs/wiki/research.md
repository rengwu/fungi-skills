---
title: Source study and authoring findings
updated: 2026-10-27
---
# Source study and authoring findings

## Baselines

Read the sibling jstack README, AGENTS, shared stack contract, wiki, plan, grill-me, grill-form, feature-map and verify-change skills, current form source, collector and authoring references. jstack was clean at `ff6ac0bd2abfd6255b01e196aa8bc783f15efe26`.

Read Fungi’s README, installation/delivery/HTML manuals, discovery source, simple grill-form, rich jstack adapter and recent AFK verification report. Fungi was based on `a94e3ffd5dd1625cca724f74f8f40b3db5e894e7` with uncommitted documentation/discovery/test work. Source observations are not claims about published builds.

The executable actually found is `/Users/rengwu/.fungi/bin/fungi`, version `v0.1.0-alpha.2`. It is absent from the agent shell’s PATH. Its doctor reports protocol 1, available Wails renderer and WKWebView. Installed describe output supplies the actual runtime contract used for this trial.

## What jstack contributes

jstack separates interviews (grill-me), presentation/collection (grill-form), interpreted planning records (plan), generic documents (wiki), expected behavior (feature-map), and build-specific results (verify-change). Records belong to the target project. Passing a wiki check establishes document integrity, not behavior.

The current rich grill-form has a prepared template and model, offline Markdown/Pele diagrams, isolated iframe previews, prototype state, region comments and inline image chips. Its normal generator and collector assume browser downloads and separate session state. Those transport responsibilities should move to Fungi; the interaction model remains useful.

## What Fungi contributes

The protocol-1 page API is `ready`, `saveDraft`, `submit`, `cancel`. Fungi snapshots input, acknowledges persistence, stores JSON/artifacts, owns the native window and returns a receipt/result. It has no questionnaire-specific contract. Skill assets stay below the page directory and must remain available for reopening.

`auto` can return callback or manual delivery. The receipt is authoritative; callback acceptance is not proof of conversation resumption. A close/cancel is not a submission. Reopen creates a new linked session from the original input and acknowledged draft. Collection is non-destructive and must not be polled by the agent.

The repository’s simple questionnaire predates rich visual reviews. Its rich demo already bridges generated jstack HTML but depends on the sibling generator and rewrites template boundaries. This spike uses that as prior evidence, then keeps a prepared Fungi page so invocation needs no adaptation step.

## Initial authoring lessons

- Keep the workflow central. The accepted extraction places common runtime instructions in the shared `fungi` skill, loaded through one explicit dependency link. Workflow-specific UI, data and interpretation stay with each caller.
- Put dependency detection before authoring. For this skill, the user subsequently chose PATH-only detection: a missing or unrecognized `fungi` command counts as not installed, regardless of files elsewhere.
- Keep the skill entry point short; place schemas and recovery details in references, UI in assets.
- Keep host-specific completion machinery inside Fungi. A skill follows the receipt and retains its exact session/environment.
- Preserve acknowledged drafts and result artifacts. Binary images belong in attachments, with keys in JSON.
- Use the advertised limits. Fungi’s JSON ceiling is lower than jstack’s theoretical answer size; oversize feedback must remain editable.
- Separate submitted prototype state from state captured with a comment. Empty feedback is never approval.
- Name the evidence boundary: a scripted paste exercises the editor/bridge, not the physical clipboard or human interaction.

See [verification setup](verification/setup.md) for runnable checks and [feedback](feedback.md) for emerging findings.
