---
name: outcome
description: Present results in a Fungi window with optional feedback and a detailed, slightly shorter CLI summary. Use when requested or when useful in a conversation where the user has enabled outcome.
---
# Outcome

Read [fungi](../fungi/SKILL.md) for presenting an interface and receiving feedback.

Present the response you would otherwise give in a Fungi window. Choose the content, structure and visuals freely to suit the task. Once enabled, use your judgment about when an outcome is useful for the rest of the conversation. When in doubt, use it.

Make clear what was accepted, what remains proposed, and what was actually implemented or checked.

Use the prepared [page](assets/outcome.html) and its [input format](references/authoring.md). Focus on the problem and the response; the page handles the layout and always provides optional Notes. Keep questionnaires and spikes in their own sessions.

Keep a detailed summary in the CLI, only slightly more concise than the window's content, so its conclusions, reasoning, caveats and next steps remain traceable. If the window fails to open, explain briefly and give the result in the CLI.

Reading needs no acknowledgment; submitting feedback closes the window. Read the Notes against the outcome the user saw, even if newer work has happened. Closing the window or leaving no feedback does not establish a decision.

Continue from the feedback. Receiving feedback or dismissing a window does not itself need another outcome.

## Prepared-page example

Save as `outcome.json`:

```json
{
  "schema": "outcome/v1",
  "id": "round-1",
  "title": "Outcome",
  "markdown": "The changes are ready for review."
}
```

Then launch with absolute paths:

```sh
fungi open /absolute/path/to/outcome/assets/outcome.html \
  --input /absolute/path/to/outcome.json --delivery auto
```
