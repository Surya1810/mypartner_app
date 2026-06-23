# rules/backend.md — Backend Rules

> Covers: server architecture, API documentation, security, rate limiting, CORS, logging.
> Auth-related backend rules are in `rules/auth.md`.

---

## Nuxt 4 Directory Convention (Backend)

```
server/
  api/            - thin route handlers; no business logic
  services/       - business logic
  repositories/   - all Prisma/DB queries
  middleware/     - runs before route handlers (auth.ts, csrf.ts, rate-limit.ts)
  utils/          - shared helpers, token utils, logger singleton
  validators/     - Zod schemas; reused on both client and server
  templates/
    email/        - HTML email templates
public/           - static files served at root URL
```

---

## Layered Architecture

All server-side code follows this strict layering. Do not skip layers.

```
Route handler (server/api/)
  - reads request, validates input with Zod, calls service
  - returns response; never contains business logic or DB queries

Service (server/services/)
  - contains business logic
  - calls repositories; never calls DB directly

Repository (server/repositories/)
  - all Prisma/Drizzle queries; nothing else
  - returns typed results; never throws HTTP errors

Middleware (server/middleware/)
  - runs before route handlers
  - auth.ts: verifies access token, attaches user to event.context
  - csrf.ts: validates CSRF header on mutating requests
  - rate-limit.ts: enforces per-IP rate limits on sensitive endpoints

Utils (server/utils/)
  - shared helpers: token generation, logger singleton, file helpers
```

---

## API Response Format

All API responses — success and error — must follow a single envelope shape.
Never return a raw object or array directly from a route handler.

### Success — single resource

```json
{
  "success": true,
  "data": { "id": "...", "email": "..." }
}
```

### Success — list / paginated

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Human-readable error message in the project UI language.",
  "errors": [{ "field": "email", "message": "Invalid email format." }]
}
```

`errors` is optional — only present on validation errors (HTTP 400).
`message` must always be present on errors.

### Implementation

Use the helpers from `server/utils/response.ts` (see `skills/backend.md`):

- `ok(data)` — wraps a single resource
- `okList(data, meta)` — wraps a paginated list
- Errors are thrown with `createError()` and normalized by `server/plugins/error-handler.ts`

---

## API Documentation Policy

Every route handler in `server/api/` must include a JSDoc block:

```ts
/**
 * POST /api/auth/login
 * Authenticates a user and issues access + refresh tokens as httpOnly cookies.
 *
 * Auth: public
 * Body: { email: string, password: string, rememberMe?: boolean }
 * Response 200: { success: true, data: { id, email, name, role } }
 * Response 400: { success: false, message: string, errors: [{ field, message }] }
 * Response 401: { success: false, message: 'Invalid credentials' }
 * Response 429: { success: false, message: 'Too many requests' }
 */
export default defineEventHandler(async (event) => { ... })
```

Required fields in every doc block:

- HTTP method + path
- One-line description
- Auth requirement: `public` / `requires auth` / `requires role: ADMIN`
- Body or query params schema (reference the Zod validator file)
- Response shapes for each status code returned

`server/api/README.md` must be updated whenever a route is added, changed, or removed.
One line per route: `METHOD /path — auth requirement — description`

---

## Security Baseline

### Rate Limiting - Required on Auth Endpoints

Rate limiting is not optional. It must be implemented in Phase 01 or Phase 03 (auth phase) at the latest.

Limits at minimum:
| Endpoint | Max requests | Window |
|---|---|---|
| `POST /api/auth/login` | 5 | 15 minutes per IP |
| `POST /api/auth/register` | 3 | 60 minutes per IP |
| `POST /api/auth/refresh` | 10 | 15 minutes per IP |
| `POST /api/auth/forgot-password` | 3 | 60 minutes per IP |

Implementation: in-process `Map` keyed by `IP:path`. Reset on window expiry. Redis is optional for multi-instance deployments.

Return `429 Too Many Requests` with a human-readable message in the project's UI language.

### Security Headers - Required

Set via `server/middleware/security-headers.ts` or `nuxt.config.ts` `routeRules`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (or `SAMEORIGIN` if embedding needed)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy`: configure per project based on CDNs and assets in use
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` (HTTPS only)

### Input Validation

- Validate all request bodies with Zod in `server/validators/` before any business logic
- Return structured field-level validation errors (not a generic "bad request"):
  ```ts
  { success: false, message: 'Validation failed', errors: [{ field: 'email', message: 'Invalid email' }] }
  ```
- Never use raw SQL string interpolation - Prisma/Drizzle parameterized queries only

### XSS Prevention

- Sanitize user-generated HTML before storing: `sanitize-html` or equivalent
- Never render stored HTML without sanitization on frontend (`v-html` with sanitized content only)

### Password Hashing

- `bcryptjs` with salt rounds >= 12
- Never store plain text passwords or reversible encoding

### File Upload Security

- Validate MIME type via magic bytes (first bytes of buffer), not just file extension
- Enforce file size limit
- Validate file extension against a whitelist
- Rename file on storage - never use the original filename

### Secrets

- Never commit secrets; always via `.env` (gitignored)
- `.env.example` must document every env var with a placeholder value

---

## CORS Policy

```ts
allowedOrigins: [process.env.SITE_URL];
credentials: true;
allowedMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
allowedHeaders: ["Content-Type", "X-CSRF-Token"];
```

- Preflight `OPTIONS` requests must return 204
- Development: also allow `http://localhost:3000`
- **Never** use wildcard `*` with `credentials: true`

---

## JWT & Cookie Policy

- Access token: JWT signed with `JWT_SECRET`, 15m expiry
- Refresh token: opaque random string or JWT, stored in DB (enables server-side revocation)
- Token verification failure: return `401` - let the frontend middleware handle the redirect
- Refresh rotation: on use, invalidate old refresh token and issue a new one
- See `rules/auth.md` for full cookie configuration table

---

## Logging Policy

- JSON Lines format (one JSON object per line)
- File: `logs/app-YYYY-MM-DD.log` (daily rotation by filename)
- Use `pino` as the logging library - singleton in `server/utils/logger.ts`

Required fields:

```json
{
  "timestamp": "ISO-8601",
  "level": "info | warn | error",
  "event": "snake_case.event.name",
  "ip": "...",
  "method": "GET | POST | ...",
  "path": "/api/...",
  "userId": null,
  "details": {}
}
```

Log all auth events: login, logout, failed login attempts, token refresh, token rotation.
Log all errors with full stack trace in `details.stack`.
`logs/` directory is gitignored.

---

## File Serving (Private Files)

For files that require authentication before access:

```ts
// server/api/files/[key].get.ts
/**
 * GET /api/files/:key
 * Streams a private file. Requires authentication.
 *
 * Auth: requires auth
 * Param: key - the file key/path stored in DB
 * Response 200: file stream with correct Content-Type
 * Response 401: unauthorized
 * Response 404: file not found
 */
export default defineEventHandler(async (event) => {
  // user attached by server/middleware/auth.ts
  const user = event.context.user;
  if (!user) throw createError({ statusCode: 401 });

  const key = getRouterParam(event, "key");
  // validate key belongs to user or user has permission
  // set Content-Type based on file extension
  // stream file from filesystem or cloud storage
  setHeader(event, "Content-Type", getMimeType(key));
  setHeader(event, "Cache-Control", "private, max-age=3600");
  // stream and return
});
```

Always:

- Set the correct `Content-Type` header based on file MIME type, not just extension
- Set `Cache-Control: private` to prevent CDN caching of authenticated files
- Validate that the requesting user has permission to access the file

---

## PDF Generation on Linux VPS

When using Puppeteer for server-side PDF generation on Linux (VPS/container):

```ts
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome-stable",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  headless: "new",
});
```

- Install `google-chrome-stable` on the server (not Chromium)
- Set `CHROME_PATH` env var for portability
- `--no-sandbox` is required in most VPS/container environments
- `--disable-dev-shm-usage` prevents crashes in low shared-memory environments
