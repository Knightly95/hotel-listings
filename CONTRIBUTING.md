# Contributing

Thanks for taking the time to look at this project. This guide explains how to set it up, what a change must pass before it's merged, and the conventions the code follows.

This repo is being modernized step by step; see the [roadmap](README.md#roadmap). Changes that move it along the roadmap are the most welcome.

## Set up

You need Node.js 22 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

No API key, account or backend is needed. The hotels come from the app's own route handler, and the map uses MapLibre GL with OpenFreeMap tiles.

## Workflow

1. Open an issue first for anything larger than a small fix, so the approach can be agreed before you write code.
2. Create a branch from `main`: `feat/short-name`, `fix/short-name`, `refactor/short-name`, `docs/short-name` or `chore/short-name`.
3. Keep the change small and focused on one thing. A roadmap step is split into small pull requests, for example one component per pull request for the Tailwind migration.
4. Open a pull request against `main` and fill in the template. Nothing is pushed straight to `main`.

## Checks

Run these before you open a pull request. CI runs all of them on every pull request.

| Check        | Command                                                                  |
| ------------ | ------------------------------------------------------------------------ |
| Lint         | `npm run lint`                                                           |
| Types        | `npx tsc --noEmit`                                                       |
| Tests        | `npm test`                                                               |
| Static build | `STATIC_EXPORT=true NEXT_PUBLIC_BASE_PATH=/hotel-listings npm run build` |

The static build is the one that is deployed, so check it when you touch routing, data loading or assets.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:` or `ci:`, followed by a short summary in the imperative. Explain the reason for the change in the body when it isn't obvious.

## Refactoring pull requests

This repo is a public refactoring exercise, so a refactoring pull request should show what it changed and what it cost or saved:

- Behaviour stays the same. The existing tests pass without being weakened.
- Include before and after numbers that you measured, for example bundle size from the build output, or lines of code. Don't estimate.
- Tick the step in the README roadmap when it is complete.

## Code conventions

The full reference is [AGENTS.md](AGENTS.md), which people and AI coding agents both follow. The rules that matter most:

- **TypeScript:** no `any` and no `@ts-ignore`. Shared types live in `src/interfaces`.
- **State:** the Zustand store in `src/store/hotelStore.ts` holds the hotels, filters, sort order and map bounds, and derives the visible hotels. Components don't filter or sort by themselves.
- **Text:** every visible string comes from `messages/en.json` and `messages/es.json` through next-intl. Add a key to both files.
- **Static export:** the site is deployed as static files. Anything that needs a server at request time breaks the deployment.
- **No third-party keys:** don't add a service that needs an account or an access token.
- **Paths:** build links and asset URLs with the base path in mind; the site is served from `/hotel-listings`.

## Tests

- Tests are in `__tests__/`, in a folder that mirrors `src/` (`components`, `store`, `utils` and so on), named `Name.test.tsx`.
- They use Jest and React Testing Library. Query by role and label, as a user would.
- Add or update tests in the same pull request as the behaviour change. A bug fix comes with a test that fails without the fix.
- Browser tests are Playwright specs in `e2e/`, run in CI against the static build. To run them locally: `STATIC_EXPORT=true npm run build && npm run test:e2e`.

## Reporting a bug

Open an issue with the bug report template. Include the steps to reproduce, what you expected and what happened, and the language you were using (English or Spanish).
