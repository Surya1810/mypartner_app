# Fix 002 — Design System Foundation (UI Kit Alignment)

**Depends on:** `chore_001` selesai, `fix_001` selesai  
**Shell:** PowerShell (Windows)  
**Ground truth:** `http://localhost:3000/ui-kit-reference.html`

---

## Goal

Rebuild design system foundation dari awal berdasarkan `MyPartner UI Kit.html` yang sudah dibaca.  
Tiga hal fundamental yang salah di implementasi sebelumnya:

1. **Font salah** — Inter → harus Montserrat (body) + Kanit (heading) + JetBrains Mono (kode)
2. **Color scale salah** — custom CSS vars flat → harus Tailwind v4 `@theme` scale (brand/neutral/success/warning/danger)
3. **Component style tidak match** — input, button, card, shadow semua berbeda dari UI Kit

---

## Step 1 — Install fonts

```powershell
pnpm add @fontsource/montserrat @fontsource/kanit @fontsource/jetbrains-mono
```

Weights yang dibutuhkan: 400, 500, 600, 700 untuk Montserrat dan Kanit.

---

## Step 2 — Update `nuxt.config.ts` — font CSS imports

Ganti blok `css` yang sekarang pakai `@fontsource/inter` dengan:

```ts
css: [
  // Montserrat — body font
  '@fontsource/montserrat/400.css',
  '@fontsource/montserrat/500.css',
  '@fontsource/montserrat/600.css',
  '@fontsource/montserrat/700.css',
  // Kanit — display/heading font
  '@fontsource/kanit/400.css',
  '@fontsource/kanit/600.css',
  '@fontsource/kanit/700.css',
  // JetBrains Mono — code/mono font
  '@fontsource/jetbrains-mono/400.css',
  '@fontsource/jetbrains-mono/500.css',
  // Global styles
  '~/assets/css/globals.css',
],
```

---

## Step 3 — Rebuild `app/assets/css/globals.css`

**Struktur baru globals.css (tulis ulang penuh, jangan edit parsial):**

```css
@import "tailwindcss";

/* ============================================================
   TAILWIND V4 THEME — MyPartner Design System
   Ground truth: MyPartner UI Kit.html
   ============================================================ */

@theme {
  /* ── Fonts ─────────────────────────────────────────────── */
  --font-sans: "Montserrat", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Kanit", "Montserrat", ui-sans-serif, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* ── Brand scale ─────────────────────────────────────── */
  --color-brand-50: #eef3ff;
  --color-brand-100: #d9e4ff;
  --color-brand-200: #b3c9ff;
  --color-brand-300: #80a4ff;
  --color-brand-400: #4d7eff;
  --color-brand-500: #0055ff;
  --color-brand-600: #0047d6;
  --color-brand-700: #0039ad;
  --color-brand-800: #002c85;
  --color-brand-900: #001f5c;

  /* ── Neutral / Ink scale ────────────────────────────── */
  --color-neutral-0: #ffffff;
  --color-neutral-50: #f7f8fa;
  --color-neutral-100: #f1f2f5;
  --color-neutral-200: #e5e7ec;
  --color-neutral-300: #d3d7df;
  --color-neutral-400: #9aa0ad;
  --color-neutral-500: #6b7280;
  --color-neutral-600: #4b5260;
  --color-neutral-700: #353b47;
  --color-neutral-750: #2a2f3b;
  --color-neutral-800: #21262f;
  --color-neutral-850: #191e27;
  --color-neutral-900: #14171c;
  --color-neutral-950: #0d1017;

  /* ── Ink (text) ─────────────────────────────────────── */
  --color-ink: #1b1b1b;
  --color-ink-near: #111111;

  /* ── Semantic: Success ──────────────────────────────── */
  --color-success-50: #e8f8ef;
  --color-success-100: #c6eed7;
  --color-success-500: #15a05a;
  --color-success-600: #11874c;
  --color-success-700: #0c6b3c;

  /* ── Semantic: Warning ──────────────────────────────── */
  --color-warning-50: #fef4e5;
  --color-warning-100: #fce3bc;
  --color-warning-500: #e8920c;
  --color-warning-600: #c2790a;
  --color-warning-700: #945c06;

  /* ── Semantic: Danger ───────────────────────────────── */
  --color-danger-50: #fdecec;
  --color-danger-100: #f9cfcf;
  --color-danger-500: #e11900;
  --color-danger-600: #be1500;
  --color-danger-700: #911000;

  /* ── Shadows ────────────────────────────────────────── */
  --shadow-xs: 0 1px 2px rgba(20, 23, 28, 0.05);
  --shadow-soft:
    0 1px 3px rgba(20, 23, 28, 0.06), 0 1px 2px rgba(20, 23, 28, 0.04);
  --shadow-card:
    0 4px 12px rgba(20, 23, 28, 0.07), 0 2px 4px rgba(20, 23, 28, 0.04);
  --shadow-lift:
    0 12px 28px rgba(20, 23, 28, 0.1), 0 4px 8px rgba(20, 23, 28, 0.05);
  --shadow-xl:
    0 24px 50px rgba(20, 23, 28, 0.14), 0 8px 16px rgba(20, 23, 28, 0.06);
  --shadow-brand:
    0 10px 24px rgba(0, 85, 255, 0.18), 0 2px 6px rgba(0, 85, 255, 0.1);
  --shadow-card-dark:
    0 4px 14px rgba(0, 0, 0, 0.28), 0 2px 4px rgba(0, 0, 0, 0.16);

  /* ── Border Radius ──────────────────────────────────── */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;

  /* ── Layout ─────────────────────────────────────────── */
  --sidebar-width: 260px;
  --navbar-height: 64px;
}

/* ============================================================
   SHADCN-VUE TOKEN MAPPING
   Maps shadcn's HSL var names → our brand scale
   ============================================================ */

@layer base {
  :root {
    --background: 220 14% 98%; /* neutral-50 */
    --foreground: 0 0% 11%; /* ink #1B1B1B */
    --card: 0 0% 100%;
    --card-foreground: 0 0% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 11%;
    --primary: 220 100% 50%; /* brand-500 #0055FF */
    --primary-foreground: 0 0% 100%;
    --secondary: 220 9% 29%; /* neutral-700 #353B47 */
    --secondary-foreground: 0 0% 100%;
    --muted: 220 14% 95%; /* neutral-100 */
    --muted-foreground: 220 13% 56%; /* neutral-500 */
    --accent: 220 100% 93%; /* brand-50 */
    --accent-foreground: 220 100% 50%;
    --destructive: 8 100% 44%; /* danger-500 #E11900 */
    --destructive-foreground: 0 0% 100%;
    --border: 220 13% 90%; /* neutral-200 */
    --input: 220 14% 95%; /* neutral-100 */
    --ring: 220 100% 50%; /* brand-500 */
    --radius: 0.5rem; /* 8px = radius-md */
  }

  body {
    background-color: var(--color-neutral-50);
    color: var(--color-ink);
    font-family: var(--font-sans);
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  h1,
  h2,
  h3 {
    font-family: var(--font-display);
  }

  code,
  pre,
  .font-mono {
    font-family: var(--font-mono);
  }
}

/* ============================================================
   BADGE UTILITIES
   ============================================================ */

@layer components {
  .badge-base {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold;
  }
  .badge-success {
    @apply badge-base;
    background: var(--color-success-50);
    color: var(--color-success-600);
  }
  .badge-warning {
    @apply badge-base;
    background: var(--color-warning-50);
    color: var(--color-warning-600);
  }
  .badge-danger {
    @apply badge-base;
    background: var(--color-danger-50);
    color: var(--color-danger-600);
  }
  .badge-brand {
    @apply badge-base;
    background: var(--color-brand-50);
    color: var(--color-brand-600);
  }
  .badge-neutral {
    @apply badge-base;
    background: var(--color-neutral-100);
    color: var(--color-neutral-600);
  }
}

/* ============================================================
   SCROLLBAR CUSTOM
   ============================================================ */

.mp-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.mp-scroll::-webkit-scrollbar-thumb {
  background: content-box var(--color-neutral-300);
  border-radius: 9999px;
  border: 2px solid transparent;
}
.mp-scroll::-webkit-scrollbar-thumb:hover {
  background: content-box var(--color-neutral-400);
}

/* ============================================================
   ANIMATION UTILITIES
   ============================================================ */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active {
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
.pop-leave-active {
  transition: all 0.15s ease;
}
.pop-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
.pop-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
```

---

## Step 4 — Update `.plan/rules/frontend.md`

Update Section 1 (Design Tokens) dan Section 2 (Typography) agar mencerminkan sistem baru.

- Section 1: Ganti tabel CSS vars dengan penjelasan `@theme` scale (brand, neutral, semantic)
- Section 2: Update font menjadi Montserrat + Kanit + JetBrains Mono
- Section 5 (shadcn mapping): Update ke nilai baru yang ada di globals.css Step 3

**Tambahkan di Section 4 (Component Conventions) — pola wajib dari UI Kit:**

```
Input pattern:
  h-11 px-3.5 rounded-md bg-white border border-neutral-300 text-sm text-ink
  placeholder:text-neutral-400
  focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 outline-none transition

Button solid:
  h-10 px-4 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-brand transition-colors

Button outline:
  h-10 px-4 rounded-md bg-white border border-neutral-300 hover:border-brand-500
  hover:text-brand-600 text-ink text-sm font-semibold shadow-xs transition-colors

Button ghost:
  h-10 px-4 rounded-md text-brand-600 hover:bg-brand-50 text-sm font-semibold transition-colors

Card:
  bg-white rounded-lg border border-neutral-200 shadow-soft p-6

Section header label (above card):
  text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 mb-3
```

---

## Step 5 — Rebuild `app/layouts/admin.vue`

Rebuild penuh berdasarkan struktur sidebar UI Kit. Key patterns:

**Sidebar dark (fixed default — no light mode toggle):**

```
aside: fixed inset-y-0 left-0 w-[260px] flex flex-col bg-neutral-950
Logo area: h-16 flex items-center gap-2.5 px-5 border-b border-white/10
  - Logo: SVG icon Partnership di dalam div 36x36 rounded-lg bg-brand-500
  - Text: "MyPartner" font-bold text-[15px] text-white (font-display)
  - Subtitle: "Procurement" text-[10px] uppercase tracking-[.14em] text-brand-500

Nav item inactive: flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium
  text-neutral-400 hover:bg-white/5 hover:text-white transition-colors
Nav item active: bg-brand-500 text-white shadow-brand

Nav group label: px-3 pt-5 pb-1 text-[10px] uppercase tracking-[.14em] text-neutral-700 font-semibold

User section (bottom): px-3 py-4 border-t border-white/10
  Avatar: w-9 h-9 rounded-full bg-brand-500/20 text-brand-300 font-bold text-sm grid place-items-center
  Name: text-sm font-semibold text-white
  Role: text-xs text-neutral-400
  Logout icon: lucide log-out w-4 h-4 text-neutral-400 ml-auto
```

**Navbar (top, sticky):**

```
header: sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-sm border-b border-neutral-200
  flex items-center gap-3 px-8
  ml-[260px]

Left: breadcrumb (slot name="breadcrumb") — text-sm text-neutral-500 font-medium

Search: ml-auto max-w-xs w-full
  relative div, lucide search icon absolute left-3, input:
  h-10 pl-10 pr-3 rounded-md bg-neutral-100 border border-transparent text-sm
  placeholder:text-neutral-400
  focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 outline-none transition

Bell button: relative w-10 h-10 rounded-md hover:bg-neutral-100 grid place-items-center
  Notification dot: absolute top-2 right-2.5 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-white

Avatar: w-9 h-9 rounded-full bg-brand-500 text-white font-bold text-sm shadow-brand grid place-items-center
```

**Content area:**

```
main: ml-[260px] pt-16 min-h-screen bg-neutral-50
  Inner wrapper: px-8 py-8 max-w-[1100px] mx-auto
  <slot />
```

**Nav items dengan Lucide icons (18x18):**

```ts
{ id: 'entities',  label: 'Legal Entities',   icon: 'building-2',      group: 'Master Data' },
{ id: 'divisions', label: 'Divisi',            icon: 'briefcase',       group: 'Master Data' },
{ id: 'users',     label: 'Pengguna & RBAC',  icon: 'users',           group: 'Master Data' },
{ id: 'clients',   label: 'Klien',             icon: 'handshake',       group: 'Master Data' },
{ id: 'suppliers', label: 'Supplier',          icon: 'package',         group: 'Master Data' },
{ id: 'documents', label: 'Dokumen',           icon: 'file-text',       group: 'Operasional' },
{ id: 'vault',     label: 'Vault Akun',        icon: 'key-round',       group: 'Operasional' },
{ id: 'leave',     label: 'Cuti & Izin',       icon: 'calendar-off',    group: 'Operasional' },
{ id: 'regulations',label: 'Regulasi',         icon: 'scale',           group: 'Operasional' },
{ id: 'letters',   label: 'Surat',             icon: 'mail',            group: 'Operasional' },
{ id: 'presales',  label: 'Pre-Sales / CRM',   icon: 'phone-call',      group: 'Sales' },
{ id: 'aftersales',label: 'After-Sales',        icon: 'headphones',      group: 'Sales' },
{ id: 'products',  label: 'Katalog Produk',    icon: 'layers',          group: 'Produk & Inventaris' },
{ id: 'inventory', label: 'Inventaris',         icon: 'warehouse',       group: 'Produk & Inventaris' },
{ id: 'dashboard', label: 'Dashboard',          icon: 'layout-dashboard',group: 'Intelligence' },
{ id: 'reports',   label: 'Laporan',            icon: 'file-bar-chart',  group: 'Intelligence' },
{ id: 'audit',     label: 'Audit Trail',        icon: 'shield',          group: 'Intelligence' },
```

Gunakan `lucide-vue-next` — import individual icons, bukan string icon name.

**Logo SVG Partnership (pakai asset yang ada):**

```vue
<img src="/images/logo-pps-symbol.png" class="w-5 h-5 object-contain" />
```

Letakkan di dalam div `w-9 h-9 rounded-lg bg-brand-500 grid place-items-center`.

---

## Step 6 — Rebuild `app/pages/dashboard/index.vue`

Gunakan `definePageMeta({ layout: 'admin' })`.

**Struktur konten:**

```
space-y-8

1. Hero card (rounded-2xl overflow-hidden relative, bg: #111111)
   - Diagonal stripe overlay (repeating-linear-gradient di pseudo-element atau div absolute)
   - Badge pill: "DESIGN SYSTEM · v1.0" → ganti "MyPartner CMS · v1.0"
   - Heading (font-display text-4xl font-bold text-white): "Selamat datang, {name}"
   - Subtext (text-neutral-300 text-base): deskripsi singkat
   - CTA button (bg-brand-500 shadow-brand) + ghost button

2. Stats row (grid grid-cols-3 gap-5)
   Setiap stat card: bg-white rounded-lg border border-neutral-200 shadow-soft p-6
   - Icon container: w-11 h-11 rounded-lg grid place-items-center (semantic bg color)
   - Lucide icon 20x20
   - Value: text-3xl font-bold font-display text-ink
   - Label: text-sm text-neutral-500
   - Delta badge (opsional): badge-success / badge-danger text-xs

3. Activity feed (bg-white rounded-lg border border-neutral-200 shadow-soft)
   Header: px-6 py-4 border-b border-neutral-200 flex justify-between
     - Title: text-sm font-semibold text-ink
     - "Lihat semua" link: text-sm text-brand-600 font-semibold
   Rows: divide-y divide-neutral-100
     - Avatar initial: w-8 h-8 rounded-full bg-brand-500 text-white font-bold text-xs
     - Name + action
     - Time + badge status
```

---

## Step 7 — Rebuild `app/pages/ui-preview/index.vue`

Page standalone (`layout: false`). Wrapper:

```vue
<div class="min-h-screen bg-neutral-50 font-sans">
  <div class="max-w-[1100px] mx-auto px-8 py-12 space-y-16">
```

**Section header pattern (gunakan konsisten untuk semua 12 section):**

```vue
<div class="flex items-baseline gap-3 mb-6">
  <span class="text-[10px] font-semibold uppercase tracking-[.14em] text-neutral-400 font-mono w-6">01</span>
  <h2 class="text-base font-semibold text-ink">Typography</h2>
  <span class="text-xs text-neutral-400 ml-1">Montserrat · Kanit · JetBrains Mono</span>
  <div class="flex-1 h-px bg-neutral-200 ml-2"></div>
</div>
```

**12 Sections yang harus ada:**

1. **Typography** — H1-H6 pakai font-display (Kanit), body text, mono text
2. **Color Palette** — swatches brand (50-900), neutral (50-950), success/warning/danger
3. **Buttons** — Solid, Outline, Ghost, Danger, Secondary; Sizes: sm/md/lg; States: disabled, loading
4. **Form Elements** — Input (default/focus/error), Textarea, Select, Checkbox, Radio, Switch/Toggle
5. **Combobox** — Advanced search-select (pakai shadcn Command component)
6. **Alerts & Badges** — Alert banners (success/warning/danger/info), status pills, badge variants
7. **Cards** — Stat card, Standard card (title+body+footer), Hero dark card
8. **Data Table** — Table dengan header, body rows, status badges, action buttons, row hover
9. **Modals & Overlays** — Dialog, Sheet, AlertDialog, Tooltip, Dropdown
10. **Toast Notifications** — 4 variants via sonner (success/error/warning/info)
11. **Pagination** — Full pagination component (gunakan API yang sudah difix di fix_001)
12. **Skeleton Loaders** — Card skeleton, table row skeleton, stat skeleton

---

## Step 8 — Rebuild `app/pages/login.vue`

Standalone page (`layout: false`). Gunakan background image asset:

```vue
<div class="min-h-screen flex bg-cover bg-center"
     style="background-image: url('/images/backgrounds/bg-login-dark.jpg')">
  <!-- Overlay -->
  <div class="absolute inset-0 bg-neutral-950/60"></div>

  <!-- Left panel — branding (hidden mobile) -->
  <div class="relative hidden lg:flex flex-col justify-between w-1/2 p-12">
    <img src="/images/logo-pps-light.png" class="h-8 object-contain object-left" />
    <div>
      <h1 class="font-display text-4xl font-bold text-white mb-3">MyPartner</h1>
      <p class="text-neutral-300 text-base">Platform operasional terpadu PT Partnership Procurement Solution.</p>
    </div>
    <p class="text-neutral-500 text-xs">© 2026 PT Partnership Procurement Solution</p>
  </div>

  <!-- Right panel — form -->
  <div class="relative flex-1 flex items-center justify-center p-8">
    <div class="w-full max-w-sm">
      <div class="bg-white rounded-xl shadow-xl p-8">
        <!-- Logo (mobile only) -->
        <div class="flex items-center gap-3 mb-7 lg:hidden">
          <div class="w-9 h-9 rounded-lg bg-brand-500 grid place-items-center">
            <img src="/images/logo-pps-symbol.png" class="w-5 h-5 object-contain" />
          </div>
          <span class="font-display font-bold text-ink">MyPartner</span>
        </div>

        <h2 class="font-display text-2xl font-bold text-ink mb-1">Masuk</h2>
        <p class="text-sm text-neutral-500 mb-7">Gunakan akun Partnership Anda</p>

        <!-- Form fields: email + password + remember me -->
        <!-- CTA: full-width bg-brand-500 h-11 rounded-md font-semibold -->
      </div>
    </div>
  </div>
</div>
```

---

## Step 9 — Update `app/app.vue`

Pastikan:

```vue
<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
</script>
<template>
  <div>
    <NuxtLayout><NuxtPage /></NuxtLayout>
    <Toaster position="bottom-right" rich-colors />
  </div>
</template>
```

---

## Completion Criteria

- [x] `pnpm dev` berjalan tanpa error
- [x] Font Montserrat tampak di body text (bukan Inter)
- [x] Font Kanit tampak di heading H1/H2/H3
- [x] `bg-brand-500` dan `text-neutral-400` dikenali sebagai class Tailwind (tidak ada unknown utility error)
- [x] `/dashboard` — hero card, 3 stat cards dengan icon, activity feed
- [x] `/ui-preview` — 12 sections semua tampil, pagination tidak 500 error
- [x] `/login` — background image tampil, form card di atas overlay
- [x] Sidebar: dark background, logo Partnership, icon + label nav items, user section
- [x] Navbar: search bar, bell dengan notification dot, avatar

**Setelah selesai: jalankan `pnpm dev`, pastikan semua criteria terpenuhi, laporkan hasil ke Planner.**

---

## Catatan untuk Executor

- Jangan install tailwind.config.js — Tailwind v4 pakai `@theme` di CSS (sudah di Step 3)
- `lucide-vue-next` sudah installed — import individual components saja
- Semua asset logo ada di `public/images/` — gunakan path `/images/...`
- Login background: `/images/backgrounds/bg-login-dark.jpg`
- Jangan pakai `style=""` untuk warna jika sudah ada class Tailwind yang tersedia
- `font-display` = Kanit (via `@theme --font-display`), `font-mono` = JetBrains Mono
