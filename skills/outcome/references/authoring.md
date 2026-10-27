# Prepared page

The bundled [page](../assets/outcome.html) needs only this input:

```json
{
  "schema": "outcome/v1",
  "id": "result-1",
  "title": "Result",
  "markdown": "Your response."
}
```

```sh
fungi open /absolute/path/to/outcome/assets/outcome.html --input /absolute/path/to/outcome.json --delivery auto
```

Install `outcome` and the shared `fungi` skill as siblings. The page, scripts and libraries are bundled in outcome.

## Input

| Field | Format |
| --- | --- |
| `schema` | `outcome/v1` |
| `id` | Distinct report ID: 1–80 letters, digits, underscores or hyphens; starts with a letter/digit |
| `title` | Required, up to 200 characters |
| `projectName` | Optional label |
| `markdown` | Required, up to 900,000 characters; Fungi's overall input limit also applies |

Markdown supports tables, code and fenced Mermaid. Diagrams render offline without configuration directives, links or external images. Raster images use PNG/JPEG/GIF/WebP data URLs; remote/file/SVG image URLs are not loaded. Raw HTML displays as text. Web links display their labels and URLs.

The report is followed by optional Notes. Questionnaire input is not supported.

## Feedback

Submitted data has `schema: outcome/v1`, `outcomeId`, `title` and one `answers` entry with `questionId: outcome-notes`. Match `outcomeId` to the report and read its `notes`.

Pasted images appear in Notes as `[Image #N]`. Each `images` entry supplies its `id`, text `offset`, `mimeType` and `artifact` key. Match keys to Fungi's returned artifacts and inspect the images alongside their text. Notes allow 12,000 characters and up to 20 images, 5 MiB per image and 20 MiB total, subject to Fungi's limits.

Empty Notes cannot submit. Drafts and images use Fungi's normal persistence and collection. Old combined-round drafts are incompatible with this report-only page and are preserved for recovery.
