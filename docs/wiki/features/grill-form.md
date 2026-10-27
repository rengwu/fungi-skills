---
title: Grill form
updated: 2026-10-27
---
# Grill form

**FEAT-grill-form**

Intent: perform jstack-style interviews and visual reviews through an existing Fungi installation. Basis: [kickoff requirements and implementation choices](../planning.md).

## Entry points and prerequisites

Load `skills/grill-form/SKILL.md` with its complete directory and the sibling `skills/fungi/` supporting skill. The entrypoint explicitly reads that dependency before preparing a round. The agent needs ordinary file and command access to the same desktop machine as Fungi. User invocation: “Use grill-form to collect the decisions needed for this task.”

Runtime: `fungi` on PATH, returning the expected protocol-1 version response, with a working renderer and desktop access for launch. The skill has no Node or jstack runtime dependency. Maintenance uses Node 22+.

## Expected behavior

- Delegate availability and session handling to [shared interface support](fungi-support.md). Keep the entrypoint focused on preparing the round, presenting the form, interpreting feedback and continuing the task.
- Render 1–10 questions with optional choices, notes, Markdown/diagrams and sandboxed previews. Native submission accepts partial feedback; required items and “Something else” keep their validation.
- Save acknowledged drafts and attachments. Explicit reopen restores choice, notes, images, final state and comments into a new linked session.
- Submit through Fungi, return labelled answers and durable artifact references, and close the window. Prevent duplicate submit/editing during submission; a rejected save/submit keeps the form usable.
- Preserve final preview state separately from comment-time state. Untouched items are unresolved.
- Follow callback/manual delivery from the receipt. Collect only on a completion cue. Close, cancel, failure and pending are not answers.
- Keep project decisions in that project’s existing notes. Record daily issues with enough build/context evidence to classify them.

## Verification recipes

Shared commands and isolation: [setup](../verification/setup.md).

1. **Installation gate:** invoke the skill with `fungi` absent from PATH (even if present elsewhere), or resolving to a command without the expected version response; expect only install/PATH instructions. With the expected `fungi version` response, proceed to the form. This revised agent-instruction recipe remains unvalidated in an isolated harness.
2. **Prepared native page:** run the native smoke. It drives real page controls in disposable sessions, saves a choice/notes/PNG/preview state, cancels, reopens, checks restored controls and submits. Verify returned bytes/hash and untouched item status.
3. **Human review:** launch the skill with a real decision/review round and `auto`. Inspect the window, interact with a preview and region comment, optionally paste an image, submit, then observe callback consumption or manual fallback and collect once.
4. **Recovery/failure:** deliberately cancel/close a disposable form; explicitly reopen. Exercise a rejected save/submit and confirm input stays usable; do not retry real interviews automatically.

## Coverage and limitations

Model/transport tests do not establish native presentation or human usability. Native scripted controls do not establish physical clipboard/pointer behavior. Windows/Linux, unsupported protocols, a genuinely absent installation, OS close, failure/retry UI and long idle/sleep need separate observations. No browser-default or Fungi installation changes are part of this feature.

## Verification history

- [Rename verification](../verification/runs/2026-10-27-grill-form-rename.md) — current paths and `grill-form/v1` schema.

- [Shared support extraction checks](../verification/runs/2026-10-27-shared-support.md) — instructions and packaging only; UI/runtime assets unchanged.
- [First skill verification](../verification/runs/2026-10-27-first-skill.md) — predates the PATH-only installation check; its discovery pass does not verify the revised gate.
