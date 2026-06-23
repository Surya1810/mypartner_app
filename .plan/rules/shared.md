# rules/shared.md — Shared Rules (Frontend + Backend)

## Project Configuration

> Replace these fields when starting a new project.

| Field              | Default                  | Notes                                           |
| ------------------ | ------------------------ | ----------------------------------------------- |
| Project name       | (set per project)        | -                                               |
| Production domain  | (set per project)        | -                                               |
| Node.js version    | **24 LTS** (minimum 24+) | Pin via `.nvmrc` + `package.json engines`       |
| Database           | PostgreSQL 15+           | MySQL 8 also supported                          |
| ORM / Migration    | Prisma or Drizzle        | Confirmed in project brief                      |
| UI language        | Bahasa Indonesia         | Override per project if target audience differs |
| File storage       | Local / configurable     | Replace with GCS or S3 per project              |
| Default admin path | `/admin/dashboard`       | Override per project                            |

---

## Tech Stack — Base (always required)

| Layer              | Technology                                                     |
| ------------------ | -------------------------------------------------------------- |
| Runtime            | Node.js **24 LTS** (pinned, minimum 24+)                       |
| Framework          | Nuxt.js **4** + TypeScript (strict, no `any`)                  |
| Styling            | Tailwind CSS + tailwindcss-animate                             |
| Database           | PostgreSQL 15+ or MySQL 8                                      |
| ORM / Migration    | Prisma or Drizzle (confirmed per project)                      |
| Validation         | Zod (client + server)                                          |
| Auth               | JWT (access + refresh token, httpOnly cookies)                 |
| UI Components      | shadcn-vue (Tailwind-based, copy-owned components)             |
| Utilities          | @vueuse/core + @vueuse/motion                                  |
| Forms              | vee-validate + @vee-validate/zod                               |
| Code Quality       | ESLint (@antfu/eslint-config) + Prettier + Husky + lint-staged |
| Logging            | pino (JSON Lines format)                                       |
| Error Tracking     | @sentry/nuxt                                                   |
| Testing            | Vitest + @playwright/test                                      |
| Image Optimization | @nuxt/image                                                    |
| Dev Tools          | Nuxt DevTools (dev only)                                       |

## Tech Stack — Optional (include per project)

| Category       | Technology                                  | When to include               |
| -------------- | ------------------------------------------- | ----------------------------- |
| File Storage   | @google-cloud/storage or @aws-sdk/client-s3 | File upload needed            |
| WYSIWYG        | TinyMCE or CKEditor (confirmed per project) | Rich text editing             |
| Email          | Resend SDK or Nodemailer                    | Password reset, notifications |
| SEO            | useSeoMeta + sitemap route                  | Public-facing marketing sites |
| QR Code        | qrcode                                      | Member cards, tickets         |
| PDF Generation | Puppeteer (headless Chrome)                 | Reports, printable documents  |
| RBAC           | Prisma Role enum + server middleware        | Multiple distinct user roles  |

---

## Node.js Version

- Minimum **Node.js 24 LTS**; pin the exact version decided in project brief
- Enforce via `.nvmrc`, `.node-version`, and `engines` field in `package.json`
- Use exact version string, not a range: `"node": "24.x"` not `"node": ">=24"`
- Never upgrade without explicit instruction

---

## Package Version Policy

### Always install the latest stable release

- Run `npm install <package>@latest` - never install without `@latest` unless pinning to a
  specific known-good version for a documented compatibility reason
- Never install alpha, beta, RC, or pre-release versions (e.g. `1.0.0-beta.3`, `2.0.0-rc.1`)
  unless the stable version does not exist yet and the project explicitly requires it
- Before installing a new package, verify on npmjs.com:
  1. **Last publish date** - packages not updated in over 2 years are a red flag
  2. **Weekly downloads** - prefer packages with >100k weekly downloads (signals active community)
  3. **Version number** - a version below `1.0.0` means the API is considered unstable by the author

### Prefer actively maintained packages

- Prefer packages that are part of a framework's official ecosystem (e.g. `@nuxt/*`, `@vueuse/*`)
  over third-party alternatives that do the same thing
- If two packages do the same thing, prefer the one with more recent commits and more downloads
- Avoid packages whose GitHub repository shows "archived" or "no longer maintained"

### Security

- Run `npm audit` after installing any new package
- Do not install packages with known high or critical severity vulnerabilities
- If a vulnerability exists and no fix is available, document the reason for keeping the package
  and set a reminder to revisit

### Version ranges in package.json

- `^` (caret) is acceptable for most packages - it allows minor and patch updates within the same major
- Never use `*` or an empty range - these allow any version including breaking majors
- For packages where stability is critical (ORM, auth, validation), consider pinning the exact version
  and updating manually after reading the changelog

---

## Language Rule — Technical Artifacts Must Use English

All technical identifiers are **English only**, without exception:

- File names and folder names: `kebab-case` English
- Variable and function names: `camelCase` English
- Class and interface names: `PascalCase` English
- Enum names and values: `PascalCase` English
- Database column names (`@map`): `snake_case` English
- API route paths: `kebab-case` English
- API response field names: `camelCase` English
- Git branch names: `kebab-case` English
- Env variable names: `UPPER_SNAKE_CASE` English

End-user-facing text (UI labels, toast messages, error messages shown to users) follows the project's configured UI language.

---

## TypeScript Standards

- Strict mode enabled; zero `any` in any file
- Shared types between server and client: `~/types/`
- Derive types from Zod schemas via `z.infer<typeof schema>` - no duplicate interfaces
- Type-safe ORM client (Prisma or Drizzle generated types - never cast to `any`)

---

## Coding Conduct

- No comments unless the WHY is non-obvious
- No backwards-compatibility shims; delete unused code
- No feature flags; no premature abstractions
- Do not use em-dashes (--) in any file: code, comments, documentation, or plan files. Use a regular hyphen (-) or rewrite the sentence

---

## Production-Grade Standards

Every line of code written must be production-ready. There is no "we'll clean it up later."
These rules apply from the first phase, not only before deployment.

### No debug artifacts in committed code

The following must never appear in any committed file:

- `console.log`, `console.warn`, `console.error` in server-side code — use the pino logger singleton
- `console.log` in client-side Vue components — use structured logging or remove entirely
- `debugger` statements
- Commented-out code blocks
- `TODO`, `FIXME`, `HACK`, `XXX` comments — if it needs doing, create a plan file; if it will never be done, delete it

### Environment variable validation on startup

All required environment variables must be validated when the server starts, not when the
feature that uses them is first called. A missing `JWT_SECRET` must crash the process immediately
on boot — not return a cryptic error to the user at login time.

Create `server/utils/env.ts` to validate and export all env vars as typed constants:

```ts
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  jwtSecret: requireEnv("JWT_SECRET"),
  databaseUrl: requireEnv("DATABASE_URL"),
  nodeEnv: process.env.NODE_ENV ?? "development",
};
```

Import `env` from this file everywhere — never read `process.env` directly in business logic.

### Pagination is mandatory on all list endpoints

Never call `findMany()`, `findAll()`, or any equivalent without a row limit.
Every endpoint that returns a list must accept `page` and `limit` query params
and return `{ success: true, data: [...], meta: { total, page, limit, totalPages } }`.
Default limit: 10. Maximum limit: 100. Requests above the maximum are clamped, not rejected.
Use `okList(data, meta)` from `server/utils/response.ts`.

### Correct HTTP status codes

Return the semantically correct status code — not always 200:

| Action                        | Status                    |
| ----------------------------- | ------------------------- |
| Resource created              | 201 Created               |
| Success with no response body | 204 No Content            |
| Validation error              | 400 Bad Request           |
| Unauthenticated               | 401 Unauthorized          |
| Authenticated but forbidden   | 403 Forbidden             |
| Resource not found            | 404 Not Found             |
| Rate limited                  | 429 Too Many Requests     |
| Unexpected server error       | 500 Internal Server Error |

### Logging: never use console, always use pino

All server-side logging goes through the pino singleton at `server/utils/logger.ts`.
`console.log` is not structured, does not rotate, and is invisible in production log pipelines.

```ts
// Wrong
console.log("user logged in", userId);

// Correct
logger.info({ event: "auth.login.success", userId, ip }, "User logged in");
```

### Graceful shutdown

The server must handle `SIGTERM` and `SIGINT` signals by closing database connections
and finishing in-flight requests before exiting. Add a shutdown handler in the Nuxt server
plugin or `server/plugins/shutdown.ts`:

```ts
async function shutdown() {
  await db.$disconnect();
  process.exit(0);
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
```

### Error pages

Every project must have custom error pages — never expose the default Nuxt or framework error page:

- `app/error.vue` — catches all unhandled errors; show a user-friendly message
- Handle 404 and 500 separately within `error.vue` using `error.statusCode`

## Code Quality — KISS, DRY, and File Size

### KISS (Keep It Simple)

- Write the simplest code that solves the problem - do not add indirection, abstraction, or generalization unless a second real use case exists
- If a function or component is hard to name, it is doing too many things - split it
- Prefer flat code over deeply nested conditionals; use early returns to reduce nesting
- Do not solve problems that have not been asked for

### DRY (Don't Repeat Yourself)

- Extract shared logic only when the same code appears in three or more places, not two
- Shared server logic goes in `server/services/` or `server/utils/`; shared frontend logic goes in `app/composables/`
- Reuse Zod schemas from `server/validators/` on the frontend - never duplicate validation logic
- Reuse shadcn-vue components from `app/components/ui/` - never rebuild what already exists

### File Size Limits

- Target: 600 lines per file maximum
- Hard limit: 800 lines - a file that exceeds this must be split before the phase is marked complete
- If a file approaches the limit, split by responsibility: one service per domain, one composable per concern, one component per logical unit
- Route handlers in `server/api/` must stay thin (under 50 lines) - move logic to services
- The line count limit applies to all files: `.ts`, `.vue`, `.prisma`, `.css`

---

## Code Quality Tooling

### ESLint + Prettier

- Use `@antfu/eslint-config` (flat config, includes Vue 3, TypeScript, and import-order rules)
- Config file: `eslint.config.mjs`
- Prettier handles formatting; ESLint handles code quality - do not overlap
- Zero ESLint errors allowed in committed code; warnings are intentional or none

### Husky + lint-staged

- `pre-commit` hook: runs `lint-staged` (ESLint fix + Prettier format on staged files)
- `commit-msg` hook: validates commit message against Conventional Commits format
- Never skip hooks with `--no-verify` unless emergency; document reason in next commit

### Commit Message Convention

All commits must follow **Conventional Commits** format:

```
<type>(<scope>): <short description>
```

| Type       | When to use                              |
| ---------- | ---------------------------------------- |
| `feat`     | New feature or functionality             |
| `fix`      | Bug fix                                  |
| `chore`    | Tooling, config, dependency changes      |
| `refactor` | Code restructure without behavior change |
| `test`     | Adding or updating tests                 |
| `docs`     | Documentation only                       |
| `style`    | Formatting, no logic change              |
| `perf`     | Performance improvement                  |

Scope examples: `auth`, `articles`, `members`, `admin`.

### No Co-Authored-By Trailer

Never add a `Co-Authored-By` trailer to any commit message. Commit messages end after the description and optional body.

---

## Files That Must Always Be Current

- `.env.example` - updated whenever a new env var is added
- `CHANGELOG.md` - updated with every phase (Keep a Changelog format)
- ORM migration files - never hand-edit; always use the ORM's migrate command
- Seed script - must support the ORM's seed command with a default admin user
- `server/api/README.md` - updated whenever a route is added or changed

---

## Git — Planning and Tooling Artifacts: Branch Rules

The following files and folders are development-only artifacts (AI agents, editor config, local tooling):

```
.plan/
.github/
.kiro/
.qoder/
.vscode/
.cursorrules
.mcp.json
.opencode.json
.windsurfrules
AGENTS.md
CLAUDE.md
GEMINI.md
QODER.md
```

| Branch                          | Rule                                                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `development`, feature branches | **Commit and push** — track all of these so context and tooling config persists across sessions and team members |
| `main` / `master`               | **Must not exist** — remove before or during the merge                                                           |

**Do NOT add these to the project-wide `.gitignore`** — that would prevent tracking on development branches.

**On `main`/`master` only**, add these entries to `.gitignore` after the initial merge cleanup:

```
# Development-only artifacts — AI agents, editor config, local tooling
.plan/
.github/
.kiro/
.qoder/
.vscode/
.cursorrules
.mcp.json
.opencode.json
.windsurfrules
AGENTS.md
CLAUDE.md
GEMINI.md
QODER.md
```

**Before merging or opening a PR to `main`/`master`:**

1. Check: `git diff main...HEAD -- .plan .github .kiro .qoder .vscode .cursorrules .mcp.json .opencode.json .windsurfrules AGENTS.md CLAUDE.md GEMINI.md QODER.md`
2. If any appear in the diff, untrack them: `git rm --cached -r .plan .github .kiro .qoder .vscode .cursorrules .mcp.json .opencode.json .windsurfrules AGENTS.md CLAUDE.md GEMINI.md QODER.md`
3. Commit the removal, then merge

---

## Migration Conventions

### If using Prisma

- `prisma migrate dev --name <descriptive-name>` for new migrations
- `prisma migrate reset` for full reset (drops + recreates + seeds)
- Never hand-edit files inside `prisma/migrations/`
- Expose npm scripts: `db:migrate`, `db:reset`, `db:seed`, `db:studio`

### If using Drizzle

- `drizzle-kit generate` to generate migration SQL from schema changes
- `drizzle-kit migrate` to apply pending migrations
- Store schema in `server/db/schema/`; migration files in `server/db/migrations/`
- Seed via a dedicated `server/db/seed.ts` script; expose as `db:seed` npm script
- Expose npm scripts: `db:generate`, `db:migrate`, `db:seed`, `db:studio`

### Both ORMs

- Seed creates: 1 Admin user + representative sample data
- Seed script must be idempotent (safe to run multiple times without duplicating data)
- Use **@faker-js/faker** to generate realistic bulk data in seed scripts
- Faker locale should match the project's UI language (e.g. `faker.locale = 'id'` for Indonesian)
