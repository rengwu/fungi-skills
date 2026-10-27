# Provenance and maintenance

The UI, model, notes editor, preview isolation and region-comment behavior derive from the user’s sibling jstack checkout at `ff6ac0bd2abfd6255b01e196aa8bc783f15efe26`:

- `skills/grill-form/assets/form.template.html`
- `skills/grill-form/assets/notes-editor.js`
- `skills/grill-form/assets/review.js`
- `skills/grill-form/scripts/model.mjs`
- `skills/grill-form/assets/examples.json` and `assets/vendor/`

The bundled renderer versions/hashes/licenses are preserved in [the vendor inventory](../assets/vendor/README.md). jstack’s interview workflow is used by reference when available; its grill-me text is not copied here.

Fungi’s `examples/jstack-grill-form/adapt.mjs` and `bridge.js` at base `a94e3ffd5dd1625cca724f74f8f40b3db5e894e7` informed the mapping from inline images to artifacts. That source checkout had uncommitted work; the runtime trial uses installed `v0.1.0-alpha.2`, not a build of that checkout.

Changes in this skill:

- Prepared `form.html` and `form.mjs` read `fungi.ready().input` directly; no per-round generator, template rewrite or browser download.
- The model’s answer validator uses browser-native bytes and receives a spec/answer array. Fungi owns session identity and input binding.
- `transport.mjs` maps data URLs to keyed Blob artifacts, validates submitted feedback, restores acknowledged drafts and checks advertised limits.
- The page debounces draft saves, orders persistence, prevents duplicate submission, preserves input after failure, adds explicit cancel and indicates manual delivery.
- The main page permits its own packaged scripts/modules; each preview retains its stricter sandbox/network restrictions.

Run `node --test scripts/*.test.mjs` and the spike’s `scripts/native-smoke.mjs` after transport/UI changes. Check native rendering before presenting a real round. Preserve evidence and source hashes in the project wiki. Tests and spike records are outside this portable skill directory.

Install this complete directory alongside the shared `fungi` skill, preserving the sibling layout used by the entrypoint’s link. Its UI remains bundled here; shared availability and session instructions live in that supporting skill. Updating jstack does not silently change this skill. Compare upstream behavior deliberately and reverify any imported changes.
