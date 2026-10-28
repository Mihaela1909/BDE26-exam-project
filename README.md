# do it with Mi

A todo app written in TypeScript, built for the BDE26 exam project.

**Live app:** https://mihaela1909.github.io/BDE26-exam-project/

## Features

- Add, edit, remove and tick off todos, with validation for empty input
- Due dates picked from a week strip or calendar, with overdue todos highlighted
- Filters (All / Active / Completed) with counts, and "clear completed" / "clear all"
- A progress bar showing how many todos are done
- Todos, theme and background are saved in `localStorage`
- Dark mode, and a background color picker with a reset swatch
- Animations (blooming flowers, sliding filter highlight) that respect `prefers-reduced-motion`

## Getting started

You need Node.js and npm.

```sh
npm install
npm run dev        # start the dev server at http://localhost:5173
npm run build      # type-check and build to dist/
npm run preview    # serve the built app
```

## Tests

```sh
npm test           # unit tests with Vitest (jsdom)
npm run test:e2e   # end-to-end tests with TestCafé in headless Chrome
```

- **Unit tests** sit next to the code they test, as `src/<module>.test.ts`.
- **End-to-end tests** are in `tests/e2e/`, with at least two tests per feature. TestCafé starts the dev server by itself (see `.testcaferc.cjs`).

## Project structure

```
index.html            page markup
public/               logo and flower images
src/
  main.ts             wires everything together: state, events, rendering
  dom.ts              typed lookups for the page elements
  types.ts            the Todo, Filter and Progress types
  TodoStore.ts        the class that holds and changes the todos
  validation.ts       input validation and the stored-data type guard
  filter.ts           filtering todos
  dates.ts            date helpers (keys, formatting, overdue)
  datePicker.ts       the week strip date picker
  render.ts           creates the todo list items
  progress.ts         the progress bar and "tasks left" text
  emptyState.ts       the message shown when the list is empty
  storage.ts          generic localStorage load/save
  theme.ts            light/dark theme
  background.ts       background color swatches and picker
  animations.ts       helpers for CSS animations
  filterIndicator.ts  the sliding highlight behind the filters
  decor.ts            the blooming background flowers
  icons.ts            inline SVG icons
  style.css           all styles, with colors as CSS variables
tests/e2e/            TestCafé tests
.github/workflows/    CI and deploy pipelines
```

## TypeScript concepts

| Concept | Where |
| --- | --- |
| Interface with `readonly` and optional properties | `Todo` in [src/types.ts](src/types.ts) |
| Union type | `Filter` in [src/types.ts](src/types.ts) |
| Tuple type | `Progress` in [src/types.ts](src/types.ts) |
| Enum | `Theme` in [src/theme.ts](src/theme.ts) |
| Class with private fields | `TodoStore` in [src/TodoStore.ts](src/TodoStore.ts) |
| Generics | `load<T>` / `save<T>` in [src/storage.ts](src/storage.ts) |
| Type guards | `isFilter`, `isTodoList`, `isTheme`, `isHexColor` |
| Utility types | `Pick<Todo, 'text' \| 'dueDate'>` in [src/TodoStore.ts](src/TodoStore.ts), `Record<Theme, string>` in [src/background.ts](src/background.ts) |
| `keyof typeof` | `createIcon` in [src/icons.ts](src/icons.ts) |
| DOM type casting | [src/dom.ts](src/dom.ts) |

## Workflow

The project follows **Gitflow**:

- `main` holds released code; `develop` collects finished features.
- Each GitHub issue gets its own `feature/<issue>-<name>` branch off `develop`.
- Every feature is merged into `develop` through a pull request, which a classmate reviews and approves.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `test:`, `chore:` …).
- Releases are prepared on a `release/<version>` branch, merged into `main`, tagged, and merged back into `develop`.

## CI/CD

- **CI** ([ci.yml](.github/workflows/ci.yml)) runs on every pull request into `develop` or `main` and on pushes to `develop`: install, build, unit tests and end-to-end tests. Branch protection requires it to pass, plus one approval, before merging.
- **Deploy** ([deploy.yml](.github/workflows/deploy.yml)) runs on every push to `main`: it tests, builds and publishes the app to GitHub Pages.
