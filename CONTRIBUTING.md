# Contributing to Liquidock

Liquidock is currently in its first browser-viewable prototype phase. We prioritize runtime correctness and honest architectural implementation over visual polish or "vibe-coded" patterns.

## Principles for Contributors

- **Runtime Correctness First**: Ensure that state management and lifecycle transitions are logically sound before worrying about aesthetics.
- **Keep UI Dumb**: React components and UI layers should be thin wrappers around the runtime state. Avoid smuggling hidden orchestration logic into the view.
- **Contract Integrity**: Tools must strictly adhere to the defined contracts.

## Branch Strategy

- `main`: Stable release lane.
- `dev`: Default integration lane for all active development.

## Workflow

1. Create a feature branch from `dev`.
2. Implement focused, atomic changes.
3. Submit a Pull Request targeting `dev`.
4. After validation, `dev` is periodically merged into `main`.
