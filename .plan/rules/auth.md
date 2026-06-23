# rules/auth.md — Auth Contract (Frontend + Backend)

> This file is the single source of truth for all authentication rules.
> Both the frontend and backend must implement their respective sides of this contract.
> Read this file completely before writing any auth-related code.

---

## Auth Architecture Overview

```
Browser                    Nuxt Server (SSR)          API Handlers
  |                              |                          |
  |-- request (with cookies) --> |                          |
  |                         plugin/auth.server.ts           |
  |                         reads cookie, calls /api/auth/me|
  |                         populates useState('auth-user') |
  |                              |                          |
  |                         app/middleware/auth.ts          |
  |                         checks useState first           |
  |                         if empty: calls /api/auth/me    |
  |                         if 401: tries refresh           |
  |                         if refresh fails: redirect login |
  |                              |                          |
  |                         page renders with correct state |
  |<-- response (no flicker) ----|                          |
```

---

## Rule 1: Auth check NEVER in app.vue

`app.vue` renders on every route including public pages. Auth checks there cause
"Unauthorized" errors on public page first load and unnecessary API calls.

- **Wrong:** `onMounted(() => checkAuth())` in `app.vue`
- **Correct:** Named middleware (`app/middleware/auth.ts`) applied only to protected pages via `definePageMeta`

---

## Rule 2: Auth middleware is named, never global

```ts
// app/middleware/auth.ts — named middleware only
export default defineNuxtRouteMiddleware(async () => { ... })

// In admin layout or page:
definePageMeta({ middleware: 'auth' })
```

`auth.global.ts` must not exist for auth checks. Global middleware runs on every route including public ones.

---

## Rule 3: Prevent SSR hydration flicker — server plugin is mandatory

The flash-of-login (or flash-of-admin) on page refresh happens because the server
renders without knowing the auth state. Fix: a server plugin reads the cookie and
populates `useState` BEFORE the page renders.

**Required files:**

- `plugins/auth.server.ts` - runs on server, reads cookie, populates `useState('auth-user')`
- `plugins/auth.client.ts` - runs on client, initializes `useAuth` composable from that state
- `app/composables/useAuth.ts` - checks `useState` before making any API call

The auth middleware must check `useState` first. If the state is already populated (from the
server plugin), skip the API call entirely.

---

## Rule 4: Silent token refresh before any redirect

Auth flow on protected page load:

1. Check `useState('auth-user')` - if populated from server plugin, proceed immediately
2. Otherwise call `GET /api/auth/me`
3. If 401: attempt silent refresh via `POST /api/auth/refresh`
4. If refresh succeeds: retry `GET /api/auth/me`, populate state, proceed
5. If refresh fails: clear all cookies server-side + `navigateTo('/login', { replace: true })`
6. **Never show "Unauthorized" to the user** - always redirect silently

---

## Rule 5: Login redirect flow

After successful login:

1. Check for `redirect` query param in the current URL
2. If present and safe (starts with `/`, not external URL): navigate there
3. Otherwise navigate to the default admin path defined in `rules/shared.md` Project Configuration
4. Always use `navigateTo(path, { replace: true })` - prevents back-button returning to login page
5. The login page itself must have a guest guard: redirect to admin path if already authenticated

---

## Rule 6: Logout sequence - order is mandatory

Logout must happen in this exact order:

1. Call `POST /api/auth/logout` - server clears both cookies with `maxAge: 0`
2. Immediately call `clearAuthState()` on `useAuth` to clear reactive state
3. Then call `navigateTo('/login', { replace: true })`

Never navigate before clearing state. The auth middleware on any re-triggered route
will read stale state and bounce the user back to admin.

Server handler:

```ts
// server/api/auth/logout.post.ts
setCookie(event, "access_token", "", { maxAge: 0, path: "/" });
setCookie(event, "refresh_token", "", { maxAge: 0, path: "/api/auth" });
setCookie(event, "csrf_token", "", { maxAge: 0, path: "/" });
setCookie(event, "remember_me", "", { maxAge: 0, path: "/" });
return { success: true };
```

---

## Rule 7: Remember Me extends refresh token only

| Token         | Default    | With Remember Me       |
| ------------- | ---------- | ---------------------- |
| Access token  | 15 minutes | 15 minutes (unchanged) |
| Refresh token | 1 day      | 30 days                |

- "Remember Me" is a boolean from the login request body
- Store the preference in a separate non-httpOnly cookie `remember_me` (`1` or `0`)
- On token refresh, read `remember_me` cookie to re-issue refresh token with correct maxAge
- If `remember_me` cookie is absent, treat as false (default 1 day)

---

## Rule 8: Token storage — httpOnly cookies only

| Cookie          | httpOnly  | secure      | sameSite | maxAge                      | path        |
| --------------- | --------- | ----------- | -------- | --------------------------- | ----------- |
| `access_token`  | true      | true (prod) | strict   | 900 (15m)                   | `/`         |
| `refresh_token` | true      | true (prod) | strict   | 86400 (1d) or 2592000 (30d) | `/api/auth` |
| `csrf_token`    | **false** | true (prod) | strict   | same as refresh_token       | `/`         |
| `remember_me`   | **false** | true (prod) | strict   | 2592000                     | `/`         |
| `session_hint`  | true      | true (prod) | **lax**  | same as refresh_token       | `/`         |

- Never store tokens in `localStorage`, `sessionStorage`, or JS-accessible variables
- Never return tokens in API response body
- Server middleware reads only from cookies - never from `Authorization` header

**Why `session_hint` uses `SameSite=Lax`:**
`access_token` is `SameSite=Strict`, which means it is not sent on cross-site navigations.
In development, Nuxt DevTools (and some browser extensions) can change the navigation context
so that even F5 reload is treated as cross-site — causing `access_token` to be absent from the
request and making the SSR plugin think the user has no session.
`session_hint` is a plain `httpOnly` flag cookie (`'1'`) with no sensitive data. Using `Lax`
ensures it is always sent on page load, giving the server a reliable signal that a session may
exist and the client should attempt a silent refresh before redirecting to login.

---

## Rule 9: CSRF protection from day one — frontend AND backend

Use the **double-submit cookie pattern**.

**Backend side:**

- On login: generate a random CSRF token; set as non-httpOnly cookie `csrf_token`
- `server/middleware/csrf.ts` compares `X-CSRF-Token` header against `csrf_token` cookie value
- Mismatch or missing header: throw 403 Forbidden
- Exempt paths: `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`

**Frontend side — MANDATORY:**

- `plugins/csrf.client.ts` must exist and override the global `$fetch` to automatically inject
  the `X-CSRF-Token` header on every mutating request (POST, PUT, PATCH, DELETE)
- This plugin reads `csrf_token` via `useCookie('csrf_token')` (non-httpOnly, JS-readable)
- Without this plugin, every form submission and data mutation will fail with 403 Forbidden
- The plugin is a one-time global setup - individual `$fetch` calls do NOT need to add the header manually

**Why the plugin approach:**
Individual developers (and AI agents) forget to add the header to each `$fetch` call.
A single plugin that overrides the global `$fetch` ensures every call is covered automatically,
with zero risk of forgetting it in a new endpoint or feature.

**CSRF token rotation after reactive refresh — mandatory:**
Every `POST /api/auth/refresh` issues a new `csrf_token` cookie (token rotation).
If a request gets 401 and the CSRF plugin triggers a silent refresh, the retry request
must re-read the CSRF token from the cookie AFTER the refresh completes — not use the
token that was injected before the original request. Reusing the old token causes the
retry to fail with 403 because the cookie already holds the new token.

---

## Rule 10: Refresh token rotation

On every successful refresh:

1. Invalidate the old refresh token in the database
2. Issue a new refresh token and store it in DB
3. Issue a new access token
4. Issue a new `csrf_token` (rotate alongside the refresh token)
5. Set all new cookies with correct maxAge (re-read `remember_me` cookie)

This prevents refresh token reuse attacks. If an old refresh token is used, it means
the original was stolen - invalidate all sessions for that user.

The `csrf_token` MUST be rotated on every refresh — not just on login. Failure to do so
means the old CSRF token remains valid even after rotation, weakening the protection.

---

## Rule 11: Auth state composable is the single source of truth

`app/composables/useAuth.ts` exposes:

- `user` (reactive ref, type: `AuthUser | null`)
- `isAuthenticated` (computed)
- `isLoading` (reactive ref)
- `login(credentials, rememberMe)` - calls API, sets state, handles redirect
- `logout()` - calls API, clears state, navigates to login
- `refreshToken()` - calls refresh API, returns boolean success
- `clearAuthState()` - clears reactive state without API call (used internally)
- `initFromState()` - reads `useState('auth-user')` and populates composable (called by client plugin)

No other file manages auth state. All components read from `useAuth()`.

---

## Rule 12: Guest guard on login page

The login page must redirect authenticated users away:

```ts
// In login page or a guest middleware
definePageMeta({ middleware: "guest" });
```

`app/middleware/guest.ts`:

```ts
export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated.value) {
    return navigateTo("/admin/dashboard", { replace: true });
  }
});
```

Without this, an authenticated user who manually navigates to `/login` will stay there,
and refreshing `/login` may briefly show admin before the redirect.

---

## Rule 13: Use `import.meta.server` — never `process.server`

In Nuxt 4 + Vite, `process.server` is a runtime check and can return `false` during SSR
in certain conditions (server idle after recompilation, Vite dev mode edge cases). When
middleware falls into the wrong execution path, `$fetch` calls made inside server-side
context can cause a deadlock — SSR waits for the API, the API waits for SSR to finish.
This presents as a 28-30 second timeout followed by a redirect to login.

`import.meta.server` is resolved at build time by Vite and is always reliable:

```ts
// Correct — resolved at build time
if (import.meta.server) { ... }
if (import.meta.client) { ... }

// Wrong — runtime check, unreliable in Nuxt 4 + Vite
if (process.server) { ... }
if (process.client) { ... }
```

This rule applies to every middleware file: `auth.ts`, `guest.ts`, and all role-based middleware.

---

## Rule 14: SSR middleware must never make HTTP calls

Server-side route middleware must only read cookies passively. It must not make `$fetch`
or HTTP calls to internal API endpoints during SSR. Making an internal request from
SSR middleware can cause a deadlock if the endpoint depends on the same server process.

Correct SSR middleware pattern:

- Read `session_hint` cookie (passive, no network call)
- If hint present: defer to client (return without navigateTo)
- If hint absent: redirect to login immediately

The actual token verification (`/api/auth/me`) and silent refresh happen on the client
side only, after hydration. The server plugin (`plugins/auth.server.ts`) is the only
place allowed to call internal APIs during SSR, because it runs before routing begins.
