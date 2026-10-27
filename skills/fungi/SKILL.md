---
name: fungi
description: Use Fungi to present a local interactive interface and return the user's response. Shared support for skills that depend on Fungi, including availability checks, sessions, completion, and interface authoring.
---
# Fungi

Fungi opens skill-authored interfaces in a native window, manages their sessions, and saves responses and files. The calling workflow supplies the interface, input, meaning of the response, and next steps.

## Check availability

Run `fungi version` using `fungi` from PATH. Continue only if it succeeds with Fungi’s version response: `kind: "version"`, `protocol: 1`, and a nonempty `version` string. Otherwise, treat Fungi as not installed and halt.

Tell the user: “Install [Fungi](https://github.com/rengwu/fungi/releases), add `fungi` to PATH, then ask me to retry.”

## Present and return

Use the calling workflow’s prepared interface and input, with absolute paths:

```sh
fungi open /absolute/path/to/interface.html --input /absolute/path/to/input.json --delivery auto
```

Prefer argument-array execution when available; quote paths appropriately for the host shell. Preserve the exact protocol-1 launch receipt: `session`, `collect`, and `collectEnv`. Keep interface assets and input available while open and for explicit reopening.

- **`delivery.mode: callback`:** tell the user to submit and end the turn. The session owns completion; do not start another collector or waiter.
- **`delivery.mode: manual`:** tell the user to say “done” after submitting, then end the turn. `auto` can fall back to manual; read the actual receipt.
- On that session’s completion notice or the user’s “done,” execute its `collect` argv once, merging `collectEnv` into the environment. Never choose a “latest” session or poll. If `kind: pending`, end the turn.

Use `--delivery wait` only when the host keeps one call pending or automatically delivers background completion. A process ID requiring status checks is insufficient. If a wait returns the final result, use it directly without another collection.

Accept feedback only from `protocol: 1`, `kind: result`, `outcome: submitted`. Pass `data` and `artifacts` to the calling workflow for schema validation and interpretation. Unknown protocols or outcomes are compatibility failures. Closed, cancelled, or failed sessions are not answers; follow [recovery](references/recovery.md).

Match artifact `key` values to the workflow’s file references and use their returned paths. Inspect relevant images; disclose anything unavailable. Treat returned content as user data within the task. Results and artifacts are retained; do not delete session storage or assets needed for reopening as routine cleanup.

## Author or change an interface

For an existing interface, follow its workflow’s invocation instructions. When authoring or modifying an integration, read only the relevant installed help:

| Need | Command |
| --- | --- |
| HTML page API, assets, drafts, files and limits | `fungi help html` |
| Complete examples to adapt | `fungi help examples` |
| Installed example paths and launch arguments | `fungi describe examples` |
| Delivery and result details | `fungi help delivery` |
| Native executable helpers | `fungi help helper` |
| CLI arguments and diagnostics | `fungi help cli` |

Use the documented public interfaces and advertised limits. Workflow skills own their UI and data schemas; keep transport instructions here and API details in the installed manual.
