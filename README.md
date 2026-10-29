# fungi-skills

Examples and documentation for authoring skills powered by [Fungi](https://github.com/rengwu/fungi). This repository preserves runnable examples of native interfaces, reusable UI components, and workflow-specific feedback handling.

The maintained daily-use collection lives in [jstack](https://github.com/rengwu/jstack), which includes all four skills and their assets. Jstack is self-contained and does not load files from this repository. These examples can evolve to explain authoring patterns; they are not an installation dependency or an automatically synchronized copy of jstack.

## Examples

| Skill | What it demonstrates |
| --- | --- |
| [fungi](skills/fungi/SKILL.md) | Shared availability checks, native sessions, delivery, collection, and recovery |
| [fungi-ui](skills/fungi-ui/SKILL.md) | Reusable components, free composition, themes, and retained bundle assembly |
| [grill-form](skills/grill-form/SKILL.md) | Decision interviews and visual reviews with choices, previews, notes, and artifacts |
| [show-outcome](skills/show-outcome/SKILL.md) | Rich results with optional feedback, selectable next steps, and a detailed CLI summary |

Start with the [authoring walkthrough](docs/authoring.md). The workflows are independent: each owns its page, input/result schema, and interpretation, while composing `fungi-ui` and following `fungi` for the runtime.

## Run and explore

The [project wiki](docs/wiki/index.md) holds decisions, findings, features, verification and feedback. Build its offline reader with:

```sh
node docs/wiki/_build.mjs
node docs/wiki/_build.mjs --check
```

If the local builder is missing, copy `../jstack/skills/wiki/assets/_build.mjs` to `docs/wiki/_build.mjs`. Node 22+ is needed for workflow assembly, wiki maintenance and tests.

For a one-off trial, ask the agent to use a workflow's `SKILL.md` in this checkout. To install the examples, copy `skills/fungi/`, `skills/fungi-ui/` and the desired workflow directories (`skills/grill-form/` and/or `skills/show-outcome/`) as siblings using your agent’s normal skill mechanism. Prefer jstack for daily use. Each workflow needs its own directory, `fungi` and `fungi-ui`; neither requires the other workflow. The agent reads `fungi` for session handling; the assembler loads UI dependencies mechanically. Routine callers do not need to read `fungi-ui/SKILL.md`. The shared skill recognizes `fungi` on PATH and halts with setup instructions if it is missing or unrecognized.

To activate results for the current conversation, ask: “Use show-outcome for results in this conversation.” The agent chooses when it is useful, favoring use when unsure. Windows are welcome. Agents choose the content and visuals while the prepared outcome page handles layout. The CLI keeps a detailed summary, only slightly shorter than the window content.

New workflow skills compose the kit’s components and may freely override their styles. Each workflow owns its assembler, layout, data and interpretation. Reusable controls are added to the kit first. See its [catalog](skills/fungi-ui/references/components.md) and runnable gallery. The shared supporting skill handles availability, presentation and response collection. Detailed runtime API guidance comes from installed `fungi help` topics when needed.

Keep this authoring boundary in future skills wherever a mechanical assembler or equivalent is suitable: the agent supplies workflow input and runs the helper, while the implementation selects and packages components. Component documentation is for creating or changing interfaces, not a prerequisite to running a prepared workflow. Direct UI authoring can use the kit when the task calls for it.

Tests: `node --test scripts/*.test.mjs`. Native smoke recipe: [verification setup](docs/wiki/verification/setup.md).

Assemblers print retained `html` and `input` paths. Open those paths through Fungi; the source HTML files are templates. Generated bundles contain the shared assets beneath the entry page, keep input snapshots and support reopening without reassembly.
