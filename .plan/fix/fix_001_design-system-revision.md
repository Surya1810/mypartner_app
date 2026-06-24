# Fix 001 — Design System Revision

**Prerequisite:** `chore_001` harus selesai dulu (Tailwind v4 fix, pnpm, components config)  
**Shell:** PowerShell (Windows)  
**Reference:** `.plan/rules/frontend.md` — baca penuh sebelum mulai

---

## Goal

Perbaiki semua masalah dari eksekusi Plan 02 yang tidak sempurna:

1. Fix 500 error — pagination import API lama
2. Rebuild dashboard yang corrupted
3. Tambah Lucide icons ke sidebar dan stat cards
4. Perbaiki visual fidelity ui-preview agar sesuai design tokens

---

## Prerequisite Check

Sebelum mulai, verifikasi chore_001 sudah selesai:

```powershell
# Cek Tailwind v4 syntax
Select-String "@tailwind base" app/assets/css/globals.css
# Harus KOSONG (tidak ada hasil) — kalau ada, jalankan chore_001 dulu
```

---

## Fix A — Pagination: ganti API lama ke API baru

**Root cause:** `PaginationList` dan `PaginationListItem` tidak ada di shadcn-vue pagination versi ini. Executor menggunakan API dari radix-vue lama.

**Ekspor yang tersedia di `app/components/ui/pagination/index.ts`:**

```
Pagination, PaginationContent, PaginationEllipsis,
PaginationFirst, PaginationItem, PaginationLast,
PaginationNext, PaginationPrevious
```

**Di `app/pages/ui-preview/index.vue`, ganti import pagination:**

```ts
// HAPUS:
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList, // ← tidak ada
  PaginationListItem, // ← tidak ada
  PaginationNext,
  PaginationPrev, // ← salah nama
} from "@/components/ui/pagination";

// GANTI DENGAN:
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
```

**Ganti template Section 10 (Pagination) dengan implementasi yang benar:**

```vue
<Pagination :total="50" :sibling-count="1" show-edges :default-page="2">
  <PaginationContent v-slot="{ items }">
    <PaginationItem>
      <PaginationFirst />
    </PaginationItem>
    <PaginationItem>
      <PaginationPrevious />
    </PaginationItem>
    <template v-for="(item, index) in items" :key="index">
      <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === 2">
        <Button
          class="w-9 h-9 p-0"
          :variant="item.value === 2 ? 'default' : 'outline'"
        >
          {{ item.value }}
        </Button>
      </PaginationItem>
      <PaginationEllipsis v-else :key="item.type" :index="index" />
    </template>
    <PaginationItem>
      <PaginationNext />
    </PaginationItem>
    <PaginationItem>
      <PaginationLast />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

---

## Fix B — Rebuild dashboard/index.vue (file corrupted)

File saat ini hanya 2 baris terpotong. Rebuild penuh dari awal.

Buat `app/pages/dashboard/index.vue`:

```vue
<script setup lang="ts">
import {
  Users,
  TrendingUp,
  AlertTriangle,
  FileText,
  ArrowRight,
  Bell,
  Settings,
} from "lucide-vue-next";

definePageMeta({ layout: "admin" });

const userName = ref("Budi");
const stats = [
  {
    label: "Total Klien",
    value: "147",
    icon: Users,
    iconBg: "var(--color-primary-subtle)",
    iconColor: "var(--color-primary)",
  },
  {
    label: "Prospek Aktif",
    value: "23",
    icon: TrendingUp,
    iconBg: "var(--color-success-bg)",
    iconColor: "var(--color-success)",
  },
  {
    label: "Stok Kritis",
    value: "5",
    icon: AlertTriangle,
    iconBg: "var(--color-warning-bg)",
    iconColor: "var(--color-warning)",
  },
];

const recentActivities = [
  {
    id: 1,
    user: "Budi Santoso",
    action: "Menambahkan klien baru",
    time: "2 menit lalu",
    type: "success",
  },
  {
    id: 2,
    user: "Sari Dewi",
    action: "Upload dokumen kontrak",
    time: "15 menit lalu",
    type: "info",
  },
  {
    id: 3,
    user: "Andi Pratama",
    action: "Mengajukan cuti 3 hari",
    time: "1 jam lalu",
    type: "warning",
  },
];
</script>

<template>
  <div class="space-y-6">
    <!-- Hero card -->
    <div class="rounded-3xl p-8" style="background: var(--color-hero-dark);">
      <p class="text-sm font-medium mb-1" style="color: rgba(255,255,255,0.5);">
        Selamat datang kembali
      </p>
      <h1 class="text-white text-2xl font-bold mb-2">{{ userName }} 👋</h1>
      <p class="text-sm mb-6" style="color: rgba(255,255,255,0.6);">
        Kelola operasional PT Partnership dari satu tempat.
      </p>
      <button
        class="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white"
        style="background: var(--color-primary);"
      >
        Lihat Dashboard
        <ArrowRight class="w-4 h-4" />
      </button>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-xl p-5"
        style="box-shadow: var(--shadow-card);"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center flex-none"
            :style="{ background: stat.iconBg }"
          >
            <component
              :is="stat.icon"
              class="w-5 h-5"
              :style="{ color: stat.iconColor }"
            />
          </div>
          <div>
            <p
              class="text-2xl font-bold"
              style="color: var(--color-text-primary);"
            >
              {{ stat.value }}
            </p>
            <p class="text-sm" style="color: var(--color-text-secondary);">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent activity table -->
    <div
      class="bg-white rounded-xl overflow-hidden"
      style="box-shadow: var(--shadow-card);"
    >
      <div
        class="flex items-center justify-between px-6 py-4 border-b"
        style="border-color: var(--color-border);"
      >
        <h2
          class="font-semibold text-sm"
          style="color: var(--color-text-primary);"
        >
          Aktivitas Terbaru
        </h2>
        <button
          class="text-xs font-medium"
          style="color: var(--color-primary);"
        >
          Lihat semua
        </button>
      </div>
      <div class="divide-y" style="divide-color: var(--color-border);">
        <div
          v-for="activity in recentActivities"
          :key="activity.id"
          class="flex items-center gap-4 px-6 py-4"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-none"
            style="background: var(--color-primary);"
          >
            {{ activity.user.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium truncate"
              style="color: var(--color-text-primary);"
            >
              {{ activity.user }}
            </p>
            <p
              class="text-xs truncate"
              style="color: var(--color-text-secondary);"
            >
              {{ activity.action }}
            </p>
          </div>
          <span
            class="text-xs flex-none"
            style="color: var(--color-text-muted);"
          >
            {{ activity.time }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
```

---

## Fix C — Tambah Lucide icons ke sidebar nav

Di `app/layouts/admin.vue`:

**Step C1 — Import Lucide icons:**

```ts
import {
  Building2,
  LayoutDashboard,
  Users,
  Briefcase,
  ShoppingCart,
  FileText,
  KeyRound,
  CalendarOff,
  Scale,
  Mail,
  PhoneCall,
  Headphones,
  Package,
  Warehouse,
  BarChart3,
  FileBarChart,
  Shield,
  BellRing,
} from "lucide-vue-next";
```

**Step C2 — Update navItems, ganti `icon: 'div'` dengan icon component:**

```ts
const navItems = [
  { type: "label", label: "Master Data" },
  { type: "link", href: "/entities", label: "Legal Entities", icon: Building2 },
  { type: "link", href: "/divisions", label: "Divisi", icon: Briefcase },
  { type: "link", href: "/users", label: "Pengguna & RBAC", icon: Users },
  { type: "link", href: "/clients", label: "Klien", icon: ShoppingCart },
  { type: "link", href: "/suppliers", label: "Supplier", icon: Package },
  { type: "label", label: "Operasional" },
  { type: "link", href: "/documents", label: "Dokumen", icon: FileText },
  { type: "link", href: "/vault", label: "Vault Akun", icon: KeyRound },
  { type: "link", href: "/leave", label: "Cuti & Izin", icon: CalendarOff },
  { type: "link", href: "/regulations", label: "Regulasi", icon: Scale },
  { type: "link", href: "/letters", label: "Surat", icon: Mail },
  { type: "label", label: "Sales" },
  {
    type: "link",
    href: "/presales",
    label: "Pre-Sales / CRM",
    icon: PhoneCall,
  },
  { type: "link", href: "/aftersales", label: "After-Sales", icon: Headphones },
  { type: "label", label: "Produk & Inventaris" },
  { type: "link", href: "/products", label: "Katalog Produk", icon: Package },
  { type: "link", href: "/inventory", label: "Inventaris", icon: Warehouse },
  { type: "label", label: "Intelligence" },
  {
    type: "link",
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  { type: "link", href: "/reports", label: "Laporan", icon: FileBarChart },
  { type: "link", href: "/audit", label: "Audit Trail", icon: Shield },
];
```

**Step C3 — Perbaiki TypeScript type untuk navItems:**

Tambahkan type di atas navItems:

```ts
type NavLabel = { type: 'label'; label: string; href?: never; icon?: never }
type NavLink = { type: 'link'; href: string; label: string; icon: Component }
type NavItem = NavLabel | NavLink

import type { Component } from 'vue'
const navItems: NavItem[] = [ ... ]
```

**Step C4 — Navbar: tambah icon pada search dan bell button:**

Ganti inline SVG di navbar dengan Lucide icons:

```ts
import { Search, Bell, ChevronDown } from "lucide-vue-next";
```

```vue
<!-- Search -->
<div
  class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm w-64"
  style="background: var(--color-surface-input); color: var(--color-text-muted);"
>
  <Search class="w-4 h-4 flex-none" />
  <span>Cari...</span>
</div>

<!-- Bell -->
<button class="relative p-2 rounded-md hover:bg-gray-100">
  <Bell class="w-5 h-5" style="color: var(--color-text-secondary);" />
</button>
```

---

## Fix D — Perbaiki visual globals.css

Pastikan di `app/assets/css/globals.css` sudah ada badge utility classes dan body styles benar.

**Verifikasi bagian ini ada (Section badge utility):**

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

Jika belum ada, tambahkan di akhir file.

---

## Fix E — ui-preview: perbaiki visual fidelity

Isu visual yang terlihat dari screenshot:

- Form inputs tampak putih (harusnya `--color-surface-input` / `#F1F2F5`)
- Section headers tidak cukup prominent
- Beberapa section belum sesuai design tokens

**Step E1 — Wrapping structure ui-preview:**

Pastikan page wrapper menggunakan warna background yang benar:

```vue
<template>
  <div class="min-h-screen p-8" style="background: var(--color-background);">
    <div class="max-w-5xl mx-auto space-y-12">
      <h1 class="text-2xl font-bold" style="color: var(--color-text-primary);">
        MyPartner — UI Preview
      </h1>
      <!-- sections -->
    </div>
  </div>
</template>
```

**Step E2 — Section separator style yang konsisten:**

Setiap section heading:

```vue
<div>
  <div class="flex items-center gap-3 mb-6">
    <span class="text-sm font-semibold uppercase tracking-wider" style="color: var(--color-text-muted);">
      01
    </span>
    <h2 class="text-base font-semibold" style="color: var(--color-text-primary);">Colors & Typography</h2>
    <div class="flex-1 h-px" style="background: var(--color-border-strong);"></div>
  </div>
  <!-- content -->
</div>
```

**Step E3 — Section 1 (Colors): tambah color swatch grid:**

```vue
<div class="grid grid-cols-6 gap-3">
  <div v-for="token in colorTokens" :key="token.name" class="space-y-2">
    <div class="h-12 rounded-lg border" :style="{ background: token.value, borderColor: 'var(--color-border-strong)' }" />
    <p class="text-xs font-medium truncate" style="color: var(--color-text-primary);">{{ token.name }}</p>
    <p class="text-xs font-mono" style="color: var(--color-text-muted);">{{ token.value }}</p>
  </div>
</div>
```

Dengan data:

```ts
const colorTokens = [
  { name: "Primary", value: "#0055FF" },
  { name: "Primary Subtle", value: "#EEF3FF" },
  { name: "Success", value: "#16A34A" },
  { name: "Warning", value: "#D97706" },
  { name: "Error", value: "#DC2626" },
  { name: "Sidebar", value: "#0D1017" },
  { name: "Background", value: "#F7F8FA" },
  { name: "Surface", value: "#FFFFFF" },
  { name: "Input", value: "#F1F2F5" },
  { name: "Hero Dark", value: "#111111" },
  { name: "Text Primary", value: "#0D1017" },
  { name: "Text Muted", value: "#8B919E" },
];
```

**Step E4 — Section 5 (Cards): tambah hero dark card dan stat cards dengan icons:**

```vue
<!-- Hero dark card -->
<div class="rounded-3xl p-8 mb-4" style="background: var(--color-hero-dark);">
  <p class="text-sm mb-1" style="color: rgba(255,255,255,0.5);">Selamat datang kembali</p>
  <h2 class="text-white text-xl font-bold mb-2">Budi Santoso</h2>
  <p class="text-sm mb-5" style="color: rgba(255,255,255,0.6);">Kelola operasional PT Partnership dari satu tempat.</p>
  <Button style="background: var(--color-primary);">Lihat Dashboard</Button>
</div>
```

---

## Completion Criteria

- [x] `http://localhost:3000/ui-preview` loads tanpa 500 error
- [x] Pagination section menampilkan komponen dengan benar
- [x] `http://localhost:3000/dashboard` fully renders (tidak 2-baris truncated)
- [x] Dashboard memiliki: hero card, 3 stat cards dengan Lucide icons, tabel aktivitas
- [x] Sidebar menampilkan Lucide icons di semua nav items
- [x] Badge utility classes tersedia dan rendering correct di ui-preview
- [x] Color swatches tampil di Section 1 ui-preview
- [x] `pnpm dev` tidak ada error atau warning baru

**Setelah selesai, screenshot `/dashboard` dan `/ui-preview` → kirim ke Planner untuk approval.**

---

## Catatan untuk Planner

`public/ui-kit-reference.html` tidak ada di folder `public/` — executor tidak pernah meng-copy file ini. Planner perlu mengkonfirmasi apakah file HTML UI Kit tersedia untuk di-copy ke `public/`, atau visual review dilakukan berdasarkan screenshot saja.
