# MishBaby Git Workflow

## Audit snapshot (2026-07-16)

- Remote: `origin` -> `https://github.com/MaorSaadia/MishBabyStore.git`
- Remote HEAD / inferred production branch: `main`
- Original branch at audit start: `feature/mishbaby-affiliate-redesign`
- Working branch: `feature/mishbaby-affiliate-redesign`
- Tracking branch: `origin/feature/mishbaby-affiliate-redesign`
- Initial working tree: clean
- Development branch status: already existed locally and remotely; it was not created by this audit
- At the audit start, local `main`, `origin/main`, the feature branch, and its remote-tracking branch all pointed to commit `2b188a7`.

The production branch is inferred from `git remote show origin`, which reports `HEAD branch: main`. Vercel project settings are not stored in this repository, so the Vercel production-branch setting was not independently verified or changed.

## Required workflow

1. Run `git status --short --branch`, `git branch --show-current`, and `git remote -v` before edits.
2. Confirm the explicitly named feature branch. Never develop directly on `main` or another production branch.
3. Preserve uncommitted user changes. Do not discard, overwrite, stash, or commit unrelated work.
4. Fetch before creating a missing feature branch. If the branch exists remotely, track it. If it does not exist, create it from the latest production branch only when the tree is clean.
5. Keep changes narrowly scoped and report the proposed commit contents before committing.
6. Use small, descriptive commits after explicit approval.
7. Push only the feature branch after explicit approval. Do not force-push unless explicitly authorized and justified.
8. Use a reviewed pull request to merge later; do not merge into production as part of ordinary implementation work.
9. Never deploy, use production deployment flags, or change the Vercel production branch without explicit instruction.

## Pre-commit checks

Run applicable commands exposed by the repository:

```text
npm run lint
npx tsc --noEmit
npm test                 # only if a test script is added
npm run build
```

Report missing scripts, warnings, and failures rather than installing or upgrading tooling as a side effect.

