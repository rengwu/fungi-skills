---
title: Shared UI kit
updated: 2026-10-28
---
# Shared UI kit

**FEAT-fungi-ui**

Intent: provide documented UI building blocks that agents and independent Fungi workflows can compose, without maintaining separate implementations. Basis: the [accepted interview](../planning.md#shared-ui-decisions-accepted-on-2026-10-28).

## Entry points and prerequisites

`skills/fungi-ui/SKILL.md` routes authors to its component catalog, gallery and assembler. Install it alongside `fungi` and each desired workflow; Node.js 22+ is required for assembly. There is no package-install or build-framework prerequisite. A consumer needs no other workflow.

Workflow assemblers run `assemble({assets,entry,input})` from `skills/fungi-ui/scripts/assemble.mjs`. They return absolute page/input paths inside a fresh retained folder. Open those using the Fungi skill's host-specific route. The page is at the bundle root, above `workflow/assets/` and `fungi-ui/assets/`, so imports remain inside the served root.

## Expected behavior

- Shared source owns all existing reusable UI: native buttons/choices, feedback controls, rich content, tables/diagrams, inline image Notes, image previews, sandboxed interactive previews, region comments and shared styling.
- Workflows choose, compose and freely restyle components. They own their input/output schemas, validation and meaning. Reusable missing controls are added to the kit first.
- Keep component authoring separate from routine workflow use. When an assembler or equivalent handles the UI, the agent follows the workflow's input/invocation/result instructions without loading the kit guide or choosing components. Direct UI authoring can consult the kit. See the [accepted boundary](../planning.md#ui-authoring-boundary-accepted-on-2026-10-28).
- One maintained vendor directory supplies pinned Marked, DOMPurify and Pele files and licenses. Generated bundle copies are disposable runtime artifacts, not maintained source.
- Table prose wraps; short identifiers remain intact. Extra table width scrolls within a focusable region instead of overflowing the document.
- Inline image Notes preserve their positions, previewing, editing and browser undo. The shared editor context allocates IDs and enforces limits across ordinary Notes and region comments. Actual image positions remain distinct from typed image-like text.
- Preview messages are bound to the correct sandboxed frame/token. Authored prototypes use `fungiPreview.state`/`setState`; the `grill` alias remains compatible. Region comments retain their captured state independently of final preview state.
- Shared feedback handling debounces and orders saves, disables editing during submission, avoids duplicate submission and restores controls after errors. Workflow adapters keep `grill-form/v1` and `outcome/v1` unchanged.
- Assemblies copy input and assets into a unique retained directory; new source edits do not alter an already assembled session. Source templates are not the normal launch path. Generated local compatibility subtrees are excluded from new bundles.
- The working gallery demonstrates real components, style overrides, interactions and live theme switching. Its submitted demo schema does not establish project decisions.

## Themes

- Components read `--ui-*` tokens and live in the `fungi-base` cascade layer; themes live in `fungi-theme`. Unlayered workflow CSS overrides both. The token catalog is in `skills/fungi-ui/references/components.md`.
- `classic` (dark, refreshed) is the default. `paper` is the accepted second theme, set in Wikipedia's fonts, and `paper-dark` is its dark variant. The Mono and Neutral prototypes were deleted. Each theme sets `color-scheme` and may add structural rules under its own `[data-theme]` selector; a variant can share them through `:is()`.
- Each workflow template names its default with `data-theme`. A personal `settings.json` theme read by the assembler overrides it. Unknown names stop assembly. Routine callers never choose a theme.
- Bundled OFL fonts load from the kit; a page downloads only the faces and ranges it renders. Sandboxed previews are not themed.
- Every theme keeps text contrast at 4.5:1 or above and focus rings at 3:1 or above, and fits at 420 px.

## Verification recipes

See [setup](../verification/setup.md#shared-ui-kit-checks).

1. Run `node --test scripts/*.test.mjs`: workflow schemas, references/drafts, image offsets and assembly isolation/module resolution.
2. Run both native smoke drivers against the installed binary in isolated synthetic sessions: save/Close/reopen, inline images, choices, preview and captured region state.
3. Run `scripts/show-outcome-browser-smoke.mjs`: recommendation accessibility, selection, draft/submit retry, narrow table layout and screenshots.
4. Run `scripts/ui-browser-smoke.mjs`: the gallery's real controls with an injected public bridge, including style overrides, image editing, preview state, keyboard region selection and distinct captured state. Inspect screenshots.
5. Run each workflow assembler and `skills/fungi-ui/scripts/gallery.mjs`; validate four skill frontmatters and relative documentation links. Confirm installed sibling paths resolve.
6. Run `scripts/ui-theme-smoke.mjs` (every theme × gallery, outcome and grill-form: fonts, tokens, contrast, icons, 420 px) and `scripts/ui-theme-native-smoke.mjs` (tokens and fonts in Fungi's WebView). Inspect the screenshots.

## Coverage and limitations

Native checks cover the installed macOS WKWebView runtime. Browser checks use Chromium and a public-API test double; they do not prove native failures or host wake-up. Physical clipboard, OS undo shortcuts, long idle/sleep and Windows/Linux remain untested. The planning round demonstrated a real Codex callback and one collection before extraction; this run does not claim a fresh human round for the assembled UI or Claude automatic continuation.

## Design follow-up

The user's [design-reference collection](../design-references.md) led to the [theming decisions](../planning.md#theming-decisions-accepted-on-2026-10-28). After review, the user [accepted](../planning.md#paper-revision-accepted-on-2026-10-28) the refreshed classic theme and Paper as the second theme, with Wikipedia's fonts, fewer italics and a dark variant.

## Verification history

- [Shared UI extraction](../verification/runs/2026-10-28-ui-kit.md)
- [Theming spike](../verification/runs/2026-10-28-theming.md)
- [Paper revision](../verification/runs/2026-10-28-theming-revision.md)
- [Theme cleanup and code contrast](../verification/runs/2026-10-28-theming-final.md)
