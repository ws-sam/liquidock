# Contributing to Liquidock

Liquidock is currently in its first browser-viewable prototype phase. We prioritize runtime correctness and honest architectural implementation over visual polish or "vibe-coded" patterns.

## Principles for Contributors

- **Runtime Correctness First**: Ensure that state management and lifecycle transitions are logically sound before worrying about aesthetics.
- **Keep UI Dumb**: React components and UI layers should be thin wrappers around the runtime state. Avoid smuggling hidden orchestration logic into the view.
- **Contract Integrity**: Tools must strictly adhere to the defined contracts.

## Repository Workflow

- `main`: stable public branch.
- `dev`: active integration branch.
- Pull requests should target `dev` unless a maintainer says otherwise.
