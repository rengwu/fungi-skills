# fungi-skills

Develop and exercise workflow skills through real daily use. [grill-form](skills/grill-form/SKILL.md) conducts interviews and visual reviews; the shared [fungi](skills/fungi/SKILL.md) skill handles the interface runtime.

The [project wiki](docs/wiki/index.md) holds decisions, findings, features, verification and feedback. Build its offline reader with:

```sh
node docs/wiki/_build.mjs
node docs/wiki/_build.mjs --check
```

If the local builder is missing, copy `../jstack/skills/wiki/assets/_build.mjs` to `docs/wiki/_build.mjs`. Node 22+ is needed for wiki maintenance and tests, not for running the skill.

Install both complete directories, `skills/fungi/` and `skills/grill-form/`, as siblings using your agent’s normal skill mechanism. The workflow explicitly loads its shared dependency through a relative link. For a one-off trial, ask the agent to use the workflow’s `SKILL.md` in this checkout. The shared skill recognizes `fungi` on PATH and halts with setup instructions if it is missing or unrecognized.

New workflow skills can use the same supporting skill: link to it once for availability, presentation and response collection, then keep their own instructions about the task, interface, data and interpretation. Detailed runtime API guidance comes from installed `fungi help` topics when needed.

Tests: `node --test scripts/*.test.mjs`. Native smoke recipe: [verification setup](docs/wiki/verification/setup.md).
