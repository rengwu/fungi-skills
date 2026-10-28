# fungi-skills

Develop and exercise workflow skills through real daily use. [show-outcome](skills/show-outcome/SKILL.md) presents rich results with optional feedback and a detailed CLI summary; [grill-form](skills/grill-form/SKILL.md) conducts interviews and visual reviews. They are independent workflows whose interfaces compose shared [fungi-ui](skills/fungi-ui/SKILL.md) components. The shared [fungi](skills/fungi/SKILL.md) skill handles the interface runtime.

The [project wiki](docs/wiki/index.md) holds decisions, findings, features, verification and feedback. Build its offline reader with:

```sh
node docs/wiki/_build.mjs
node docs/wiki/_build.mjs --check
```

If the local builder is missing, copy `../jstack/skills/wiki/assets/_build.mjs` to `docs/wiki/_build.mjs`. Node 22+ is needed for workflow assembly, wiki maintenance and tests.

Install `skills/fungi/`, `skills/fungi-ui/` and the desired workflow directories (`skills/grill-form/` and/or `skills/show-outcome/`) as siblings using your agent’s normal skill mechanism. Each workflow needs its own directory, `fungi` and `fungi-ui`; neither requires the other workflow. The agent reads `fungi` for session handling; the assembler loads UI dependencies mechanically. Routine callers do not need to read `fungi-ui/SKILL.md`. For a one-off trial, ask the agent to use the workflow’s `SKILL.md` in this checkout. The shared skill recognizes `fungi` on PATH and halts with setup instructions if it is missing or unrecognized.

To activate results for the current conversation, ask: “Use show-outcome for results in this conversation.” The agent chooses when it is useful, favoring use when unsure. Windows are welcome. Agents choose the content and visuals while the prepared outcome page handles layout. The CLI keeps a detailed summary, only slightly shorter than the window content.

New workflow skills compose the kit’s components and may freely override their styles. Each workflow owns its assembler, layout, data and interpretation. Reusable controls are added to the kit first. See its [catalog](skills/fungi-ui/references/components.md) and runnable gallery. The shared supporting skill handles availability, presentation and response collection. Detailed runtime API guidance comes from installed `fungi help` topics when needed.

Keep this authoring boundary in future skills wherever a mechanical assembler or equivalent is suitable: the agent supplies workflow input and runs the helper, while the implementation selects and packages components. Component documentation is for creating or changing interfaces, not a prerequisite to running a prepared workflow. Direct UI authoring can use the kit when the task calls for it.

Tests: `node --test scripts/*.test.mjs`. Native smoke recipe: [verification setup](docs/wiki/verification/setup.md).

Assemblers print retained `html` and `input` paths. Open those paths through Fungi; the source HTML files are templates. Generated bundles contain the shared assets beneath the entry page, keep input snapshots and support reopening without reassembly.
