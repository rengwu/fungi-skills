---
title: Plan and decisions
updated: 2026-10-27
---
# Plan and decisions

## User requirements

Established in the kickoff on 2026-10-27:

- This repository is a testing spike for how Fungi-based skills should be written.
- Follow jstack’s workflows and use a wiki for project records.
- First deliver `grill-form`: check whether Fungi is installed; halt with brief download/setup instructions if absent; otherwise run grill-form in Fungi.
- Enable everyday use and a feedback loop that can lead to skill changes or Fungi changes.
- Use grill-form for consequential preparation questions or concerns when needed.

## Initial implementation choices

These are agent-selected spike choices within the requested scope, not user answers to an interview:

- **Self-contained prepared page.** Port jstack’s current rich questionnaire into the skill. Preserve visual choices, sandboxed previews, state, region comments and inline images. Avoid a runtime dependency on a sibling checkout or Node.
- **Fungi owns sessions and delivery.** Use the public protocol-1 page and CLI interfaces. No jstack download collector, second waiter, new registry or Fungi-internal storage parsing.
- **Installation is a prerequisite.** The initial managed-location fallback was superseded by the user’s PATH-only decision below.
- **Preserve existing planning ownership.** The skill presents and collects; the caller interprets and records accepted outcomes. Use grill-me/plan when present without making them runtime dependencies.
- **Evidence before parity claims.** Start with bounded tests on the installed macOS alpha; record physical interaction, cross-platform and prolonged-use gaps separately.
- **Keep upstream work separate.** Study sibling sources read-only. The Fungi checkout has unrelated uncommitted changes. Record suspected upstream defects here before proposing a scoped fix.

## Working loop

1. Record the intended behavior in the [feature map](features/grill-form.md).
2. Implement a narrow change in this spike’s skill.
3. Run relevant local checks and exercise the actual Fungi page.
4. Save a dated build-specific result and evidence; rebuild/check the wiki.
5. Use the skill in ordinary work. Log actionable feedback with version, action and expected/observed behavior.
6. Classify the issue as skill, Fungi, harness/environment or unresolved. Reproduce before routing or fixing it.

## Accepted trial outcome — 2026-10-27

The user selected **Start the trial** in the [first human submission](evidence/2026-10-27-first-skill/human-result.json). Daily use can begin with the current skill.

Default font size is explicitly deferred until more use. The sample preview was submitted at 14 px, but this is a captured sample setting, not a decision to change the form’s default typography. Leave the UI unchanged for now.

The callback resumed this conversation and one collection returned the saved answers. This establishes one successful human round trip, not long-term delivery reliability.

## Accepted installation check — 2026-10-27

The user requested a dead-simple check: `fungi` must resolve on PATH to the expected binary; otherwise consider it not installed. Run `fungi version` and recognize the protocol-1 version response. Remove supplied-path/managed-directory discovery and the mandatory doctor/describe preflight. On failure, halt with the release link and a short instruction to install and add `fungi` to PATH. This supersedes the initial fallback choice; launch diagnostics remain part of recovery.

## Workflow-led skills — accepted and implemented on 2026-10-27

**User direction:** future skills should focus on their own workflows. Fungi is supporting infrastructure and should be mentioned only where needed to establish the dependency or show its use. Repeating its explanation, installation check and lifecycle instructions in every skill is undesirable.

The user approved the proposed extraction. A shared supporting skill named `fungi` now owns the short explanation, PATH-only availability check, setup response, presentation, completion/collection, common result-envelope handling and recovery. It points to installed `fungi help` topics for API details when authoring or changing an interface; routine use of an existing interface does not require rereading the manual.

Workflow skills own their purpose, questions, UI/assets, input and answer schemas, interpretation and project records. Each explicitly links to and instructs the agent to follow the shared skill at the start. Their steps then read as the actual workflow: prepare the round, present the prepared interface, interpret feedback, continue or record outcomes. Keep launch commands where they clarify actual use.

Both skill directories are installed as siblings so the explicit dependency link resolves. This supersedes the original standalone packaging choice. `grill-form` keeps its invocation name, UI/assets and answer schema; its entrypoint now follows prepare, present, interpret and continue. General recovery guidance moved to the shared skill. No runtime code or UI change was needed.

See [shared support behavior](features/fungi-support.md) and the [extraction checks](verification/runs/2026-10-27-shared-support.md).

## Skill naming — accepted on 2026-10-27

The user requested the workflow name **grill-form** throughout the project, including folders. The directory, invocation name, display name, local skill link, code/test imports, feature ID, documentation and result schema now use that name. The supporting `fungi` skill remains separate.

The result/draft schema is now `grill-form/v1`. Existing durable runtime sessions were not migrated. Historical documentation and project-owned evidence copies have had names and paths normalized to the current naming; JSON copies carry a normalization note, and retained hashes still describe their original pre-rename bytes. These records are historical, not newly executed evidence. The [rename verification](verification/runs/2026-10-27-grill-form-rename.md) records the current build.

## Project name — accepted on 2026-10-27

The project is **fungi-skills**, located at `/Users/rengwu/Desktop/Projects/fungi-skills`. The user requested replacement of every previous project-name reference. The directory, display title, historical project references, sibling Fungi documentation and both installed skill links now use the current name. Historical JSON copies include a normalization note; no historical test was rerun by that edit.

## GitHub repository — 2026-10-27

The user requested a new [rengwu/fungi-skills](https://github.com/rengwu/fungi-skills) repository and an initial push. The initial branch is `main`; private visibility is the default chosen for this upload. Both skill directories, project documentation and relevant verification evidence are included. Local generated wiki files and OS metadata remain ignored.

## Open questions

- Does the current rich UI feel right in the native window during daily work?
- Should default typography be smaller? Deferred by the user until more use.
- How reliably does auto delivery resume this host’s conversation after a human submission?
- Is a local skill link sufficient for the trial, or should this spike later become a packaged plugin?
- Which failures appear under prolonged use, sleep/wake or large image-heavy reviews?

These do not block the first implementation. Packaging beyond a local skill and upstream changes remain follow-up scope.
