# skills/frontend.md — Frontend Implementation Patterns

> Auth-related frontend patterns are in `skills/auth.md`.
> CSS and design rules are in `rules/frontend.md`.

---

## API Response Types

Define these types once in `app/types/api.ts` and import them everywhere.
Never write inline response types — always reference these.

```ts
// app/types/api.ts

export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiList<T> {
  success: true;
  data: T[];
  meta: ApiMeta;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
}
```

---

## API Response Consumption

### `useFetch` — single resource (page-level, SSR-integrated)

```ts
const {
  data: response,
  error,
  refresh,
} = await useFetch<ApiSuccess<Article>>("/api/articles/1");

// Unwrap the envelope in a computed
const article = computed(() => response.value?.data ?? null);
```

### `useFetch` — paginated list

```ts
const page = ref(1);
const limit = ref(10);

const { data: response, refresh } = await useFetch<ApiList<Article>>(
  "/api/articles",
  {
    query: { page, limit },
    watch: [page, limit], // auto-refetch when page or limit changes
  },
);

const articles = computed(() => response.value?.data ?? []);
const meta = computed(() => response.value?.meta);
```

Changing `page.value` or `limit.value` triggers a refetch automatically.

### `$fetch` — client-triggered (form submissions, mutations)

```ts
import type { FetchError } from "ofetch";
import type { ApiSuccess, ApiError } from "~/types/api";

try {
  const res = await $fetch<ApiSuccess<Article>>("/api/articles", {
    method: "POST",
    body: values,
  });
  // res.data is the created article
  toast.success("Artikel berhasil dibuat.");
  await navigateTo("/articles");
} catch (err) {
  const fetchError = err as FetchError<ApiError>;
  const errorData = fetchError.data;
  toast.error(errorData?.message ?? "Terjadi kesalahan.");
}
```

### `$fetch` — form submit with field error mapping (vee-validate)

When the backend returns `errors: [{ field, message }]`, map them back to the form
so each field shows its own error under the input — not just a toast.

```ts
import type { FetchError } from "ofetch";
import type { ApiError } from "~/types/api";

const { handleSubmit, setFieldError } = useForm({
  validationSchema: toTypedSchema(createArticleSchema),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const res = await $fetch<ApiSuccess<Article>>("/api/articles", {
      method: "POST",
      body: values,
    });
    toast.success("Artikel berhasil disimpan.");
    await navigateTo("/articles");
  } catch (err) {
    const fetchError = err as FetchError<ApiError>;
    const errorData = fetchError.data;

    if (errorData?.errors?.length) {
      // Map each field error back to the form field
      errorData.errors.forEach((e) => setFieldError(e.field, e.message));
    } else {
      toast.error(errorData?.message ?? "Terjadi kesalahan.");
    }
  }
});
```

Rules:

- Always check `errors` first before falling back to `message`
- `setFieldError` makes the error appear under the relevant `<FormMessage />` — no extra UI needed
- Only show a toast for non-field errors (e.g. 401, 403, 500, rate limit)

---

## Nuxt 4 / Vue 3 Patterns

### Data Fetching

```ts
// SSR-integrated: runs on server + client (use for page-level data)
const { data: response } =
  await useFetch<ApiSuccess<Article>>("/api/articles/1");
const article = computed(() => response.value?.data ?? null);

// Paginated list (see API Response Consumption above for full pattern)
const { data: listResponse } = await useFetch<ApiList<Article>>(
  "/api/articles",
  {
    query: { page: 1, limit: 10 },
  },
);

// Client-triggered fetch (use in event handlers, form submissions)
// Always in try/catch — see $fetch patterns above
const res = await $fetch<ApiSuccess<Article>>("/api/articles", {
  method: "POST",
  body: values,
});

// SSR-integrated with custom logic
const { data } = await useAsyncData("articles", () =>
  $fetch<ApiList<Article>>("/api/articles"),
);
```

### SSR-Safe Patterns

```ts
// Guard DOM access
onMounted(() => {
  // Safe to access window, document here
});

// Guard inline
if (process.client) {
  // client-only code
}

// Wrap client-only components
// <ClientOnly><WysiwygEditor /></ClientOnly>
```

### Shared State (SSR-safe)

```ts
// Use useState for state that must survive SSR/hydration
const count = useState("counter", () => 0);

// Never: const count = ref(0) at module level (not shared across SSR/client)
```

### Navigation

```ts
// Always use navigateTo (SSR-safe, preferred over router.push)
await navigateTo("/admin/dashboard", { replace: true });
await navigateTo({ path: "/users", query: { page: 2 } });

// With redirect param
const route = useRoute();
const redirect = route.query.redirect as string | undefined;
await navigateTo(
  redirect && redirect.startsWith("/") ? redirect : "/admin/dashboard",
  { replace: true },
);
```

---

## Tailwind CSS

- Utility-first; no custom CSS unless a utility cannot express the style
- Responsive design (mobile-first): `sm:`, `md:`, `lg:`, `xl:`
- `tailwindcss-animate` plugin for keyframe animation classes
- Use `cn()` helper (`clsx` + `tailwind-merge`) for all conditional class composition

```ts
// app/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```vue
<div :class="cn('base-class', isActive && 'active-class', props.class)" />
```

---

## shadcn-vue

Initialize at project setup:

```bash
npx shadcn-vue@latest init
```

Add components:

```bash
npx shadcn-vue@latest add button dialog alert-dialog sonner form input
npx shadcn-vue@latest add textarea select checkbox table badge card skeleton separator
```

Components are copied into `app/components/ui/` - fully owned and customizable.

Theming is done via CSS variables in `app/assets/css/globals.css` - never touch
shadcn-vue theme anywhere else.

Key components:
| Need | Component |
|---|---|
| All buttons | `Button` with variants: default, destructive, outline, ghost, link |
| Toast notifications | `Sonner` via `vue-sonner` + `useSonner()` |
| General modal | `Dialog` + `DialogContent`, `DialogHeader`, `DialogFooter` |
| Destructive confirmation | `AlertDialog` + `AlertDialogAction`, `AlertDialogCancel` |
| Form field wrapper | `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` |
| Loading indicator | `Button` with `disabled` + `<Loader2 class="animate-spin" />` (Lucide) |
| Data table | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` |

Do not build custom versions of these. Customize by editing the component file in `app/components/ui/`.

---

## VueUse

Install: `npm install @vueuse/core @vueuse/motion`

| Composable                | Use case                                        |
| ------------------------- | ----------------------------------------------- |
| `useDebounceFn`           | Debounce search input, API calls                |
| `useIntersectionObserver` | Scroll-triggered effects, lazy load             |
| `useClipboard`            | Copy to clipboard                               |
| `useMediaQuery`           | Responsive logic in script                      |
| `useWindowSize`           | Viewport-aware components                       |
| `onClickOutside`          | Close dropdowns on outside click                |
| `useFocusTrap`            | Trap focus inside modals (accessibility)        |
| `useStorage`              | Persist non-sensitive state to localStorage     |
| `useEventListener`        | Safe event listeners that auto-clean on unmount |

All VueUse composables are SSR-safe when called inside `onMounted` or guarded with `process.client`.
Do not write custom implementations of utilities that VueUse provides.

---

## Form Handling — vee-validate + Zod

```ts
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { loginSchema } from "~/validators/auth"; // same schema as server

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { email: "", password: "" },
});

const onSubmit = handleSubmit(async (values) => {
  await $fetch("/api/auth/login", { method: "POST", body: values });
});
```

```vue
<template>
  <Form @submit="onSubmit">
    <FormField name="email" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input type="email" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit" :disabled="isSubmitting">
      <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
      Simpan
    </Button>
  </Form>
</template>
```

Rules:

- Never manage form state with manual `ref` variables
- Never call API directly in `@submit` - always go through `handleSubmit`
- `isSubmitting` drives the button loading state - no manual `loading` ref needed
- Import the same Zod schema from `server/validators/` - do not duplicate

---

## Zod — Shared Validators

```ts
// server/validators/auth.ts — used on both client and server
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

Import path from frontend: `~/validators/auth` (Nuxt resolves `~/` to `app/` but also
checks root - place shared validators at `server/validators/` and import with `~/server/validators/auth`
or create an alias in `nuxt.config.ts`).

---

## Code Quality — ESLint + Prettier + Husky

**ESLint (`eslint.config.mjs`):**

```js
import antfu from "@antfu/eslint-config";
export default antfu({ vue: true, typescript: true });
```

**Prettier (`.prettierrc`):**

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "all"
}
```

**Husky + lint-staged (`package.json`):**

```json
"lint-staged": {
  "*.{ts,vue}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": "prettier --write"
}
```

**commitlint (`commitlint.config.mjs`):**

```js
export default { extends: ["@commitlint/config-conventional"] };
```

**Scripts:**

```json
"lint": "eslint .",
"lint:fix": "eslint . --fix",
"format": "prettier --write ."
```

---

## Animation & Motion

```vue
<!-- @vueuse/motion: scroll-triggered entrance -->
<div v-motion :initial="{ opacity: 0, y: 30 }" :enter="{ opacity: 1, y: 0 }">
  content
</div>

<!-- Visible-only trigger (fires when element enters viewport) -->
<div
  v-motion
  :initial="{ opacity: 0 }"
  :visible="{ opacity: 1, transition: { duration: 500 } }"
>
  content
</div>

<!-- Vue Transition for page transitions (in app.vue) -->
<NuxtPage>
  <template #default="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </template>
</NuxtPage>
```

```css
/* Always provide reduced-motion fallback in globals.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Image Optimization — @nuxt/image

```bash
npm install @nuxt/image
```

```ts
// nuxt.config.ts
modules: ['@nuxt/image'],
image: {
  format: ['webp'],
}
```

```vue
<!-- Replace all <img> tags -->
<NuxtImg
  src="/uploads/photo.jpg"
  :width="800"
  :height="600"
  format="webp"
  loading="lazy"
  alt="description"
/>

<!-- LCP image (above the fold) -->
<NuxtImg loading="eager" fetchpriority="high" ... />
```

Always specify `width` and `height` to prevent layout shift (CLS).

---

## Naming Conventions (Frontend)

- File and folder names: `kebab-case`, English only
- Variables and functions: `camelCase`
- Types, interfaces, enums: `PascalCase`
- API response fields: `camelCase`
- Localized URL paths: override with `definePageMeta({ path: '/jalur-lokal' })`

---

## Optional: SEO & Analytics

```ts
// In each public page
useSeoMeta({
  title: 'Page Title | Site Name',
  description: 'Page description',
  ogImage: '/og-image.jpg',
  ogUrl: 'https://example.com/page',
})

// JSON-LD structured data
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', ... }),
  }],
})
```

---

## Optional: WYSIWYG — TinyMCE or CKEditor

**TinyMCE:**

```vue
<!-- Always wrap in ClientOnly to prevent SSR mismatch -->
<ClientOnly>
  <Editor
    :api-key="runtimeConfig.public.tinymceApiKey"
    :init="{ height: 400, menubar: false, images_upload_url: '/api/upload' }"
    v-model="content"
  />
</ClientOnly>
```

**CKEditor 5:**

```vue
<ClientOnly>
  <ckeditor :editor="Editor" v-model="content" :config="editorConfig" />
</ClientOnly>
```

Both: sanitize HTML output before saving to DB - never trust raw editor output.

---

## Optional: i18n

```bash
npm install @nuxtjs/i18n
```

```ts
// nuxt.config.ts
modules: ['@nuxtjs/i18n'],
i18n: {
  strategy: 'prefix_except_default',
  defaultLocale: 'id',
  locales: [
    { code: 'id', file: 'id.json' },
    { code: 'en', file: 'en.json' },
  ],
  langDir: 'locales/',
}
```

Translation keys in `snake_case` grouped by feature: `auth.login_button`, `nav.home`.
Use `useI18n()` composable; avoid global `$t` in SSR context.

---

## Optional: Error Tracking — Sentry

```ts
// nuxt.config.ts
modules: ['@sentry/nuxt/module'],
sentry: {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
}
```

- Capture unhandled exceptions on client and server
- Set user context on login, clear on logout
- Ignore expected 4xx errors; capture 5xx and unexpected client-side errors only
