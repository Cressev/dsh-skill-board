# dsh-skill-board

Per-session skill board for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness): see which skills a conversation has been using, and switch them on or off for that conversation alone.

## What it does

- **Skills view beside the trajectory tab.** Every conversation gains a **Skills** tab next to **Trajectory**: overview cards, a usage donut, a call-ranked bar list, and one switch per skill.
- **Per-session statistics.** Call counts, error counts and last-used times are folded from that conversation's own event log — not a global counter.
- **Two-level enable/disable.** A global default (sidebar board, "All sessions") applies everywhere; a per-session override wins over it. An override equal to the global default is dropped automatically, so the board never stores noise.
- **Real enforcement.** Disabling registers a scope shadow in that agent's own layer, so the skill disappears from the model's `<available_skills>` catalog and the `skill` tool refuses to load it. Re-enabling restores it on the next step.
- **Sidebar board.** The same charts plus a session picker, for a workspace-wide view.

## Install

```sh
dsh plugin --profile web add dsh-skill-board
```

Then restart `dsh web` (the Web GUI picks the bundle up at boot) and reload the page. The **skill board** entry appears in the left sidebar, and every conversation shows a **Skills** tab beside **Trajectory**.

From a checkout instead of npm:

```sh
git clone https://github.com/Cressev/dsh-skill-board.git
dsh plugin --profile web add /absolute/path/to/dsh-skill-board
```

## Compatibility

- Requires DeepSeek Harness `0.2.1-rc.5` or newer (`0.2.x`); `engines.dsh` declares the range.
- Web profile only (the UI is a browser client).
- Peer dependencies are the harness packages a profile already provides; nothing is bundled twice.

## How the toggles work

The board never touches skill files. Disabling a skill registers a runtime shadow **in the agent's own scope layer** with `invocation: { modelInvocable: false, userInvocable: false }`. The skill registry resolves the nearest layer first, so:

1. the pre-step catalog rebuild filters the shadow out — the model no longer sees the skill;
2. calling the `skill` tool for it fails with "not available for invocation".

Session overrides are stored per session id and re-applied when that session's agent is created again. This is an official-level block on the tool path, not filesystem isolation: a model that deliberately reads the skill's `SKILL.md` from disk can still see the text.

## Development

```sh
pnpm install
pnpm build        # lib/index.mjs, lib/remote.mjs, lib/client.js
pnpm typecheck
```

The client bundle is emitted in the harness's dynamic-plugin form (`window.__ModuleLoader__.load({ id, factory })`) with styles inlined, so the package needs no build step at install time.

## Licence

MIT
