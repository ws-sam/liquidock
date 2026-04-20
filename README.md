# Liquidock

Liquidock is an open-source dock runtime for websites and apps. It manages tools, attached surfaces, and overlays through a shared runtime model.

**Current phase:** first honest browser-viewable prototype.

---

## Don't Feel Like Reading?

Drop this repo into any AI assistant and ask it to explain the runtime model, walk you through the playground, or help you make a scoped change. Liquidock now follows the same Mad House branch / PR / agent workflow as the rest of the org.

---

## What Liquidock Is

- A runtime for dock-oriented tool orchestration
- A shared behavior model for tools, attached surfaces, and overlays
- A small monorepo focused on getting the runtime and the first browser-viewable prototype into a truthful state

## What Liquidock Is Not

- A navbar
- A UI kit
- A component library
- A polished production-ready framework

## Current Prototype Scope

The current prototype focuses on honest runtime behavior and an in-progress dock shell extraction. It currently demonstrates:

- a liquid-glass dock shell extracted toward a reusable open-source runtime
- tool activation
- one attached surface visible at a time
- a single-overlay model
- draggable dock positioning
- hover expansion and inline label reveal
- minimal React bindings over the runtime

Hard problems like snapping, persistence strategy, adaptive multi-surface layout, and richer tool/plugin APIs are still intentionally unresolved.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Build the workspace from the repo root:

```bash
pnpm build
```

Run the playground from the repo root:

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

`pnpm dev` runs `apps/playground`. It is the current honest browser-viewable prototype, not a finished product.

---

## Project Structure

- `packages/core`: core runtime contracts and state orchestration
- `packages/react`: React bindings for the dock
- `packages/tools`: first-party tools and tool helpers
- `packages/glass`: early visual layer work
- `apps/playground`: minimal demo of current capabilities

## Repository Workflow

- `main`: stable public branch
- `dev`: active integration branch
- Pull requests should target `dev` unless a maintainer says otherwise

Shared workflow standard:

https://github.com/madebymadhouse/bot-dev-playbook/blob/main/AGENTIC_GIT_WORKFLOW.md

## Agents

The full Mad House fleet can be dropped into `.github/agents/` and used to keep work scoped and reviewable.

| Agent | What it does |
|---|---|
| `@delegator` | Single entry point — routes work to the right specialist agents |
| `@git-keeper` | Branching, commits, PR descriptions, and merge hygiene |
| `@coder` | Writes or changes production code |
| `@reviewer` | Reviews changes before PR or merge |
| `@writer` | Humanizes docs and prose |
| `@beautiful-readme` | README structure and presentation |
| `@auditor` | Structured repo audit |
| `@security` | Security audit — secrets, auth, injection, deps |
