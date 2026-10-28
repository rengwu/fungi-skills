---
title: Theme cleanup and code contrast checks
updated: 2026-10-28
result: Passed
---
# Theme cleanup and code contrast checks

Passed for the [accepted cleanup](../../planning.md#theme-cleanup-accepted-on-2026-10-28): Mono and Neutral are deleted, and code blocks have readable contrast. The kit now ships `classic`, `paper` and `paper-dark`. This run repeats the [revision checks](2026-10-28-theming-revision.md) and both regression drivers.

## Build and scope

The [manifest](../../evidence/2026-10-28-theming-final/manifest.json) records Git base `d402fae`, hashes of the stylesheets, catalog and drivers, the colours sampled from the user's screenshot, and the installed Fungi `v0.1.0-alpha.2` binary.

## Results

| Scenario | Expected and observed | Result | Evidence |
| --- | --- | --- | --- |
| Models, assembly and theme resolution | 20 tests pass. The available list is `classic, paper, paper-dark` | Passed | [Unit log](../../evidence/2026-10-28-theming-final/unit-tests.log) |
| Code contrast | User report: classic's block was `#100f0d` on `#161513` (1.05:1 surface step) with secondary text. It is now a lighter `#211f1c` block with a hairline border and primary text. Code text on its background is 13.35:1 in classic, 12.53:1 in paper and 12.41:1 in paper-dark, now gated at 4.5:1 | Passed | [Before](../../evidence/2026-10-28-theming-final/classic-code-before-user.png), [after](../../evidence/2026-10-28-theming-final/classic-code-after.png) |
| Themes across pages | 3 themes × gallery, outcome and grill-form pass fonts, tokens, icon, 420 px and contrast checks | Passed | [Results](../../evidence/2026-10-28-theming-final/themes/themes.json) |
| Native WebView | Each remaining theme applies its tokens and bundled fonts in Fungi's WebKit view | Passed | [Native](../../evidence/2026-10-28-theming-final/native-themes.json) |
| Gallery and outcome regressions | Overrides, image Notes, preview state, region comments, single submission, selection, retry and narrow layout pass under classic | Passed | [Gallery](../../evidence/2026-10-28-theming-final/gallery.json), [outcome](../../evidence/2026-10-28-theming-final/browser.json) |

## Limits

Surface separation (code block against page) is a judgement, not a gated ratio; only code text contrast is gated. The spike run's other limits still apply, including the possible dark canvas before a light theme's CSS loads.
