# Phase 02 — Design System (UI Preview)

**Status:** PENDING  
**Executor:** Gemini CLI (Antigravity)  
**Prerequisite:** Phase 01 complete, `pnpm dev` running  
**Must read first:** `.plan/rules/frontend.md`  
**UI Kit reference:** `http://localhost:3000/ui-kit-reference.html`

---

## Goal

Implement the full MyPartner design system by:

1. Installing and theming all required shadcn-vue components
2. Building the `/admin` layout (sidebar + navbar)
3. Building the `/ui-preview` page that showcases every component

At the end of this phase, opening `http://localhost:3000/ui-preview` should visually match the UI Kit reference.

**APPROVAL GATE:** After this phase, screenshot `/ui-preview` and send to Planner for approval before starting any page development.

---

## Step 1 — Install shadcn-vue components

Run these one by one (shadcn-vue copies the component source into `app/components/ui/`):

```bash
pnpm dlx shadcn-vue@latest add button
pnpm dlx shadcn-vue@latest add input
pnpm dlx shadcn-vue@latest add label
pnpm dlx shadcn-vue@latest add textarea
pnpm dlx shadcn-vue@latest add select
pnpm dlx shadcn-vue@latest add checkbox
pnpm dlx shadcn-vue@latest add radio-group
pnpm dlx shadcn-vue@latest add switch
pnpm dlx shadcn-vue@latest add badge
pnpm dlx shadcn-vue@latest add avatar
pnpm dlx shadcn-vue@latest add card
pnpm dlx shadcn-vue@latest add separator
pnpm dlx shadcn-vue@latest add table
pnpm dlx shadcn-vue@latest add dialog
pnpm dlx shadcn-vue@latest add sheet
pnpm dlx shadcn-vue@latest add drawer
pnpm dlx shadcn-vue@latest add dropdown-menu
pnpm dlx shadcn-vue@latest add context-menu
pnpm dlx shadcn-vue@latest add popover
pnpm dlx shadcn-vue@latest add command
pnpm dlx shadcn-vue@latest add combobox
pnpm dlx shadcn-vue@latest add tooltip
pnpm dlx shadcn-vue@latest add toast
pnpm dlx shadcn-vue@latest add sonner
pnpm dlx shadcn-vue@latest add alert
pnpm dlx shadcn-vue@latest add alert-dialog
pnpm dlx shadcn-vue@latest add skeleton
pnpm dlx shadcn-vue@latest add progress
pnpm dlx shadcn-vue@latest add tabs
pnpm dlx shadcn-vue@latest add scroll-area
pnpm dlx shadcn-vue@latest add pagination
pnpm dlx shadcn-vue@latest add form
pnpm dlx shadcn-vue@latest add calendar
pnpm dlx shadcn-vue@latest add date-picker
pnpm dlx shadcn-vue@latest add breadcrumb
```

After installing, verify all components are in `app/components/ui/`.

---

## Step 2 — Update globals.css with shadcn-vue HSL tokens

Append the shadcn-vue HSL variable block (from `.plan/rules/frontend.md` Section 5) into `globals.css` inside the `@layer base { :root { ... } }` block.

The CSS file structure must be exactly:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ── Our custom tokens (from frontend.md Section 1) ── */
    --color-primary: #0055ff;
    /* ... all custom vars ... */

    /* ── shadcn-vue HSL tokens (from frontend.md Section 5) ── */
    --background: 0 0% 97%;
    --foreground: 220 20% 7%;
    /* ... all HSL vars ... */

    --radius: 0.375rem;
  }

  body {
    @apply bg-background text-foreground;
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
```

---

## Step 3 — Build the Admin Layout

Create `app/layouts/admin.vue`:

```vue
<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

// Placeholder user data (replace with useAuth() in Phase 03)
const userName = ref("Budi Santoso");
const userRole = ref("Manager");
const userInitials = computed(() => {
  return userName.value
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
});

// Navigation items — icons are Heroicons/Lucide (replace with actual icon component)
const navItems = [
  { type: "label", label: "Master Data" },
  { type: "link", href: "/entities", label: "Legal Entities", icon: "div" },
  { type: "link", href: "/divisions", label: "Divisi", icon: "div" },
  { type: "link", href: "/users", label: "Pengguna & RBAC", icon: "div" },
  { type: "link", href: "/clients", label: "Klien", icon: "div" },
  { type: "link", href: "/suppliers", label: "Supplier", icon: "div" },
  { type: "label", label: "Operasional" },
  { type: "link", href: "/documents", label: "Dokumen", icon: "div" },
  { type: "link", href: "/vault", label: "Vault Akun", icon: "div" },
  { type: "link", href: "/leave", label: "Cuti & Izin", icon: "div" },
  { type: "link", href: "/regulations", label: "Regulasi", icon: "div" },
  { type: "link", href: "/letters", label: "Surat", icon: "div" },
  { type: "label", label: "Sales" },
  { type: "link", href: "/presales", label: "Pre-Sales / CRM", icon: "div" },
  { type: "link", href: "/aftersales", label: "After-Sales", icon: "div" },
  { type: "label", label: "Produk & Inventaris" },
  { type: "link", href: "/products", label: "Katalog Produk", icon: "div" },
  { type: "link", href: "/inventory", label: "Inventaris", icon: "div" },
  { type: "label", label: "Intelligence" },
  { type: "link", href: "/dashboard", label: "Dashboard", icon: "div" },
  { type: "link", href: "/reports", label: "Laporan", icon: "div" },
  { type: "link", href: "/audit", label: "Audit Trail", icon: "div" },
];

function isActive(href: string) {
  return route.path === href || route.path.startsWith(`${href}/`);
}
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside
      class="flex-none flex-col fixed inset-y-0 left-0 z-40 flex"
      :style="{ width: 'var(--sidebar-width)' }"
      style="background: var(--color-sidebar-bg);"
    >
      <!-- Logo mark -->
      <div class="flex items-center gap-3 px-5 py-5">
        <div
          class="flex items-center justify-center w-9 h-9 rounded-lg"
          style="background: var(--color-primary);"
        >
          <!-- Replace with actual logo SVG -->
          <span class="text-white font-bold text-sm">MP</span>
        </div>
        <span class="text-white font-semibold text-sm">MyPartner</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <template v-for="item in navItems" :key="item.href">
          <!-- Group label -->
          <p
            v-if="item.type === 'label'"
            class="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider"
            style="color: var(--color-sidebar-icon-muted);"
          >
            {{ item.label }}
          </p>
          <!-- Nav item -->
          <NuxtLink
            v-else
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="isActive(item.href) ? 'text-white' : 'hover:bg-white/5'"
            :style="
              isActive(item.href)
                ? 'background: var(--color-primary); color: white;'
                : 'color: var(--color-sidebar-text-muted);'
            "
          >
            <component :is="item.icon" class="w-4 h-4 flex-none" />
            {{ item.label }}
          </NuxtLink>
        </template>
      </nav>

      <!-- User info at bottom -->
      <div
        class="px-3 py-4 border-t"
        style="border-color: var(--color-sidebar-icon-muted);"
      >
        <div class="flex items-center gap-3 px-2 py-2">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
            style="background: var(--color-primary);"
          >
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">
              {{ userName }}
            </p>
            <p
              class="text-xs truncate"
              style="color: var(--color-sidebar-text-muted);"
            >
              {{ userRole }}
            </p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main area -->
    <div
      class="flex-1 flex flex-col"
      :style="{ marginLeft: 'var(--sidebar-width)' }"
    >
      <!-- Navbar -->
      <header
        class="fixed right-0 z-30 flex items-center justify-between px-6 bg-white border-b"
        :style="{
          left: 'var(--sidebar-width)',
          height: 'var(--navbar-height)',
          borderColor: 'var(--color-border)',
        }"
      >
        <!-- Page title / breadcrumb slot -->
        <div>
          <slot name="navbar-left" />
        </div>

        <!-- Right side: search + actions + avatar -->
        <div class="flex items-center gap-3">
          <!-- Search -->
          <div
            class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm w-64"
            style="background: var(--color-surface-input); color: var(--color-text-muted);"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Cari...</span>
          </div>

          <!-- Notification bell -->
          <button class="relative p-2 rounded-md hover:bg-gray-100">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          <!-- Avatar -->
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
            style="background: var(--color-primary);"
          >
            {{ userInitials }}
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main
        class="flex-1 overflow-y-auto"
        :style="{
          paddingTop: 'var(--navbar-height)',
          background: 'var(--color-background)',
        }"
      >
        <div class="p-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
```

**Note on icons:** Replace all `icon: 'div'` placeholders with lucide-vue-next icons in a follow-up commit. Install: `pnpm add lucide-vue-next`, then import individually in the layout.

---

## Step 4 — Build the UI Preview page

Create `app/pages/ui-preview/index.vue`. This page uses `definePageMeta({ layout: false })` — it has its own minimal wrapper so it doesn't require auth and shows components raw.

The page must include ALL sections below, separated by headings. For each component, show: default state, hover/active state, disabled state, and any variant.

### Sections to implement:

**Section 1 — Colors & Typography**

- Color swatches for all CSS variables (background, primary, semantic)
- Typography scale (Display, H1, H2, Body, Small, Mono)
- All at 1:1 with the CSS variable values

**Section 2 — Buttons**

```vue
<div class="flex flex-wrap gap-3">
  <Button>Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="destructive">Destructive</Button>
  <Button disabled>Disabled</Button>
  <Button size="sm">Small</Button>
  <Button size="lg">Large</Button>
</div>
```

**Section 3 — Form Inputs**

- Input (default, focus, error, disabled)
- Textarea
- Select / Combobox
- Checkbox (unchecked, checked, indeterminate)
- Radio Group
- Switch
- Label + FormField composition

**Section 4 — Badges & Status Chips**

```vue
<!-- Using inline CSS vars for semantic colors -->
<span class="badge-success">
Aktif
</span>

<span class="badge-warning">
Pending
</span>

<span class="badge-error">
Nonaktif
</span>

<span class="badge-info">
Baru
</span>
```

Create these utility classes in globals.css:

```css
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

**Section 5 — Cards**

- Stat card (icon + value + label pattern from UI Kit)
- Standard card (title + content + footer)
- Hero dark card (`background: var(--color-hero-dark)`, white text, primary button)

Stat card structure:

```vue
<div class="bg-white rounded-xl p-6" style="box-shadow: var(--shadow-card);">
  <div class="flex items-center gap-4">
    <div class="w-10 h-10 rounded-lg flex items-center justify-center"
         style="background: var(--color-primary-subtle);">
      <!-- icon -->
    </div>

    <div>
      <p class="text-2xl font-bold" style="color: var(--color-text-primary);">147</p>
      <p class="text-sm" style="color: var(--color-text-secondary);">Total Klien</p>
    </div>
  </div>
</div>
```

**Section 6 — Table**

```vue
<div class="bg-white rounded-xl overflow-hidden" style="box-shadow: var(--shadow-card);">
  <Table>
    <TableHeader>
      <TableRow style="background: var(--color-background);">
        <TableHead>Nama</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Tanggal</TableHead>
        <TableHead>Aksi</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="row in mockRows" :key="row.id">
        <TableCell>{{ row.name }}</TableCell>
        <TableCell><span class="badge-success">Aktif</span></TableCell>
        <TableCell>{{ row.date }}</TableCell>
        <TableCell>
          <div class="flex gap-2">
            <Button size="sm" variant="outline">Edit</Button>
            <Button size="sm" variant="destructive">Hapus</Button>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>
```

**Section 7 — Modals & Sheets**

- Dialog (standard modal with form inside)
- Sheet (slide-in from right — used for detail views/filters)
- AlertDialog (confirm destructive action)

**Section 8 — Toast / Notifications**

```vue
<div class="flex gap-3">
  <Button @click="toast.success('Berhasil disimpan.')">Success Toast</Button>
  <Button @click="toast.error('Terjadi kesalahan.')">Error Toast</Button>
  <Button @click="toast.warning('Periksa kembali data.')">Warning Toast</Button>
  <Button @click="toast.info('Fitur ini dalam pengembangan.')">Info Toast</Button>
</div>
```

Use `sonner` (already installed). Initialize in `app/plugins/01.auth.client.ts` → actually, add `<Toaster />` to `app.vue`.

**Section 9 — Tabs**

```vue
<Tabs default-value="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab Pertama</TabsTrigger>
    <TabsTrigger value="tab2">Tab Kedua</TabsTrigger>
    <TabsTrigger value="tab3" disabled>Disabled</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Konten tab pertama.</TabsContent>
  <TabsContent value="tab2">Konten tab kedua.</TabsContent>
</Tabs>
```

**Section 10 — Pagination**
Show the pagination component with total 5 pages, current page 2.

**Section 11 — Skeleton Loaders**
Show skeleton versions of: stat card, table row, and detail card.

**Section 12 — Admin Layout Preview**
A preview of the full admin layout (sidebar + navbar + content area) using the colors from the UI Kit.

---

## Step 5 — Update app.vue

```vue
<!-- app/app.vue -->
<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster position="bottom-right" rich-colors />
  </div>
</template>
```

---

## Step 6 — Dashboard placeholder page

Create `app/pages/dashboard/index.vue` using the `admin` layout. It should show:

- Hero dark card (with placeholder text + primary button)
- 3 stat cards in a row
- Empty table with headers

This validates that the admin layout works end-to-end before we build real module pages.

```vue
<script setup lang="ts">
definePageMeta({ layout: "admin" });

const userName = ref("Budi");
const stats = [
  { label: "Total Klien", value: "147", iconBg: "var(--color-primary-subtle)" },
  { label: "Prospek Aktif", value: "23", iconBg: "var(--color-success-bg)" },
  { label: "Stok Kritis", value: "5", iconBg: "var(--color-warning-bg)" },
];
</script>

<template>
  <div class="space-y-6">
    <!-- Hero card -->
    <div class="rounded-3xl p-8" style="background: var(--color-hero-dark);">
      <h1 class="text-white text-2xl font-bold mb-2">
        Selamat datang, {{ userName }}
      </h1>
      <p class="text-white/60 text-sm mb-6">
        Kelola operasional PT Partnership dari satu tempat.
      </p>
      <Button style="background: var(--color-primary);">
        Lihat Dashboard
      </Button>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-xl p-6"
        style="box-shadow: var(--shadow-card);"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-10 rounded-lg"
            :style="{ background: stat.iconBg }"
          />
          <div>
            <p class="text-2xl font-bold">
              {{ stat.value }}
            </p>
            <p class="text-sm" style="color: var(--color-text-secondary);">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Placeholder table -->
    <div
      class="bg-white rounded-xl overflow-hidden"
      style="box-shadow: var(--shadow-card);"
    >
      <div
        class="px-6 py-4 border-b"
        style="border-color: var(--color-border);"
      >
        <h2 class="font-semibold">Aktivitas Terbaru</h2>
      </div>
      <div class="p-8 text-center" style="color: var(--color-text-muted);">
        Data akan tersedia setelah backend terhubung.
      </div>
    </div>
  </div>
</template>
```

---

## Step 7 — Login page placeholder

Create `app/pages/login.vue` using `layout: false`:

```vue
<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

definePageMeta({ layout: false });
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center"
    style="background: var(--color-background);"
  >
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="flex items-center gap-3 justify-center mb-8">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center"
          style="background: var(--color-primary);"
        >
          <span class="text-white font-bold">MP</span>
        </div>
        <span class="text-xl font-semibold">MyPartner</span>
      </div>

      <!-- Form card -->
      <div
        class="bg-white rounded-2xl p-8"
        style="box-shadow: var(--shadow-modal);"
      >
        <h1 class="text-xl font-semibold mb-6">Masuk ke akun Anda</h1>

        <form class="space-y-4">
          <div>
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="anda@partnership.co.id"
              class="mt-1"
            />
          </div>
          <div>
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              class="mt-1"
            />
          </div>
          <Button class="w-full" style="background: var(--color-primary);">
            Masuk
          </Button>
        </form>
      </div>

      <p
        class="text-center text-xs mt-6"
        style="color: var(--color-text-muted);"
      >
        MyPartner v1.0 — PT Partnership Procurement Solution
      </p>
    </div>
  </div>
</template>
```

---

## Completion Criteria

- [ ] All shadcn-vue components installed in `app/components/ui/`
- [ ] `globals.css` has both custom CSS vars AND shadcn HSL vars
- [ ] `app/layouts/admin.vue` renders correctly (sidebar dark, navbar white, content gray)
- [ ] `http://localhost:3000/ui-preview` shows ALL 12 sections
- [ ] `http://localhost:3000/dashboard` renders with admin layout
- [ ] `http://localhost:3000/login` renders without layout
- [ ] No TypeScript errors (`pnpm typecheck`)
- [ ] No ESLint errors (`pnpm lint`)

**Approval step:**

1. Run `pnpm dev`
2. Open `/ui-preview` + `/ui-kit-reference.html` side by side
3. Screenshot both → send to Planner for visual approval
4. Do NOT start Phase 03 (module pages) until approved

**Update `.plan/PROGRESS.md` when complete.**
