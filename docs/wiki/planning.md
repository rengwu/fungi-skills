---
title: Plan and decisions
updated: 2026-10-28
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

## Outcome workflow — accepted on 2026-10-27

The user requested a new Fungi skill for the result-bearing replies between design/interview rounds. The motivating source was the ongoing Claude session originally under `ancaro`, now the Imparo project: the replies after the width round (D51–D53), tutor-status round (D54–D56), and map round (D57–D58). These report decisions, departures from recommendations, verification, caveats, open questions and the next useful spike. Keep that substance in the richer surface.

Accepted through the three-question grill-form round and subsequent chat:

- **Name:** `outcome`, singular (agent recommendation; the user subsequently used this name).
- **Activation:** keep it active for this conversation until turned off, covering substantive result turns rather than progress messages. An explicit one-off request remains one-off.
- **Reading:** no acknowledgment is needed. Optional Notes are always available, including reports with no questions. Reading does not block already-authorized work.
- **Lifecycle:** leave the window open while reading. Submitting feedback closes it; the user explicitly confirmed this matches their intent. Closing without submission is not acceptance.
- **Combined workflow:** present the outcome and the ready next spike/interview in one window. The user confirmed outcome and grill-form should work together. Do not open two windows for the same round.
- **CLI auditing:** the original “outcome presented” only response was superseded. Keep a concise plaintext outcome in the CLI for traceability, with the full report and interaction in the window.

Implementation choice: share grill-form's prepared page, preview/comment/image controls and persistence model. `outcome/v1` selects a report above 0–10 ordinary interview items plus an always-present Notes field. Standalone interviews keep `grill-form/v1`. This avoids a second questionnaire implementation. The new skill depends on the sibling `fungi` and `grill-form` directories. No Fungi engine change, new collector, instruction-file hook or global activation setting is needed.

The development shell still lacks `fungi` on PATH. The normal skill availability gate remains intact; native development tests explicitly name the installed binary and isolate their sessions. The preparation interview used the user's existing jstack form; no Fungi installation or shell settings were changed.

See [Outcome behavior](features/show-outcome.md) and [verification](verification/runs/2026-10-27-outcome.md). Daily usability, long-idle behavior and real callback delivery for this new combined flow remain follow-up observations, not prerequisites to shipping the local skill.

## Outcome simplification — accepted on 2026-10-27

The user asked to remove unnecessary instructions, loosen usage and leave presentation to the model's creativity. The follow-up form selected **custom layouts when useful** and **agent judgment throughout the conversation**, adding: “when in doubt, most likely just use it.” The draft-review item was untouched; no further wording feedback was submitted.

The skill now keeps only the small workflow: use Fungi, present freely, offer Notes, optionally combine with grill-form, keep a concise CLI summary and continue from feedback. The prepared page is a convenient default. The authoring reference contains only that page's technical contract. Removed content checklists, report-order prescriptions, audit formatting requirements and duplicated lifecycle instructions are deleted, not moved elsewhere. This supersedes the original strict presentation/activation guidance. Existing renderer behavior is unchanged.

## Outcome reminders restored — accepted on 2026-10-27

The user requested all six proposed additions: distinguish accepted/proposed/implemented/checked results; interpret Notes and answers against their original outcome; prefer combining ready forms/spikes; avoid implied decisions from unanswered items, dismissal or preview changes; avoid acknowledgment loops; and give the result in the CLI if presentation fails. These are brief workflow reminders. Creative freedom, custom layouts and discretionary usage remain as accepted in the simplification round.

The user also requested a minimal prepared-page JSON input and launch command directly in the skill, as a convenient starting example. Detailed fields remain in the authoring reference.

## Independent workflows — accepted on 2026-10-27

The user removed the combined flow and requested that outcome and grill-form be independent, with grill-form restored to its earlier form. They want agents focused on solving the problem rather than designing Fungi layouts. Frequent windows are welcome. The CLI should keep a detailed summary, only slightly more concise than the window.

Outcome now owns a prepared report-and-Notes page and its complete assets; it depends only on the shared Fungi skill. Structured interviews and spikes remain in separate sessions. Grill-form's skill and runtime files are restored exactly to the pre-outcome Git baseline. Nonempty question arrays are rejected by the outcome page rather than silently dropped. General feedback, images and draft recovery remain available. This supersedes the earlier custom-layout, combined-flow and brief-audit choices; presentation content and visuals remain flexible.


## Outcome next steps and quiet UI — accepted on 2026-10-27

Daily use in Imparo exposed two usability gaps. Recommended follow-up work should be directly selectable instead of requiring the user to retype a prose list. Outcome now accepts optional `nextSteps` actions and presents unchecked, multiple-selection checkboxes. A selection alone can submit; Notes and pasted images remain available. Selecting an action requests that work, not an answer to the underlying design question. Full questionnaires still have separate sessions.

The user also requested removing the explanatory delivery line, the Optional tag beside Notes, and the image-paste hint. Keep the Notes label, controls, actual save status and errors. This changes the prepared UI and authoring contract; agents should put recommended actions in `nextSteps` rather than duplicate them in report prose.

## Host-aware completion — corrected on 2026-10-27

The user expected outcome to resume the agent automatically, as grill-form does, and reported being asked to say “done” in Imparo's Claude Code session. Its saved launch record confirms a manual fallback. The shared instructions had prescribed `--delivery auto` for every host, but installed Fungi only detects Codex's exact-conversation callback in that mode. Local interactive Claude Code supports the separate `wait` route through its native background Bash completion.

The shared skill now selects the route before launch: Codex callback, supported host-managed pending/background wait, then manual fallback if neither is available. Outcome, grill-form and reopen examples defer to that selection. A completed wait is consumed directly; no second collection or user “done” is required. No engine changes or new waiter are needed. See the [verification record](verification/runs/2026-10-27-outcome-next-steps.md) for the confirmed diagnosis and the untested live-Claude follow-up.


## Shared UI extraction — interview opened on 2026-10-28

The user approved pursuing a shared UI library, documented for agents and consumed by independent workflows, and requested a grill-form round before implementation. The proposed home is `skills/fungi-ui/`, with reusable assets, an authoring entry point and working examples. Existing outcome/grill-form behavior is not being merged.

The [five-question round](evidence/2026-10-28-ui-kit-planning/questions.json) asks about first-pass scope, permitted visual variants, the shared Notes experience, runtime tooling requirements and policy for missing reusable controls. Recommendations are proposals until answered. No extraction has started.

The PATH-only availability check now succeeds on installed Fungi `v0.1.0-alpha.2`. The current skill's sizing flags were [rejected](evidence/2026-10-28-ui-kit-planning/sizing-error.json) before session creation, so the form was opened without those unsupported flags. The [launch receipt](evidence/2026-10-28-ui-kit-planning/receipt.json) arms the exact-conversation Codex callback for session `92cf5fdb77e902102be8c3eed519d83f`. The completion cue arrived and the session was collected once; the accepted decisions follow.


## Shared UI decisions — accepted on 2026-10-28

The [submitted round](evidence/2026-10-28-ui-kit-planning/result.json) resolves all five questions. The user approved implementation after settling the interview.

- **Scope:** extract all existing UI, including interactive previews and region comments, into `fungi-ui`; migrate both workflows.
- **Composition:** components are building blocks. Workflows choose, arrange and freely restyle them. The user compared this to a buffet or Lego blocks, using shadcn/Base UI as analogies, not requesting those dependencies. This supersedes the proposal to restrict styling to a few named variants.
- **Notes:** use inline image chips as the shared default. Preserve paste, editing, preview, images and draft recovery.
- **Assembly:** a local runtime assembly helper is acceptable. Each workflow can own an assembler that composes shared components and arranges the interface for its task. Node.js is therefore an accepted runtime prerequisite for these assemblers.
- **Missing components:** add generally reusable controls to the kit first, then consume them from the workflow.

Workflow input/result schemas and interpretation stay with their skills. The shared kit owns rendering, reusable controls, preview/comment UI, styling and component examples. Fungi's session lifecycle remains with the supporting `fungi` skill. Assembly places the page and dependencies under one retained directory so it respects Fungi's asset boundary. The implementation now follows these requirements. See the [shared UI feature](features/fungi-ui.md) and [verification run](verification/runs/2026-10-28-ui-kit.md) for checked behavior and remaining limits.


## UI authoring boundary — accepted on 2026-10-28

The user wants future skills to preserve a separation between running a workflow and authoring its UI, wherever a mechanical assembler or equivalent is suitable. `fungi-ui` is the central home for reusable components and supporting authoring/assembly utilities. A routine caller should not need to load its skill guide, inspect components or decide how to compose them. Those choices belong in the workflow implementation; the caller supplies workflow input, runs its helper and interprets the response.

Agents creating or changing an interface may consult `fungi-ui` directly. This remains compatible with free workflow styling and composition. `fungi` still supplies runtime availability, launch and completion instructions. Current workflow entrypoints, shared guidance and the repository's future-skill guidance now make this distinction explicit. This is an instruction/documentation clarification; component and assembler behavior is unchanged.


## Visual design research handoff — 2026-10-28

The user finds the current shared UI too “bootstrap”-like and not modern enough. Their [design-reference collection](design-references.md) preserves the supplied names, URLs, three original images and the explicit concern that ShowAI feels excessive, messy and complex. The user requested documentation only for now and will hand research and spikes to another agent. No reference research, new design choice or UI implementation was undertaken for this request.


## Theming decisions — accepted on 2026-10-28

The user asked to pick up the [design-reference handoff](design-references.md) and spike multiple-theme support, with prototypes for a second theme beside the first. Before implementation they requested a grill-form round. The [eight-question round](evidence/2026-10-28-theming-planning/questions.json) showed three sketched directions beside the current theme in one switchable preview. The [submitted answers](evidence/2026-10-28-theming-planning/result.json) settle all eight:

- **Second theme:** **Paper** (editorial) leads. Mono and Neutral were not vetoed, so they are built as comparison prototypes.
- **Light and dark:** the second theme is light-only; the current theme stays dark.
- **Selection:** each workflow names a default; a personal setting read by the assembler overrides it. Agents never choose a theme for routine use.
- **Reach:** themes may change tokens and add scoped structural rules.
- **Fonts:** bundle open-licence fonts. The user's note: "bundle fonts, no limit, as the theme library grows."
- **First theme:** refresh it in this spike. The user's note: "the current theme is decent, but i wanna make some light changes to it - typography, colors, etc." This supersedes the recommendation to freeze it pixel-identical.
- **Previews:** sandboxed previews stay as authored.
- **Rejection criterion:** a theme that "feels like slop", per [10 tells of slop](https://godobject.dev/blog/10-tells-of-slop/).

The agent's recommendations were accepted except on fonts (system-only proposed) and the first theme (freeze proposed). See the [direction sketches](evidence/2026-10-28-theming-planning/dir-paper.png).

## Theming spike — implemented on 2026-10-28

Implemented and checked; the visual result is **proposed** until the user reviews it. See the [shared UI feature](features/fungi-ui.md#themes) and [verification](verification/runs/2026-10-28-theming.md).

- **Mechanism:** `ui.css` places components in a `fungi-base` cascade layer and themes in `fungi-theme`. Unlayered workflow CSS still overrides both. `data-theme` on `<html>` selects a theme; nested regions can carry another. About 45 `--ui-*` tokens cover colour, type, size and shape.
- **Classic refresh (agent proposal):** warm charcoal neutrals with one ochre accent replace the lavender accent, the cyan chips and the amber draft status. IBM Plex Sans and Plex Mono replace system fonts, and radii are slightly tighter. The lavender and the five unrelated hues matched the article's first two tells.
- **Paper:** Newsreader with Plex Mono labels, a warm paper ground and an ink-blue accent. Choices are ruled rows, tables use booktabs rules, and the reading column narrows.
- **Prototypes:** Mono (IBM Plex Mono throughout, hairline boxes, dashed dividers) and Neutral (zinc, soft radii, Plex Sans) are for comparison only.
- **Fonts:** latin and latin-ext WOFF2 subsets of Newsreader, IBM Plex Sans and IBM Plex Mono (Fontsource 5.3.0, OFL-1.1), about 0.9 MB. Templates now allow `font-src 'self'`. Inter and JetBrains Mono were avoided as named slop tells.
- **Workflow CSS:** outcome and grill-form replaced literal colours and sizes with token references, so themes reach them.
- **Selection:** the assembler reads `~/.config/fungi-ui/settings.json` (`{"theme":"paper"}`) and rejects unknown names. The gallery switches themes live.

Open: which theme becomes the second theme (Paper is the candidate), whether the classic refresh is right, whether Mono and Neutral stay, and whether a dark Paper variant is wanted later. The window flashes the dark canvas before a light theme's CSS loads, because templates still declare `color-scheme: dark`; this has not been addressed.

## Paper revision — accepted on 2026-10-28

After reviewing the gallery, the user accepted the refreshed classic theme ("classic looks passable now") and Paper as the second theme, with three changes: "too much italics, and replace the font - use the same font as wikipedia. having a Dark Paper theme variant is also a good idea."

- **Italics:** Paper no longer italicises recommendations or block quotes. Emphasis written in the content still renders.
- **Wikipedia's fonts:** Paper uses Wikipedia's declared stacks. Headings are `'Linux Libertine', Georgia, Times, 'Source Serif 4', serif`; the body is the system `sans-serif`. Minor headings are bold sans, and major headings carry a hairline rule, as on Wikipedia. A probe of Wikipedia on this Mac showed Georgia headings (Linux Libertine is not installed) and Helvetica body, so Paper renders the same faces. Small labels keep IBM Plex Mono.
- **Paper dark:** `paper-dark` shares Paper's type and structure, declared once in `paper.css`, on a warm dark ground with a light-blue accent.
- **Fonts:** Newsreader is no longer used and was removed. The bundle is now about 0.3 MB of IBM Plex Sans and Mono.

Mono and Neutral remain comparison prototypes; the user has not decided their fate. See the [revision checks](verification/runs/2026-10-28-theming-revision.md).

## Theme cleanup — accepted on 2026-10-28

The user deleted the Mono and Neutral prototypes ("mono and neutral can be deleted"). The kit now ships `classic` (default), `paper` and `paper-dark`.

The user also reported poor contrast in classic's code blocks, with a screenshot. Sampling it showed the block sinking to `#100f0d` on the `#161513` page, a 1.05:1 surface step, with secondary-grey text. Code blocks now sit on a slightly lighter `--ui-code-bg` (`#211f1c` in classic) with a hairline border and primary text. Inline code uses the same tokens. The token was renamed from `--ui-sunken`, and region-comment captures now use `--ui-surface`. The theme check gates code text against its background. See the [final checks](verification/runs/2026-10-28-theming-final.md).

The user accepted the possible dark canvas before a light theme's CSS loads ("no prblems"); no change is planned.

## Skill rename — requested on 2026-10-28

The user requested renaming `outcome` to `show-outcome`. The skill directory, invocation name, display name, Codex skill link, test scripts, README and current wiki pages now use `show-outcome`. The feature page is [Show outcome](features/show-outcome.md) (`FEAT-show-outcome`).

The data and page names stay: the `outcome/v1` schema, `outcome.html` and the `outcome.json` example. They name the report being shown, not the skill, and keeping them lets existing drafts and session results still validate. Dated entries above, verification runs and evidence keep the old name as history; only their links now point to the renamed feature page. Sessions opened directly from the old source path, before assembled bundles existed, are not migrated.
