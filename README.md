# Liquidock

Liquidock is an open-source dock runtime for websites and apps. It manages tools, attached surfaces, and overlays through a shared runtime model.

**Current phase:** first honest browser-viewable prototype.

## What Liquidock is
- A runtime for dock-oriented tool orchestration
- A shared behavior model for tools, attached surfaces, and overlays
- A small monorepo focused on getting the runtime and the first browser-viewable prototype into a truthful state

## What Liquidock is not
- A navbar
- A UI kit
- A component library
- A polished production-ready framework

## Current prototype scope
The current prototype focuses on runtime behavior, not polish. It currently demonstrates:
- a minimal dock row
- tool activation
- one attached surface visible at a time
- a single-overlay model
- minimal React bindings over the runtime

Hard problems like drag, snapping, advanced layout, and animation are intentionally not solved yet.

## Getting started
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

### Project Structure
- `packages/core`: The hardware-agnostic runtime logic.
- `packages/react`: React bindings for the dock.
- `packages/tools`: Standard library and contracts for tools.
- `packages/glass`: Visual system and aesthetics layer.
- `apps/playground`: Minimal demo of current capabilities.

### Repository Workflow
We use a two-lane branch model:
- `main`: Stable release lane.
- `dev`: Active integration branch.

Please target all Pull Requests to the `dev` branch. For more details, see [CONTRIBUTING.md](./CONTRIBUTING.md).
