# GitHub Repository Setup

## Initial Local Setup

If you are initializing the repository locally:

```bash
# Set up main
git checkout -b main
git add .
git commit -m "chore: initial bootstrap"
git push origin main

# Set up dev
git checkout -b dev
git push origin dev
```

## Branch Protection Settings

Recommended configurations for repository administrators:

### `main` branch (Strict)
- **Require a pull request before merging**: Enabled.
- **Required approvals**: 1.
- **Dismiss stale pull request approvals when new commits are pushed**: Enabled.
- **Require conversation resolution before merging**: Enabled.
- **Enforce restrictions for administrators**: Optional, but recommended for stability.

### `dev` branch (Lighter)
- **Require a pull request before merging**: Enabled.
- **Required approvals**: 0 (allows faster integration in early stages).
- **Require status checks to pass before merging**: Enabled (once CI is active).
- **Require conversation resolution before merging**: Enabled.

## Default Branch
Set `dev` as the default branch in GitHub settings so that all new Pull Requests target the integration lane by default.

## Pull Request Flow
1. Contributor opens PR: `feature -> dev`.
2. Review and merge into `dev`.
3. Periodic sync: `dev -> main` (Squash or Merge commit) to update stable.
