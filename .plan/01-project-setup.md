# Phase 01 — Project Setup

**Status:** PENDING  
**Executor:** Gemini CLI (Antigravity)  
**Shell:** PowerShell (Windows) — gunakan sintaks PowerShell, bukan bash  
**Estimated time:** 20–30 menit  
**Must read first:** `.plan/rules/shared.md`, `.plan/rules/frontend.md`

---

## Goal

Scaffold a production-ready Nuxt 4 project with all dependencies installed, globals.css seeded with design tokens, and code quality tooling configured.

At the end of this phase:

- `pnpm dev` starts without errors
- `http://localhost:3000` shows the default Nuxt page
- `pnpm lint` passes with zero errors
- Prisma connected to Laragon PostgreSQL

---

## Context — State Before Execution

Nuxt 4 sudah di-init (`nuxt@4.4.8`). `node_modules` sudah ada.  
**Skip Step 1. Mulai dari Step 2.**

---

## Step 1 — SKIP

Nuxt sudah di-init. Lanjut ke Step 2.

---

## Step 2 — Install additional dependencies

Sebagian deps mungkin sudah ter-install. Jalankan semua — pnpm akan skip yang sudah ada:

```powershell
pnpm add @nuxt/image @vueuse/core @vueuse/motion @vueuse/nuxt vee-validate @vee-validate/zod zod @fontsource/inter

pnpm add -D tailwindcss @tailwindcss/vite autoprefixer tailwindcss-animate

pnpm add jose bcryptjs uuid
pnpm add -D @types/bcryptjs @types/uuid

pnpm add @google-cloud/storage sharp multer
pnpm add -D @types/multer

pnpm add ioredis bullmq
pnpm add puppeteer
pnpm add nodemailer
pnpm add -D @types/nodemailer

pnpm add pino pino-pretty
pnpm add @sentry/nuxt

pnpm add -D vitest @vitest/ui @playwright/test

pnpm add -D eslint @antfu/eslint-config prettier husky lint-staged @commitlint/cli @commitlint/config-conventional

pnpm add -D typescript @types/node
```

---

## Step 3 — Configure nuxt.config.ts

Replace seluruh isi `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  css: [
    "@fontsource/inter/400.css",
    "@fontsource/inter/500.css",
    "@fontsource/inter/600.css",
    "@fontsource/inter/700.css",
    "~/assets/css/globals.css",
  ],

  modules: ["@nuxt/image", "@vueuse/nuxt", "@sentry/nuxt/module"],

  vite: {
    plugins: [],
  },

  runtimeConfig: {
    jwtSecret: "",
    jwtRefreshSecret: "",
    databaseUrl: "",
    redisUrl: "",
    gcsBucket: "",
    gcsKeyFile: "",
    encryptionKey: "",
    public: {
      appName: "MyPartner",
      appVersion: "1.0.0",
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  ssr: true,

  nitro: {
    preset: "node-server",
  },
});
```

---

## Step 4 — Configure Tailwind CSS + shadcn-vue

```powershell
pnpm dlx shadcn-vue@latest init
```

When prompted:

- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**
- Global CSS location: `app/assets/css/globals.css`
- Components alias: `@/components`
- Utils alias: `@/lib/utils`

Ini membuat `components.json` di root project.

---

## Step 5 — Seed globals.css dengan design tokens

Buat file `app/assets/css/globals.css` dengan isi lengkap berikut:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ─── Brand ─────────────────────────────────────── */
    --color-primary: #0055ff;
    --color-primary-fg: #ffffff;
    --color-primary-subtle: #eef3ff;
    --color-primary-muted: rgba(0, 85, 255, 0.15);

    /* ─── Sidebar / Navigation ────────────────────── */
    --color-sidebar-bg: #0d1017;
    --color-sidebar-item-active: #0055ff;
    --color-sidebar-icon-muted: #353b47;
    --color-sidebar-text-muted: #4b5260;
    --color-sidebar-text-active: #ffffff;
    --sidebar-width: 260px;

    /* ─── Page Layout ─────────────────────────────── */
    --color-background: #f7f8fa;
    --color-surface: #ffffff;
    --color-surface-input: #f1f2f5;
    --color-hero-dark: #111111;
    --navbar-height: 64px;

    /* ─── Text ────────────────────────────────────── */
    --color-text-primary: #0d1017;
    --color-text-secondary: #4b5260;
    --color-text-muted: #8b919e;
    --color-text-disabled: #d3d7df;

    /* ─── Borders & Dividers ──────────────────────── */
    --color-border: #f1f2f5;
    --color-border-strong: #e5e7ec;
    --color-skeleton: #e5e7ec;
    --color-skeleton-dark: #d3d7df;

    /* ─── Semantic: Success ───────────────────────── */
    --color-success-bg: #e8f8ef;
    --color-success-text: #0f7b3e;
    --color-success: #16a34a;

    /* ─── Semantic: Warning ───────────────────────── */
    --color-warning-bg: #fef4e5;
    --color-warning-text: #b45309;
    --color-warning: #d97706;

    /* ─── Semantic: Error ─────────────────────────── */
    --color-error-bg: #fef2f2;
    --color-error-text: #b91c1c;
    --color-error: #dc2626;

    /* ─── Semantic: Info ──────────────────────────── */
    --color-info-bg: #eef3ff;
    --color-info-text: #0055ff;
    --color-info: #0055ff;

    /* ─── Border Radius ───────────────────────────── */
    --radius-xs: 3px;
    --radius-sm: 4px;
    --radius-md: 6px;
    --radius-lg: 8px;
    --radius-xl: 12px;
    --radius-2xl: 14px;
    --radius-3xl: 16px;
    --radius-full: 9999px;

    /* ─── Shadows ─────────────────────────────────── */
    --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
    --shadow-modal:
      0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
    --shadow-dropdown:
      0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);

    /* ─── Spacing ─────────────────────────────────── */
    --content-padding-x: 2rem;
    --content-padding-y: 1.5rem;

    /* ─── shadcn-vue HSL tokens ───────────────────── */
    --background: 0 0% 97%;
    --foreground: 220 20% 7%;
    --card: 0 0% 100%;
    --card-foreground: 220 20% 7%;
    --popover: 0 0% 100%;
    --popover-foreground: 220 20% 7%;
    --primary: 220 100% 50%;
    --primary-foreground: 0 0% 100%;
    --secondary: 220 9% 46%;
    --secondary-foreground: 0 0% 100%;
    --muted: 220 14% 96%;
    --muted-foreground: 220 13% 50%;
    --accent: 220 100% 93%;
    --accent-foreground: 220 100% 50%;
    --destructive: 0 73% 51%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 13% 91%;
    --input: 220 14% 95%;
    --ring: 220 100% 50%;
    --radius: 0.375rem;
  }

  body {
    background-color: var(--color-background);
    color: var(--color-text-primary);
    font-family:
      "Inter",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
}

@layer components {
  .badge-base {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
  }
  .badge-success {
    @apply badge-base;
    background: var(--color-success-bg);
    color: var(--color-success-text);
  }
  .badge-warning {
    @apply badge-base;
    background: var(--color-warning-bg);
    color: var(--color-warning-text);
  }
  .badge-error {
    @apply badge-base;
    background: var(--color-error-bg);
    color: var(--color-error-text);
  }
  .badge-info {
    @apply badge-base;
    background: var(--color-info-bg);
    color: var(--color-info-text);
  }
}
```

---

## Step 6 — Buat app directory structure

Buat file-file placeholder berikut:

```
app/
  pages/
    index.vue
    login.vue
    dashboard/index.vue
    kitchen-sink/index.vue
  components/
    ui/              ← folder kosong (shadcn-vue install di Phase 02)
    shared/          ← folder kosong
  composables/
    useAuth.ts
  layouts/
    default.vue
    admin.vue
  middleware/
    auth.ts
    guest.ts
  plugins/
    auth.server.ts
    01.auth.client.ts
    02.csrf.client.ts

server/
  api/.gitkeep
  middleware/.gitkeep
  utils/
    response.ts      ← Step 7
    env.ts           ← Step 7
    logger.ts        ← Step 7
  validators/.gitkeep
```

Template placeholder `.vue`:

```vue
<template>
  <div><!-- placeholder --></div>
</template>
```

Template placeholder `.ts`:

```ts
// TODO: implement in Phase 03
export {};
```

---

## Step 7 — Buat server utilities

**`server/utils/response.ts`**

```ts
import type { H3Event } from "h3";

export function ok<T>(event: H3Event, data: T, statusCode = 200) {
  setResponseStatus(event, statusCode);
  return { success: true, data };
}

export function okList<T>(
  event: H3Event,
  data: T[],
  meta: { total: number; page: number; limit: number; totalPages: number },
) {
  return { success: true, data, meta };
}

export function fail(
  event: H3Event,
  message: string,
  statusCode = 400,
  errors?: { field: string; message: string }[],
) {
  setResponseStatus(event, statusCode);
  return { success: false, message, ...(errors ? { errors } : {}) };
}
```

**`server/utils/env.ts`**

```ts
const required = [
  "NUXT_JWT_SECRET",
  "NUXT_JWT_REFRESH_SECRET",
  "NUXT_DATABASE_URL",
  "NUXT_REDIS_URL",
];

export function validateEnv() {
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}
```

**`server/utils/logger.ts`**

```ts
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  transport:
    process.env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});
```

---

## Step 8 — SKIP (tidak pakai Docker)

Database dan Redis disediakan oleh **Laragon** yang sudah berjalan di localhost.  
Pastikan database `mypartner_dev` sudah dibuat di Laragon sebelum lanjut ke Step 9.

---

## Step 9 — Prisma setup

```powershell
pnpm add prisma @prisma/client
pnpm prisma init
```

Replace seluruh isi `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Full schema akan ditambahkan di phase database-schema
model _SetupCheck {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
}
```

Buat `.env`:

```env
# Database — Laragon PostgreSQL
# Sesuaikan username/password dengan konfigurasi Laragon kamu
# Buat database "mypartner_dev" di Laragon terlebih dahulu
DATABASE_URL="postgresql://root:@localhost:5432/mypartner_dev"

# Redis — Laragon Redis
NUXT_REDIS_URL="redis://localhost:6379"

# JWT — generate dengan perintah ini:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
NUXT_JWT_SECRET="REPLACE_WITH_GENERATED_SECRET"
NUXT_JWT_REFRESH_SECRET="REPLACE_WITH_GENERATED_SECRET_2"

# Encryption (untuk Account Vault)
NUXT_ENCRYPTION_KEY="REPLACE_WITH_64_HEX_CHARS"

# GCS (isi nanti)
NUXT_GCS_BUCKET="mypartner-files"
NUXT_GCS_KEY_FILE="./gcs-service-account.json"

# App
NODE_ENV="development"
LOG_LEVEL="debug"
```

Buat `.env.example`:

```env
DATABASE_URL="postgresql://root:@localhost:5432/mypartner_dev"
NUXT_REDIS_URL="redis://localhost:6379"
NUXT_JWT_SECRET="your-jwt-secret-here"
NUXT_JWT_REFRESH_SECRET="your-jwt-refresh-secret-here"
NUXT_ENCRYPTION_KEY="your-64-hex-char-encryption-key"
NUXT_GCS_BUCKET="mypartner-files"
NUXT_GCS_KEY_FILE="./gcs-service-account.json"
NODE_ENV="development"
LOG_LEVEL="debug"
```

Pastikan `.env` ada di `.gitignore` — sudah ada secara default.

Run initial migration:

```powershell
pnpm prisma migrate dev --name init
```

---

## Step 10 — Code Quality Setup

**`eslint.config.js`**

```js
import antfu from "@antfu/eslint-config";

export default antfu({
  vue: true,
  typescript: true,
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "@typescript-eslint/no-explicit-any": "error",
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
  },
});
```

**`commitlint.config.js`**

```js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "chore",
        "refactor",
        "test",
        "docs",
        "style",
        "perf",
        "ci",
      ],
    ],
  },
};
```

Init husky:

```powershell
pnpm exec husky init
```

Buat `.husky/commit-msg` dengan isi:

```sh
npx --no -- commitlint --edit $1
```

Tambahkan ke `package.json` (merge, jangan replace file):

```json
"scripts": {
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "typecheck": "nuxt typecheck"
},
"lint-staged": {
  "*.{ts,vue}": ["eslint --fix", "prettier --write"],
  "*.{css,md,json}": ["prettier --write"]
}
```

---

## Step 11 — SKIP

UI Kit reference HTML akan ditambahkan manual sebelum Phase 02 dimulai.

---

## Step 12 — Verify

```powershell
pnpm dev
```

Buka `http://localhost:3000` — harus load tanpa error di browser dan terminal.

```powershell
pnpm lint
```

Harus pass tanpa error.

---

## Completion Criteria

- [ ] `pnpm dev` runs, page loads at `http://localhost:3000`
- [ ] `nuxt.config.ts` mencantumkan `globals.css` di array `css`
- [ ] `app/assets/css/globals.css` berisi semua design tokens
- [ ] `server/utils/response.ts`, `env.ts`, `logger.ts` dibuat
- [ ] `prisma/schema.prisma` ada, `pnpm prisma migrate dev --name init` berhasil
- [ ] Husky + commitlint aktif
- [ ] `pnpm lint` pass

**Update `.plan/PROGRESS.md` saat selesai. Kemudian mulai Phase 02.**
