# Contributing to Liquidock

Liquidock is in its first honest browser-viewable prototype phase. The quality bar is runtime correctness first, visual polish second, and workflow hygiene throughout.

---

## Principles

- **Runtime correctness first** — state transitions and lifecycle behavior matter more than surface polish
- **Keep UI dumb** — React and view layers should stay thin wrappers over runtime state
- **Contract integrity** — tools and surfaces must obey the defined contracts
- **One PR, one thing** — don't bundle runtime changes, docs rewrites, and workspace setup into one branch

---

## Branching and PRs

- `main`: stable public branch
- `dev`: active integration branch
- Pull requests should target `dev` unless a maintainer says otherwise

Canonical Mad House workflow standard:

https://github.com/madebymadhouse/bot-dev-playbook/blob/main/AGENTIC_GIT_WORKFLOW.md

Use branch names like:

```text
feat/short-description
fix/short-description
docs/short-description
chore/short-description
```

---

## Local Workflow

```bash
pnpm install
pnpm build
pnpm dev
```

If you change runtime behavior, verify it in `apps/playground` and describe exactly what you tested in the PR.

---

## Commit Format

All commits must follow Conventional Commits:

```text
feat(core): add runtime contract for pinned tools
fix(react): preserve active surface on dock drag
docs(readme): clarify prototype scope
ci: add pr-check workflow
```

---

## Agent Shortcuts

`@delegator` routes the work.
`@git-keeper` handles branch, commit, and PR hygiene.
`@reviewer` checks the change before merge.
`@writer` and `@beautiful-readme` keep docs human.
