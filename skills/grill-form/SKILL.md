---
name: grill-form
description: Run batched decision interviews and visual reviews, then interpret the feedback. Use when the user requests grill-form or a grill form through Fungi.
---
# Grill form

Read and follow [fungi](../fungi/SKILL.md) for availability, presentation, and response collection before preparing a round.

## Prepare the round

Establish what the user needs to decide or review. For decision interviews, use the project’s grill-me/plan workflow when available; otherwise ask consequential unresolved questions and recommend an answer when useful. For design critique, show the design and invite open feedback. Reuse settled context.

Write a UTF-8 JSON file in a unique temporary directory. Use [authoring](references/authoring.md) for the schema, previews, and examples. Keep rounds to 1–10 items. Show the design being judged when appearance matters; allow notes and partial feedback. Unanswered items remain unresolved.

## Present the form

Use the prepared [page](assets/form.html) and the round’s question file, with absolute paths. The UI and libraries are bundled; no generator, package installation, or per-round UI development is needed.

```sh
fungi open /absolute/path/to/grill-form/assets/form.html --input /absolute/path/to/questions.json --delivery auto
```

## Interpret the feedback

For a submitted result, require `data.schema: grill-form/v1`. If the schema is unrecognized, preserve the result and report incompatibility before interpreting it.

`data.answers` includes the original question, selected label, notes, `status`, final prototype `states`, and comments. A comment’s `state` is its own captured view; it may differ from final `states`. `status: untouched` is unresolved, never approval. Images use inline `[Image #N]` references and `artifact` keys; preserve their positions when interpreting the notes.

## Continue the work

Distinguish submitted feedback from accepted decisions. Record accepted outcomes and important open questions in the target project’s existing notes, with relevant evidence. Do not create a wiki just to run a form.

Use another round when consequential questions remain; otherwise continue the original task. A changed sample or preview setting is feedback, not automatically a request to change the product.
