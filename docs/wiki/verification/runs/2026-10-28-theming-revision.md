---
title: Paper revision checks
updated: 2026-10-28
result: Passed
---
# Paper revision checks

Passed for the [accepted Paper revision](../../planning.md#paper-revision-accepted-on-2026-10-28): fewer italics, Wikipedia's fonts and a `paper-dark` variant. It follows the [theming spike checks](2026-10-28-theming.md), which this run repeats for the five themes now present.

## Build and scope

The [manifest](../../evidence/2026-10-28-theming-revision/manifest.json) records Git base `d402fae`, hashes of the changed themes, fonts and drivers, and the installed Fungi `v0.1.0-alpha.2` binary. It also records the Wikipedia font probe made in headless Chrome on this Mac. Drivers and their limits are unchanged from the spike run.

## Results

| Scenario | Expected and observed | Result | Evidence |
| --- | --- | --- | --- |
| Models, assembly and theme resolution | 20 tests pass. The unknown-theme error now lists `paper-dark` | Passed | [Unit log](../../evidence/2026-10-28-theming-revision/unit-tests.log) |
| Themes across pages | 5 themes × gallery, outcome and grill-form pass fonts, tokens, icon, 420 px and contrast checks. Paper muted text is 5.43:1 and paper-dark muted text 6.67:1 | Passed | [Results](../../evidence/2026-10-28-theming-revision/themes/themes.json), [Paper outcome](../../evidence/2026-10-28-theming-revision/themes/paper-outcome-desktop.png), [paper-dark gallery](../../evidence/2026-10-28-theming-revision/themes/paper-dark-gallery-desktop.png) |
| Native WebView | Each theme applies its tokens in Fungi's WebKit view. Paper and paper-dark load only IBM Plex Mono; their text uses system fonts | Passed | [Native](../../evidence/2026-10-28-theming-revision/native-themes.json) |
| Visual inspection | Paper shows Georgia headings over a Helvetica body, ruled major headings, bold sans minor headings, and no italics apart from authored emphasis. Paper-dark shows the same structure on its dark ground | Passed | Screenshots above |

## Limits

Paper's fonts now depend on each machine, exactly as Wikipedia's do: Linux Libertine where installed, otherwise Georgia; the body is the platform sans-serif (Helvetica on macOS, Arial on Windows). Only macOS was observed. The spike run's other limits still apply.
