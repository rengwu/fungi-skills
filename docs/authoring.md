# Author a Fungi-powered skill

These examples separate the workflow, reusable interface components, and Fungi's native session lifecycle. Read the smallest example that matches what you want to build. [Show outcome](../skills/show-outcome/SKILL.md) is a report with optional feedback; [grill-form](../skills/grill-form/SKILL.md) adds questions, choices, interactive previews, and region comments.

## Follow the pieces

| Responsibility | Example source |
| --- | --- |
| Explain when to use the workflow and how to interpret feedback | `skills/show-outcome/SKILL.md` |
| Describe JSON input and returned feedback | `skills/show-outcome/references/authoring.md` |
| Validate input, restore drafts, and produce results | `skills/show-outcome/assets/model.mjs` |
| Compose components into the workflow's page | `skills/show-outcome/assets/outcome.mjs` |
| Set layout and workflow-specific styling | `skills/show-outcome/assets/outcome.html` and `outcome.css` |
| Package the page, input snapshot, and dependencies | `skills/show-outcome/scripts/assemble.mjs` |
| Reuse controls, notes, previews, rendering, and themes | `skills/fungi-ui/` |
| Check the runtime, launch, and collect the session | `skills/fungi/SKILL.md` |

The agent running a prepared workflow supplies JSON and invokes its assembler. It does not need to select components or read the UI catalog each time. Component knowledge belongs in the implementation and becomes relevant when authoring or changing an interface.

## Trace a complete example

With Node.js 22+ installed, save a report input in a temporary directory:

```json
{
  "schema": "outcome/v1",
  "id": "authoring-example",
  "title": "A first Fungi report",
  "markdown": "This report demonstrates **rich content** and optional feedback.",
  "nextSteps": [{"id": "extend", "label": "Add a visual preview"}]
}
```

Assemble it from this checkout, substituting the input file's absolute path:

```sh
node skills/show-outcome/scripts/assemble.mjs --input /absolute/path/to/outcome.json
```

The command returns retained `html` and `input` paths. Follow [fungi](../skills/fungi/SKILL.md) to check availability, choose the host's delivery mode, open those paths, and receive the exact session's result. Keep its bundle available for reopening. A submitted report uses `outcome/v1`; notes and selected next steps are interpreted by the workflow, while a closed window establishes no decision.

For a richer example, assemble `skills/grill-form/assets/examples.json` with `skills/grill-form/scripts/assemble.mjs`. Keep example sessions separate from real decisions. Explore reusable controls with `node skills/fungi-ui/scripts/gallery.mjs`, then open its returned page through Fungi.

## Adapt the pattern

Copy the smallest workflow into a new sibling skill directory and give it a distinct name and result schema. Keep its page, styles, model, and input/output guide together. Use the [component catalog](../skills/fungi-ui/references/components.md) for controls and events, and installed `fungi help html` for the runtime API. Local styling and composition belong to the workflow; generally reusable controls belong to the UI kit.

The shared assembler copies `workflow/assets/` and `fungi-ui/assets/` beneath the HTML entry page, retaining sibling module imports and vendored assets. It snapshots the input so later edits do not change an open session. Install the skill with its `fungi` and `fungi-ui` siblings; do not refer to a developer's checkout or copy generated bundles back into source.

Use the existing tests and [verification recipes](wiki/verification/setup.md) as examples: verify the schema and meaningful feedback behavior, then exercise the actual native page, draft recovery, and artifacts. Synthetic fixtures must not submit answers into a human session. Preserve third-party licenses when reusing assets.

Daily-use implementations are maintained in [jstack](https://github.com/rengwu/jstack). Keep example-specific explanations and experiments here; carry changes between repositories deliberately when they serve both purposes.
