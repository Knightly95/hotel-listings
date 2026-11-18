# Hotel Listings

[![CI & Deploy](https://github.com/Knightly95/hotel-listings/actions/workflows/deploy.yml/badge.svg)](https://github.com/Knightly95/hotel-listings/actions/workflows/deploy.yml)
[![Coverage](https://img.shields.io/endpoint?url=https%3A%2F%2Fknightly95.github.io%2Fhotel-listings%2Fcoverage-badge.json)](#tests)

**[▶ Live demo](https://knightly95.github.io/hotel-listings/)**: no sign-up, API key or backend is needed.

> **Background:** I built this project in 2024 as a take-home for a frontend technical assessment in a hiring process. The commit history is the original one. I am now modernizing it step by step as a public refactoring exercise; see the [roadmap](#roadmap).

A hotel search page built with Next.js and TypeScript. Hotels are listed next to an interactive map, and the list follows the map: move or zoom the map and only the hotels in view are shown.

## Screenshot

[![Hotel search page: filters on the left, the hotel list in the middle and a map of Tenerife with markers on the right](docs/screenshots/search.png)](docs/screenshots/search.png)

The list shows only the hotels inside the visible map area. Move or zoom the map and the list follows.

## Features

- **Map and list in sync:** the list shows the hotels inside the visible map area, and each hotel has a marker with a popup.
- **Filters and sorting:** filter by star rating and price range, sort by price.
- **Infinite scrolling:** more hotels load as you scroll the list.
- **Two languages:** English and Spanish, with the visitor's browser language picked automatically.
- **Own API:** `GET /api/hotels.json` serves 300 generated hotels around real towns in Tenerife.

## Tech stack

Next.js 14 (App Router) · TypeScript · Zustand · next-intl · MapLibre GL with OpenFreeMap tiles · styled-components · Jest + React Testing Library

## Getting started

Prerequisite: Node.js 22 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script          | What it does                         |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the development server         |
| `npm run build` | Build for production                 |
| `npm start`     | Serve the production build           |
| `npm run lint`  | Run ESLint                           |
| `npm test`      | Run the tests with a coverage report |

With Docker:

```bash
docker build -t hotel-listings .
docker run -p 3000:3000 hotel-listings
```

## How it works

- **Data:** [`src/data/hotels.ts`](src/data/hotels.ts) generates the hotels with a seeded random generator, so every build has the same data. The route handler in [`src/app/api/hotels.json/route.ts`](src/app/api/hotels.json/route.ts) serves it and is rendered at build time.
- **Map:** [MapLibre GL](https://maplibre.org/) renders OpenStreetMap data from [OpenFreeMap](https://openfreemap.org/). Neither needs an account or an access token.
- **State:** a Zustand store holds the hotels, the active filters, the sort order and the map bounds, and derives the visible page of hotels.
- **Languages:** next-intl with one statically generated page per language.

## Tests

`npm test` runs the Jest and React Testing Library tests for the store, the data generator, the API client, the utilities and the components. CI measures line coverage on every push to `main` and publishes the number shown in the badge above.

## Quality checks

A second CI job builds the app and checks what visitors get:

- **Lighthouse** (mobile settings): the build fails if accessibility drops below 95 or best practices below 90; performance and SEO are reported. Last run: performance 60, accessibility 100, best practices 100, SEO 100. Measured on `/en/` and `/es/`. Performance is held back by the map and the old stack; improving it is part of the roadmap below.
- **Bundle budget:** the JavaScript sent to the browser must stay under 465 kB gzip (today: 442.8 kB). To check locally: `STATIC_EXPORT=true npm run build && node scripts/bundle-budget.mjs out 465`.

The Lighthouse report is attached to each CI run.

## Contributing

- [`CONTRIBUTING.md`](CONTRIBUTING.md): setup, checks, conventions and how to propose a change.
- [`AGENTS.md`](AGENTS.md): commands, rules and guardrails for AI coding agents.

## Deployment

Every push to `main` is linted, type-checked, tested, built as a static site and deployed to GitHub Pages by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

The static build is switched on with two environment variables:

```bash
STATIC_EXPORT=true NEXT_PUBLIC_BASE_PATH=/hotel-listings npm run build   # output in ./out
```

Without them, `npm run build` produces a normal Next.js server build.

## Roadmap

This repo is being modernized in small pull requests, each with its own before and after measurements:

1. ✅ Remove the dependency on third-party services and access tokens; add CI and a live demo.
2. Upgrade to the current Next.js and React versions.
3. Migrate styled-components to Tailwind CSS, one component per pull request.
4. Move data fetching to TanStack Query and server components.
5. Replace the Cypress tests with Playwright and run them in CI.
6. Add German and Dutch.

The Cypress end-to-end tests in [`cypress/`](cypress) are from the original version and are not part of CI yet (step 5).
