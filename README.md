# ws-sam / liquidock

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
The current prototype focuses on honest runtime behavior and an in-progress dock shell extraction. It currently demonstrates:
- a liquid-glass dock shell extracted toward a reusable open-source runtime
- tool activation
- one attached surface visible at a time
- a single-overlay model
- draggable dock positioning
- hover expansion and inline label reveal
- minimal React bindings over the runtime

Hard problems like snapping, persistence strategy, adaptive multi-surface layout, and richer tool/plugin APIs are still intentionally unresolved.

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
- `packages/core`: core runtime contracts and state orchestration.
- `packages/react`: React bindings for the dock.
- `packages/tools`: first-party tools and tool helpers.
- `packages/glass`: early visual layer work.
- `apps/playground`: Minimal demo of current capabilities.

### Repository Workflow
- `main`: stable public branch.
- `dev`: active integration branch.
- Pull requests should target `dev` unless a maintainer says otherwise.
