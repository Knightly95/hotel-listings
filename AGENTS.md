# AGENTS.md

Instructions for AI coding agents working in this repository. People follow the same rules; see [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow.

## Project

A hotel search page built with Next.js 14 (App Router) and TypeScript. Hotels are listed next to an interactive map; the list shows the hotels inside the visible map area, with filters, sorting and infinite scrolling, in English and Spanish.

It was written in 2024 and is being modernized in small steps as a public refactoring exercise. The [roadmap in the README](README.md#roadmap) says what is planned and in which order. The site is deployed to GitHub Pages as a static export.

## Commands

| Task          | Command                                                                  |
| ------------- | ------------------------------------------------------------------------ |
| Install       | `npm install`                                                            |
| Run locally   | `npm run dev`                                                            |
| Tests         | `npm test`                                                               |
| One test file | `npx jest __tests__/store/HotelStore.test.tsx`                           |
| Lint          | `npm run lint`                                                           |
| Type-check    | `npx tsc --noEmit`                                                       |
| Server build  | `npm run build`                                                          |
| Static build  | `STATIC_EXPORT=true NEXT_PUBLIC_BASE_PATH=/hotel-listings npm run build` |

`npm test` always collects coverage. `npm run test:watch` never exits; don't use it.

## Before you say a task is done

1. `npm run lint` passes.
2. `npx tsc --noEmit` passes.
3. `npm test` passes, including tests you added for the change.
4. If you touched routing, data loading, the map or assets, the static build passes.

Report what you ran and the result. If something fails and you can't fix it, say so; don't hide it.

## Structure

```text
__tests__/            Jest tests, in folders that mirror src/
cypress/              Original end-to-end tests; not run in CI (see the roadmap)
messages/             Translations: en.json, es.json
mocks/                Test data
src/
  api/                Client function that fetches the hotels
  app/
    [locale]/         The search page, one statically generated page per language
    api/hotels.json/  Route handler that serves the generated hotels
  components/         FilterSidebar, HotelCard, HotelList, MapView, layout/Header
  constants/          Filter options
  data/hotels.ts      Seeded generator: the same 300 hotels on every build
  interfaces/         Shared types
  store/hotelStore.ts Zustand store: hotels, filters, sort order, map bounds
  styles/             styled-components, one file per component
  utils/
```

## Rules

- **Follow the roadmap.** Do one roadmap step at a time and don't mix steps in one pull request. Don't start a migration (Tailwind, TanStack Query, Playwright) unless the task asks for it.
- **Refactoring keeps behaviour.** Existing tests must pass unchanged. If a test has to change, explain why in the pull request.
- **Measure, don't estimate.** Before and after numbers in a pull request (bundle size, lines of code, Lighthouse) must come from a command you ran. If you didn't measure it, don't state it.
- **Types.** No `any`, no `@ts-ignore`, no non-null assertions to silence errors.
- **State.** Filtering, sorting, paging and map bounds live in `hotelStore`. Components read derived data from the store (`useHotels`) and don't filter or sort by themselves.
- **Text.** No hard-coded visible strings. Add each key to both `messages/en.json` and `messages/es.json`.
- **Static export.** No code that needs a server at request time: no dynamic route handlers, no cookies or headers, no server actions. The route handler for the hotels is rendered at build time and must stay that way.
- **Base path.** The site is served from `/hotel-listings`. Use `next/link` and `NEXT_PUBLIC_BASE_PATH` for asset and API URLs. A hard-coded absolute path breaks the deployment.
- **No accounts or tokens.** The map uses MapLibre GL and OpenFreeMap because they need neither. Don't add a service that needs a key.
- **Data is deterministic.** `src/data/hotels.ts` uses a seeded generator. Don't use `Math.random()` or the current date there.
- **Styling.** styled-components in `src/styles/components`, one `NameStyled.tsx` per component, until the Tailwind migration reaches that component.
- **Language.** Code, comments and documentation are in English.

## Tests

- Jest with `next/jest`, React Testing Library and `jest-canvas-mock`. Test files are `__tests__/<area>/Name.test.tsx`.
- The map library is mocked in tests; jsdom has no WebGL.
- Query by role and label. Test what the user sees, not implementation details.
- Don't add Cypress tests. They will be replaced by Playwright.

## Guardrails

- Never commit `.env*` files, access tokens or other secrets.
- Don't commit build output or reports (`.next/`, `out/`, `coverage/`).
- Don't add a dependency without explaining why in the pull request.
- Don't push to `main`. Work on a branch and open a pull request.
- Keep changes small. If a request conflicts with these rules, say so and propose an alternative instead of complying silently.

## How AI is used in this project

AI coding agents are used for exploration, refactoring steps, tests and documentation. Every change is read, run and tested by a person before it is merged, and CI runs the lint, type-check, tests and static build on every pull request.
