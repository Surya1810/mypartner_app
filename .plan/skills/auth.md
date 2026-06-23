# skills/auth.md — Auth Implementation Patterns

> Read `rules/auth.md` first. This file provides the concrete implementation.
> Every pattern here corresponds to a rule in `rules/auth.md`.

---

## File Checklist — Auth Phase Must Create All of These

```
plugins/auth.server.ts          ← prevents hydration flicker; uses session_hint cookie (Rule 3)
plugins/auth.client.ts          ← initializes composable on client
plugins/csrf.client.ts          ← injects X-CSRF-Token; handles reactive 401 + refresh (Rule 9)
app/composables/useAuth.ts      ← single source of truth for auth state (Rule 11)
app/middleware/auth.ts          ← named middleware; SSR path reads session_hint passively (Rule 2, 14)
app/middleware/guest.ts         ← redirects authenticated users away from login (Rule 12)
server/middleware/auth.ts       ← verifies access token, attaches user to context
server/middleware/csrf.ts       ← CSRF validation on mutating requests (Rule 9)
server/middleware/rate-limit.ts ← rate limiting on auth endpoints (backend rules)
server/utils/token.ts           ← JWT sign/verify helpers
server/utils/logger.ts          ← pino singleton
server/validators/auth.ts       ← Zod schemas for login, register, etc.
server/repositories/auth.ts     ← DB queries for user + refresh token
server/services/auth.ts         ← business logic for login, logout, refresh
server/api/auth/login.post.ts   ← sets session_hint (SameSite=Lax) on login
server/api/auth/logout.post.ts  ← clears session_hint on logout
server/api/auth/refresh.post.ts ← rotates csrf_token and re-sets session_hint
server/api/auth/me.get.ts
```

---

## plugins/auth.server.ts

Runs on server during SSR. Reads the `session_hint` cookie to determine whether a session
may exist, then calls `/api/auth/me` to pre-populate auth state before the page renders.

Using `session_hint` (SameSite=Lax) instead of checking for `access_token` (SameSite=Strict)
is critical: in development with Nuxt DevTools active, `access_token` may not be sent on F5
reload because DevTools changes the navigation context. `session_hint` is always sent.

```ts
export default defineNuxtPlugin(async () => {
  const event = useRequestEvent();
  if (!event) return;

  const cookie = getHeader(event, "cookie") ?? "";
  // session_hint is SameSite=Lax — reliably sent even with DevTools or extensions active.
  // access_token is SameSite=Strict — may be absent on cross-site navigations in dev.
  if (!cookie.includes("session_hint")) return;

  try {
    const user = await $fetch("/api/auth/me", {
      headers: { cookie },
    });
    useState<AuthUser | null>("auth-user", () => null).value = user as AuthUser;
  } catch {
    // Token missing or expired — client-side auth middleware handles silent refresh
  }
});
```

---

## plugins/auth.client.ts

Runs on client after hydration. Reads the `useState` populated by the server plugin
and initializes the `useAuth` composable so it matches server-rendered state.

```ts
export default defineNuxtPlugin(() => {
  const { initFromState } = useAuth();
  initFromState();
});
```

---

## plugins/csrf.client.ts

Overrides the global `$fetch` to automatically inject `X-CSRF-Token` on every mutating
request, and handles reactive 401 (token expired mid-session) with a silent refresh.

Without this plugin, every form submission (POST/PUT/PATCH/DELETE) returns 403 Forbidden
because `server/middleware/csrf.ts` rejects requests without the header.

```ts
export default defineNuxtPlugin(() => {
  const MUTATING_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

  // Always re-read from cookie — never cache in a variable.
  // After a silent refresh, the server issues a new csrf_token. Reading from the
  // reactive ref gives the rotated value automatically.
  function getCsrfToken(): string | null {
    return useCookie("csrf_token").value ?? null;
  }

  // Capture original $fetch before overriding so retry calls bypass the interceptor
  // and avoid triggering infinite refresh loops.
  const originalFetch = globalThis.$fetch;

  globalThis.$fetch = $fetch.create({
    onRequest({ options }) {
      const method = (options.method ?? "GET").toUpperCase();
      if (MUTATING_METHODS.includes(method)) {
        const token = getCsrfToken();
        if (token) {
          options.headers = {
            ...(options.headers as Record<string, string>),
            "X-CSRF-Token": token,
          };
        }
      }
    },

    async onResponseError({ request, options, response }) {
      // Only handle 401 once — _retry flag prevents infinite loop
      if (
        response.status !== 401 ||
        (options as Record<string, unknown>)._retry
      )
        return;

      try {
        // Silent refresh via originalFetch — bypasses interceptor, no CSRF header needed
        // (/api/auth/refresh is CSRF-exempt)
        await originalFetch("/api/auth/refresh", { method: "POST" });

        // Refresh has rotated the csrf_token cookie. Re-read the NEW token before retry.
        // Reusing the old token causes 403 because cookie now holds the new value.
        const newCsrf = getCsrfToken();
        const retryOptions = { ...options, _retry: true } as Record<
          string,
          unknown
        >;
        if (newCsrf) {
          retryOptions.headers = {
            ...(options.headers as Record<string, string>),
            "X-CSRF-Token": newCsrf,
          };
        }
        return originalFetch(
          request,
          retryOptions as Parameters<typeof originalFetch>[1],
        );
      } catch {
        // Refresh failed — auth middleware detects the next 401 and redirects to login
      }
    },
  });
});
```

**Key points:**

- `getCsrfToken()` always re-reads from the reactive cookie ref — never caches the value in a closure
- `originalFetch` is captured before the override so retry calls bypass the interceptor
- `_retry` flag prevents a failed retry from triggering another refresh loop
- After silent refresh, CSRF token has rotated — re-read and inject before retry
- `/api/auth/refresh` is CSRF-exempt, so calling it via `originalFetch` without a token is correct

**Plugin order matters:** `csrf.client.ts` must load after `auth.client.ts`.
Nuxt loads plugins alphabetically by default. Name them to enforce order if needed:

- `01.auth.client.ts`
- `02.csrf.client.ts`

---

## app/composables/useAuth.ts

```ts
import type { AuthUser } from "~/types/auth";

const authState = () => useState<AuthUser | null>("auth-user", () => null);

export function useAuth() {
  const user = authState();
  const isAuthenticated = computed(() => user.value !== null);
  const isLoading = ref(false);

  function initFromState() {
    // Called by auth.client.ts — state already populated by server plugin
    // No API call needed; reactive state is shared via useState
  }

  function clearAuthState() {
    user.value = null;
  }

  async function login(credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) {
    isLoading.value = true;
    try {
      const result = await $fetch<{ user: AuthUser }>("/api/auth/login", {
        method: "POST",
        body: credentials,
      });
      user.value = result.user;

      const route = useRoute();
      const redirect = route.query.redirect as string | undefined;
      const target =
        redirect && redirect.startsWith("/") ? redirect : "/admin/dashboard";
      await navigateTo(target, { replace: true });
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    try {
      await $fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Proceed even if the server call fails
    } finally {
      clearAuthState();
      isLoading.value = false;
      await navigateTo("/login", { replace: true });
    }
  }

  async function refreshToken(): Promise<boolean> {
    try {
      const result = await $fetch<{ user: AuthUser }>("/api/auth/refresh", {
        method: "POST",
      });
      user.value = result.user;
      return true;
    } catch {
      clearAuthState();
      return false;
    }
  }

  return {
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    initFromState,
    clearAuthState,
    login,
    logout,
    refreshToken,
  };
}
```

---

## app/middleware/auth.ts

Named middleware — applied only to protected pages and layouts via `definePageMeta`.

SSR path: only reads cookies passively — never makes HTTP calls (see Rule 14).
If `session_hint` cookie exists, defer to client to do the actual verification.
If no hint, redirect immediately — no session can exist.

Client path: verify with `/api/auth/me`, attempt silent refresh if 401.

```ts
export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, refreshToken } = useAuth();

  // Server plugin already populated state — proceed immediately, no API call needed
  if (isAuthenticated.value) return;

  if (import.meta.server) {
    // On SSR, never make HTTP calls — passively check session_hint cookie only.
    // session_hint is SameSite=Lax and is always present if a session may exist.
    const sessionHint = useCookie("session_hint");
    if (!sessionHint.value) {
      return navigateTo("/login", { replace: true });
    }
    // Hint present — defer full verification to client after hydration
    return;
  }

  // Client-side: verify token with server
  const { error } = await useFetch("/api/auth/me", { key: "auth-check" });

  if (!error.value) return;

  if (error.value.statusCode === 401) {
    const refreshed = await refreshToken();
    if (refreshed) return;
    return navigateTo("/login", { replace: true });
  }
});
```

---

## app/middleware/guest.ts

Redirects authenticated users away from the login page.

```ts
export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated.value) {
    return navigateTo("/admin/dashboard", { replace: true });
  }
});
```

Apply in the login page:

```ts
definePageMeta({ middleware: "guest" });
```

---

## Admin layout — applying auth middleware

```ts
// app/layouts/admin.vue
<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>
```

All pages using the admin layout inherit the middleware. Do not apply it per-page.

---

## server/middleware/auth.ts

Verifies the access token and attaches the user to `event.context`.
Returns 401 on failure — does not redirect (that is the frontend's job).

```ts
import { verifyJwt } from "~/server/utils/token";

const PUBLIC_PATHS = [
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/logout",
  "/api/auth/register",
  "/api/auth/forgot-password",
];

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname;
  if (PUBLIC_PATHS.some((p) => path.startsWith(p))) return;

  const token = getCookie(event, "access_token");
  if (!token) throw createError({ statusCode: 401, message: "Unauthorized" });

  try {
    const payload = verifyJwt(token);
    event.context.user = payload;
  } catch {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
});
```

---

## server/middleware/csrf.ts

```ts
const EXEMPT_PATHS = [
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/logout",
];

const MUTATING_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

export default defineEventHandler((event) => {
  const method = event.node.req.method ?? "GET";
  if (!MUTATING_METHODS.includes(method)) return;

  const path = getRequestURL(event).pathname;
  if (EXEMPT_PATHS.some((p) => path.startsWith(p))) return;

  const cookieToken = getCookie(event, "csrf_token");
  const headerToken = getHeader(event, "x-csrf-token");

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    throw createError({ statusCode: 403, message: "Invalid CSRF token" });
  }
});
```

---

## server/middleware/rate-limit.ts

```ts
interface RateEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateEntry>();

const LIMITS: Record<string, { max: number; windowMs: number }> = {
  "/api/auth/login": { max: 5, windowMs: 15 * 60 * 1000 },
  "/api/auth/register": { max: 3, windowMs: 60 * 60 * 1000 },
  "/api/auth/refresh": { max: 10, windowMs: 15 * 60 * 1000 },
  "/api/auth/forgot-password": { max: 3, windowMs: 60 * 60 * 1000 },
};

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname;
  const limit = LIMITS[path];
  if (!limit) return;

  const ip =
    getRequestHeader(event, "x-forwarded-for")?.split(",")[0].trim() ??
    event.node.req.socket.remoteAddress ??
    "unknown";

  const key = `${ip}:${path}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + limit.windowMs });
    return;
  }

  entry.count++;

  if (entry.count > limit.max) {
    setHeader(
      event,
      "Retry-After",
      String(Math.ceil((entry.resetAt - now) / 1000)),
    );
    throw createError({
      statusCode: 429,
      message: "Terlalu banyak percobaan. Silakan coba lagi nanti.",
    });
  }
});
```

---

## server/api/auth/login.post.ts

```ts
/**
 * POST /api/auth/login
 * Authenticates a user and issues access + refresh tokens as httpOnly cookies.
 *
 * Auth: public
 * Body: { email: string, password: string, rememberMe?: boolean }
 * Response 200: { user: { id, email, name, role } }
 * Response 400: validation errors
 * Response 401: invalid credentials
 * Response 429: rate limited
 */
export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, loginSchema.parse);
  const { email, password, rememberMe = false } = body;

  const user = await authService.validateCredentials(email, password);
  if (!user)
    throw createError({
      statusCode: 401,
      message: "Email atau password salah.",
    });

  const accessToken = signJwt({
    sub: user.id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = await authService.createRefreshToken(user.id);

  const isProd = process.env.NODE_ENV === "production";
  const refreshMaxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;

  setCookie(event, "access_token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 900,
    path: "/",
  });
  setCookie(event, "refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: refreshMaxAge,
    path: "/api/auth",
  });

  const csrfToken = crypto.randomUUID();
  setCookie(event, "csrf_token", csrfToken, {
    httpOnly: false,
    secure: isProd,
    sameSite: "strict",
    maxAge: refreshMaxAge,
    path: "/",
  });
  setCookie(event, "remember_me", rememberMe ? "1" : "0", {
    httpOnly: false,
    secure: isProd,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
  // session_hint: SameSite=Lax so it is sent even on cross-site navigations (DevTools, extensions).
  // The server plugin reads this to decide whether to attempt /api/auth/me during SSR.
  setCookie(event, "session_hint", "1", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: refreshMaxAge,
    path: "/",
  });

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
});
```

---

## server/api/auth/refresh.post.ts

```ts
/**
 * POST /api/auth/refresh
 * Issues a new access token using the refresh token cookie.
 * Rotates the refresh token (invalidates old, issues new).
 *
 * Auth: public (refresh token in cookie)
 * Response 200: { user: { id, email, name, role } }
 * Response 401: invalid or expired refresh token
 */
export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refresh_token");
  if (!refreshToken)
    throw createError({ statusCode: 401, message: "No refresh token" });

  const user = await authService.rotateRefreshToken(refreshToken);
  if (!user)
    throw createError({ statusCode: 401, message: "Invalid refresh token" });

  const rememberMe = getCookie(event, "remember_me") === "1";
  const isProd = process.env.NODE_ENV === "production";
  const refreshMaxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;

  const newAccessToken = signJwt({
    sub: user.id,
    email: user.email,
    role: user.role,
  });
  const newRefreshToken = await authService.createRefreshToken(user.id);
  // Rotate csrf_token on every refresh — the CSRF plugin must re-read from cookie before retry
  const newCsrfToken = crypto.randomUUID();

  setCookie(event, "access_token", newAccessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 900,
    path: "/",
  });
  setCookie(event, "refresh_token", newRefreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: refreshMaxAge,
    path: "/api/auth",
  });
  setCookie(event, "csrf_token", newCsrfToken, {
    httpOnly: false,
    secure: isProd,
    sameSite: "strict",
    maxAge: refreshMaxAge,
    path: "/",
  });
  setCookie(event, "session_hint", "1", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: refreshMaxAge,
    path: "/",
  });

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
});
```

---

## server/api/auth/logout.post.ts

```ts
/**
 * POST /api/auth/logout
 * Clears all auth cookies and invalidates the refresh token in DB.
 *
 * Auth: public (no CSRF required - user may be logging out due to expired session)
 * Response 200: { success: true }
 */
export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refresh_token");
  if (refreshToken) {
    await authService.invalidateRefreshToken(refreshToken).catch(() => {});
  }

  setCookie(event, "access_token", "", { maxAge: 0, path: "/" });
  setCookie(event, "refresh_token", "", { maxAge: 0, path: "/api/auth" });
  setCookie(event, "csrf_token", "", { maxAge: 0, path: "/" });
  setCookie(event, "remember_me", "", { maxAge: 0, path: "/" });
  setCookie(event, "session_hint", "", { maxAge: 0, path: "/" });

  return { success: true };
});
```

---

## Login Page — Remember Me UI

```vue
<!-- app/pages/login.vue -->
<script setup lang="ts">
definePageMeta({ middleware: "guest" });

const { login, isLoading } = useAuth();

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { rememberMe: false },
});

const onSubmit = handleSubmit(async (values) => {
  await login({
    email: values.email,
    password: values.password,
    rememberMe: values.rememberMe,
  });
});
</script>

<template>
  <form @submit="onSubmit">
    <!-- email, password fields -->
    <FormField name="rememberMe" v-slot="{ value, handleChange }">
      <FormItem class="flex items-center gap-2">
        <FormControl>
          <Checkbox :checked="value" @update:checked="handleChange" />
        </FormControl>
        <FormLabel>Ingat saya selama 30 hari</FormLabel>
      </FormItem>
    </FormField>
    <Button type="submit" :disabled="isSubmitting">
      <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
      Masuk
    </Button>
  </form>
</template>
```
