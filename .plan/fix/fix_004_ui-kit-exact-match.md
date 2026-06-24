# Fix 004 — UI Kit Exact Match

**Depends on:** `fix_003` selesai  
**Shell:** PowerShell (Windows)  
**Ground truth:** `http://localhost:3000/ui-kit-reference.html` — wajib buka saat eksekusi  
**Rules:** `.plan/rules/frontend.md` — baca penuh

---

## Goal

Implementasi ulang seluruh admin shell (sidebar, navbar, profile) dan halaman
`ui-preview/index.vue` agar pixel-accurate dengan UI Kit.
Plan ini menyertakan kode referensi langsung dari UI Kit HTML — executor tidak
perlu menerka styling, cukup terapkan apa yang tertulis.

---

## Acceptance Criteria

### Admin Layout

- [ ] Sidebar logo area: font Montserrat `text-[15px] font-bold`, sub-label `text-[10px] uppercase tracking-[.14em] text-brand-500 font-semibold`
- [ ] Sidebar nav item active: `bg-brand-500 text-white shadow-brand`, inactive light: `text-neutral-600 hover:bg-neutral-100`, inactive dark: `text-neutral-400 hover:bg-white/5`
- [ ] Sidebar tidak scroll; tidak ada `overflow-y: auto` pada nav container
- [ ] Sidebar collapse: bug ukuran active button di layar kecil diperbaiki; collapse button posisi dan style benar
- [ ] Profile dipindah ke bawah sidebar (bukan kanan atas), ada tombol logout icon
- [ ] Logo area bisa diklik → navigasi ke `/settings`
- [ ] Navbar: `sticky top-0 z-20 h-16 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b`
- [ ] Navbar breadcrumb: format `Parent · Current`, style sesuai UI Kit
- [ ] Menu: nama dan urutan sesuai spesifikasi Section B
- [ ] "Peraturan Perusahaan" TIDAK ada di sidebar — dipindah ke hero card dashboard
- [ ] Focus ring keyboard (Tab): semua nav item sidebar pakai `focus-visible:ring-2 focus-visible:ring-brand-500` (biru, bukan hitam)
- [ ] Badge notifikasi di sidebar: angka dummy merah (danger) di kanan item "Notifikasi"
- [ ] Hover card dan style table sama dengan UI Kit (shadow-lift on hover, bg-neutral-50 row hover)
- [ ] "Vendor" menggantikan "Supplier", "Cuti & Izin" bukan "Pengajuan Cuti"
- [ ] Generator Surat dan Generator Katalog **dihapus** dari sidebar
- [ ] Stock Opname ditambah sebagai on-hold item (Produk & Inventaris)

### UI Preview

- [ ] Halaman punya margin horizontal: `px-5 sm:px-8`
- [ ] Section spacing: `space-y-16`
- [ ] Section header: Kanit `text-2xl font-bold` + subtitle `text-sm text-neutral-500`
- [ ] Semua 10 section merender dengan benar: overview, typography, colors, buttons, forms, combobox, alerts, cards, table, overlays
- [ ] Toast muncul `fixed bottom-5 right-5 z-50 w-80`, auto-dismiss 4500ms
- [ ] Semua komponen pixel-accurate vs UI Kit

---

## A — Admin Layout Fixes

### A1 — Sidebar Logo Area (exact dari UI Kit)

```html
<!-- Logo area header -->
<div
  :class="['flex items-center gap-2.5 px-5 h-16 border-b flex-shrink-0',
  isDark ? 'border-white/10' : 'border-neutral-200']"
>
  <!-- Klik area → /settings -->
  <NuxtLink to="/settings" class="flex items-center gap-2.5 min-w-0">
    <div
      class="grid place-items-center w-9 h-9 rounded-lg bg-brand-500 shadow-brand flex-shrink-0"
    >
      <!-- Logo SVG Partnership mark -->
      <img
        src="/images/logo-pps-symbol.png"
        class="w-5 h-5 object-contain"
        alt="PPS"
      />
    </div>
    <div v-if="!isCollapsed" class="leading-tight min-w-0">
      <div
        :class="['font-bold tracking-tight text-[15px] truncate', isDark ? 'text-white' : 'text-ink']"
        style="font-family:'Montserrat',sans-serif"
      >
        MyPartner
      </div>
      <div
        class="text-[10px] uppercase tracking-[.14em] text-brand-500 font-semibold"
      >
        V2.0
      </div>
    </div>
  </NuxtLink>
</div>
```

### A2 — Sidebar Nav Items (exact pattern dari UI Kit)

```html
<!-- Nav item: active state -->
class="group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium
transition-colors bg-brand-500 text-white shadow-brand"

<!-- Nav item: inactive light -->
class="group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium
transition-colors text-neutral-600 hover:bg-neutral-100 hover:text-ink"

<!-- Nav item: inactive dark -->
class="group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium
transition-colors text-neutral-400 hover:bg-white/5 hover:text-white"

<!-- Icon size -->
class="w-[18px] h-[18px] flex-shrink-0"

<!-- Badge on item (active) -->
class="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/20
text-white"
<!-- Badge on item (inactive light) -->
class="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-50
text-brand-600"
<!-- Badge on item (inactive dark) -->
class="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-500/15
text-brand-300"
```

Sidebar `<nav>` TIDAK boleh `overflow-y-auto`. Gunakan `flex-1` tanpa overflow — konten harus fit.

### A3 — Sidebar Profile Footer (pindah dari kanan atas)

Profile avatar di kanan atas **dihapus**. Profile dipindah ke footer sidebar:

```html
<!-- Sidebar footer -->
<div
  :class="['px-3 py-4 border-t flex-shrink-0', isDark ? 'border-white/10' : 'border-neutral-200']"
  style="box-shadow: 0 -1px 0 0 rgba(0,0,0,.06)"
>
  <div
    :class="['flex items-center gap-3 px-2 py-2 rounded-md transition-colors cursor-pointer',
    isDark ? 'hover:bg-white/5' : 'hover:bg-neutral-100']"
  >
    <!-- Avatar -->
    <div
      :class="['grid place-items-center w-9 h-9 rounded-full font-bold text-sm flex-shrink-0',
      isDark ? 'bg-brand-500/20 text-brand-300' : 'bg-brand-50 text-brand-600']"
    >
      {{ userInitials }}
    </div>
    <div v-if="!isCollapsed" class="leading-tight min-w-0 flex-1">
      <div
        :class="['text-sm font-semibold truncate', isDark ? 'text-white' : 'text-ink']"
      >
        {{ userName }}
      </div>
      <div
        :class="['text-xs truncate', isDark ? 'text-neutral-400' : 'text-neutral-500']"
      >
        {{ userRole }}
      </div>
    </div>
    <!-- Logout icon -->
    <button
      v-if="!isCollapsed"
      @click="logout"
      class="text-neutral-400 hover:text-danger-500 transition-colors ml-auto"
    >
      <LogOut class="w-4 h-4" />
    </button>
  </div>
</div>
```

### A4 — Sidebar Collapse Bug Fix

Saat sidebar collapsed (`w-16`), nav item harus tetap `rounded-md`, icon center, tidak ada label.
Masalah: active pill melebar karena flex gap. Fix:

```html
<!-- Item saat collapsed -->
<button
  :class="['flex items-center justify-center w-10 h-10 rounded-md mx-auto transition-colors',
  isActive ? 'bg-brand-500 text-white shadow-brand' : 'text-neutral-400 hover:bg-white/5']"
>
  <component :is="item.icon" class="w-[18px] h-[18px] flex-shrink-0" />
</button>
```

Saat collapsed: sidebar width `w-16` (64px), semua label `v-show="!isCollapsed"`.

### A5 — Navbar (exact dari UI Kit)

```html
<header
  class="sticky top-0 z-20 h-16 bg-white/95 dark:bg-neutral-900/95
  backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800
  flex items-center gap-3 px-5 sm:px-8 transition-colors"
>
  <!-- Breadcrumb kiri -->
  <div
    class="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 font-medium"
  >
    <span>{{ breadcrumbParent }}</span>
    <ChevronRight class="w-4 h-4 text-neutral-300 dark:text-neutral-600" />
    <span class="text-ink dark:text-neutral-100 font-semibold"
      >{{ breadcrumbCurrent }}</span
    >
  </div>

  <!-- Search bar -->
  <div class="relative ml-auto max-w-xs w-full hidden md:block">
    <search
      class="w-[18px] h-[18px] absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
    />
    <input
      type="text"
      placeholder="Cari modul, klien, dokumen…"
      class="w-full h-10 pl-10 pr-3 rounded-md bg-neutral-100 dark:bg-neutral-800
        border border-transparent dark:border-neutral-700 text-sm text-ink dark:text-neutral-200
        placeholder:text-neutral-400 dark:placeholder:text-neutral-500
        focus:bg-white dark:focus:bg-neutral-700 focus:border-brand-500
        focus:ring-4 focus:ring-brand-500/15 outline-none transition"
    />
  </div>

  <!-- Notification button -->
  <button
    class="relative grid place-items-center w-10 h-10 rounded-md
    hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
  >
    <Bell class="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
    <span
      class="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-white dark:ring-neutral-900"
    ></span>
  </button>

  <!-- Theme toggle -->
  <button
    @click="toggleTheme"
    class="grid place-items-center w-10 h-10 rounded-md
      hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
  >
    <Sun v-if="isDark" class="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
    <Moon v-else class="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
  </button>

  <!-- Language switcher -->
  <button
    @click="toggleLocale"
    class="h-8 px-2.5 rounded-md border border-neutral-200 dark:border-neutral-700
      text-xs font-semibold text-neutral-600 dark:text-neutral-400
      hover:border-brand-500 hover:text-brand-600 transition-colors flex-shrink-0"
  >
    {{ locale === 'id' ? 'ID' : 'EN' }}
  </button>
</header>
```

**Catatan:** Avatar / profile sudah dipindah ke sidebar footer (A3) — tidak ada di navbar.

---

## B — Menu Sidebar Final

Menu yang **dihapus**: Generator Surat, Generator Katalog (fitur masuk ke dalam Dokumen dan Katalog).
Menu yang **diubah namanya**: Supplier → Vendor, Pengajuan Cuti → Cuti & Izin, Brankas Akun → Akun.

```
[Tanpa label — Intelligence]
  Dashboard          → /dashboard         icon: LayoutDashboard
  Laporan            → /reports           icon: BarChart2
  Audit Log          → /audit-log         icon: ClipboardList
  Notifikasi         → /notifications     icon: Bell           badge: "3" (danger bg)

[Operasional]
  Keuangan             → disabled         icon: Wallet         badge:"Segera"
    Sub: Pemasukan     → /finance/income  icon: TrendingUp
    Sub: Pengeluaran   → /finance/expense icon: TrendingDown
    Sub: Lap.Keuangan  → /finance/report  icon: FileSpreadsheet
  Dokumen              → /documents       icon: FolderOpen
  Tugas                → disabled         icon: CheckSquare    badge:"Segera"
  Cuti & Izin          → /leave           icon: CalendarOff

[Sales]
  Pre-Sales / CRM    → /presales          icon: Target
  After-Sales        → /aftersales        icon: HeartHandshake
  Project            → disabled           icon: Briefcase      badge:"Segera"
  Transaksi          → disabled           icon: ArrowLeftRight badge:"Segera"

[Produk & Inventaris]
  Katalog Produk     → /products          icon: Package
  Inventaris & Stok  → /inventory         icon: Warehouse
  Stock Opname       → disabled           icon: ClipboardCheck badge:"Segera"

[Master Data]
  Entitas            → /entity            icon: Building2
  Divisi             → /division          icon: Network
  Pengguna           → /users             icon: Users
  Klien              → /clients           icon: UserCheck
  Vendor             → /suppliers         icon: Truck
  Akun               → /vault             icon: KeyRound
```

**On-hold rules:**

- `pointer-events-none opacity-50` — tidak bisa diklik
- Badge "Segera": `text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-50 text-brand-600`
- Tidak ada hover state

**Keuangan sub-menu accordion:**

- ChevronDown icon di kanan item parent, rotate-180 saat expand
- State: `isKeuanganOpen = ref(false)`
- Sub-items: `pl-8 text-xs` dengan v-show + transition `max-height 200ms ease`
- Keuangan juga on-hold: parent disabled, sub-items tetap rendered tapi tidak bisa diklik

---

## C — UI Preview Rebuild (Pixel-accurate)

File: `app/pages/ui-preview/index.vue`

### C0 — Layout wrapper

```html
<template>
  <div class="px-5 sm:px-8 py-8 max-w-[1100px] mx-auto space-y-16">
    <!-- 10 sections -->
  </div>
</template>
```

`definePageMeta({ layout: 'admin' })`

### C0.1 — Section header template (reusable inline component)

Setiap section dimulai dengan section header:

```html
<div class="mb-5">
  <h2
    class="text-2xl font-bold tracking-tight text-ink dark:text-neutral-100"
    style="font-family:'Kanit',sans-serif"
  >
    {{ title }}
  </h2>
  <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
    {{ subtitle }}
  </p>
</div>
```

---

### C1 — Section: Overview (Hero Card)

```html
<section id="overview">
  <SectionHeader title="Overview" subtitle="Fondasi desain sistem MyPartner" />
  <div
    class="relative overflow-hidden rounded-2xl text-white p-8 sm:p-12 shadow-xl"
    style="background-color:#111111;"
  >
    <!-- Stripe overlay -->
    <div
      class="absolute inset-0 opacity-[0.06]"
      style="background-image:repeating-linear-gradient(115deg,#fff 0 14px,transparent 14px 40px);"
    ></div>
    <div class="relative">
      <!-- Badge -->
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10
                  text-brand-300 text-xs font-semibold tracking-wide mb-5"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
        DESIGN SYSTEM · v2.0
      </div>
      <!-- Title: Kanit, text-4xl sm:text-5xl, font-bold -->
      <h1
        class="text-4xl sm:text-5xl font-bold text-white max-w-2xl leading-[1.1]"
        style="font-family:'Kanit',sans-serif;"
      >
        MyPartner · V2.0
      </h1>
      <!-- Subtitle: text-neutral-300, text-lg, font-normal -->
      <p class="mt-4 text-neutral-300 text-lg max-w-xl font-normal">
        Setiap komponen untuk platform operasional Partnership — typography,
        warna, form, data, dan overlay, dibangun di atas satu fondasi yang
        elegan dan modern.
      </p>
      <!-- Buttons -->
      <div class="mt-7 flex flex-wrap gap-3">
        <button
          class="h-11 px-5 rounded-md bg-brand-500 hover:bg-brand-600 text-white
                       font-semibold text-sm shadow-brand transition-colors flex items-center gap-2"
        >
          <Rocket class="w-4 h-4" /> Mulai Eksplorasi
        </button>
        <button
          class="h-11 px-5 rounded-md bg-white/10 hover:bg-white/15 text-white
                       font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <BookOpen class="w-4 h-4" /> Panduan
        </button>
      </div>
    </div>
  </div>
</section>
```

---

### C2 — Section: Typography

```html
<section id="typography">
  <SectionHeader
    title="Typography"
    subtitle="Montserrat UI · Kanit display · JetBrains Mono"
  />
  <div class="grid gap-5 lg:grid-cols-3">
    <!-- Headings card (2/3 width) -->
    <div
      class="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-lg border
                border-neutral-200 dark:border-neutral-700 shadow-soft dark:shadow-card-dark p-7 space-y-4"
    >
      <div class="flex items-baseline gap-3">
        <span class="w-12 text-xs text-neutral-400 font-mono shrink-0">H1</span>
        <h1
          class="text-4xl font-bold text-ink dark:text-neutral-100 tracking-tight"
          style="font-family:'Kanit',sans-serif;"
        >
          Kelola dengan percaya diri
        </h1>
      </div>
      <div class="flex items-baseline gap-3">
        <span class="w-12 text-xs text-neutral-400 font-mono shrink-0">H2</span>
        <h2
          class="text-3xl font-semibold text-ink dark:text-neutral-100 tracking-tight"
          style="font-family:'Kanit',sans-serif;"
        >
          Manajemen Vendor
        </h2>
      </div>
      <div class="flex items-baseline gap-3">
        <span class="w-12 text-xs text-neutral-400 font-mono shrink-0">H3</span>
        <h3
          class="text-2xl font-semibold text-ink dark:text-neutral-100"
          style="font-family:'Kanit',sans-serif;"
        >
          Permintaan Pembelian
        </h3>
      </div>
      <div class="flex items-baseline gap-3">
        <span class="w-12 text-xs text-neutral-400 font-mono shrink-0">H4</span>
        <h4 class="text-xl font-bold text-ink dark:text-neutral-100">
          Alur Persetujuan
        </h4>
      </div>
      <div class="flex items-baseline gap-3">
        <span class="w-12 text-xs text-neutral-400 font-mono shrink-0">H5</span>
        <h5 class="text-[17px] font-bold text-ink dark:text-neutral-100">
          Kategori Pengeluaran
        </h5>
      </div>
      <div class="flex items-baseline gap-3">
        <span class="w-12 text-xs text-neutral-400 font-mono shrink-0">H6</span>
        <h6 class="text-[15px] font-semibold text-ink dark:text-neutral-100">
          Detail Baris Item
        </h6>
      </div>
    </div>

    <!-- Body/Mono card (1/3 width) -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200
                dark:border-neutral-700 shadow-soft p-7 space-y-4"
    >
      <p
        class="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed"
      >
        Body — Pusatkan permintaan, otomatisasi persetujuan, dan kelola semua
        hubungan vendor dalam satu ruang kerja terpercaya.
      </p>
      <p class="text-sm text-neutral-500 dark:text-neutral-400">
        Muted small — Terakhir disinkronkan 4 menit lalu.
      </p>
      <p class="text-base text-neutral-700 dark:text-neutral-300">
        Sebuah
        <a
          href="#"
          class="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
          >tautan teks</a
        >
        memandu pengguna, dan
        <strong class="text-ink dark:text-neutral-100 font-bold">tebal</strong>
        menarik perhatian.
      </p>
      <p
        class="font-mono text-sm text-neutral-600 dark:text-neutral-300
                bg-neutral-100 dark:bg-neutral-750 rounded px-3 py-2"
      >
        PO-2026-04817 · Rp 48.200.000
      </p>
    </div>
  </div>
</section>
```

---

### C3 — Section: Colors

```html
<section id="colors">
  <SectionHeader
    title="Warna & Branding"
    subtitle="Skala warna dari logo Partnership — primary, neutral & status"
  />
  <div class="space-y-5">
    <!-- Brand scale -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft p-6"
    >
      <div
        class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-4"
      >
        Primary — Brand Blue
      </div>
      <div class="grid grid-cols-5 sm:grid-cols-10 gap-2">
        <!-- Render 10 brand swatches: 50,100,200,300,400,500,600,700,800,900 -->
        <div v-for="(color, key) in brandScale" :key="key">
          <div
            class="h-14 rounded-md shadow-xs"
            :style="{ background: color }"
          ></div>
          <div class="mt-1.5 text-[10px] font-mono text-neutral-500">
            {{ key }}
          </div>
        </div>
      </div>
    </div>

    <!-- Neutral + Status row -->
    <div class="grid gap-5 md:grid-cols-2">
      <!-- Neutral scale -->
      <div
        class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft p-6"
      >
        <div
          class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-4"
        >
          Neutral / Ink
        </div>
        <div class="grid grid-cols-6 gap-2">
          <div v-for="(color, key) in neutralScale" :key="key">
            <div
              class="h-12 rounded-md shadow-xs border border-neutral-100 dark:border-neutral-700"
              :style="{ background: color }"
            ></div>
            <div class="mt-1.5 text-[10px] font-mono text-neutral-500">
              {{ key }}
            </div>
          </div>
        </div>
      </div>
      <!-- Status scale -->
      <div
        class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft p-6"
      >
        <div
          class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-4"
        >
          Status
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div v-for="(item, key) in statusColors" :key="key">
            <div
              class="h-12 rounded-md shadow-xs"
              :style="{ background: item.color }"
            ></div>
            <div
              class="mt-1.5 text-[11px] font-semibold capitalize text-ink dark:text-neutral-200"
            >
              {{ item.label }}
            </div>
            <div class="text-[10px] font-mono text-neutral-400">
              {{ item.color }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

Data ref:

```ts
const brandScale = {
  "50": "#EEF3FF",
  "100": "#D9E4FF",
  "200": "#B3C9FF",
  "300": "#80A4FF",
  "400": "#4D7EFF",
  "500": "#0055FF",
  "600": "#0047D6",
  "700": "#0039AD",
  "800": "#002C85",
  "900": "#001F5C",
};
const neutralScale = {
  "0": "#FFFFFF",
  "50": "#F7F8FA",
  "100": "#F1F2F5",
  "200": "#E5E7EC",
  "300": "#D3D7DF",
  "400": "#9AA0AD",
  "500": "#6B7280",
  "600": "#4B5260",
  "700": "#353B47",
  "950": "#0D1017",
};
const statusColors = {
  success: { label: "Sukses", color: "#15A05A" },
  warning: { label: "Peringatan", color: "#E8920C" },
  danger: { label: "Bahaya", color: "#E11900" },
};
```

---

### C4 — Section: Buttons (exact dari UI Kit)

```html
<section id="buttons">
  <SectionHeader
    title="Tombol"
    subtitle="Solid · Outline · Ghost · Danger — semua state"
  />
  <div
    class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200
              dark:border-neutral-700 shadow-soft p-7 space-y-7"
  >
    <!-- Variants row -->
    <div>
      <div
        class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-3"
      >
        Varian
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <!-- Solid -->
        <button
          class="h-10 px-4 rounded-md bg-brand-500 hover:bg-brand-600 active:bg-brand-700
                       text-white text-sm font-semibold shadow-brand transition-colors flex items-center gap-2"
        >
          <Plus class="w-4 h-4" /> Solid
        </button>
        <!-- Outline -->
        <button
          class="h-10 px-4 rounded-md bg-white dark:bg-neutral-700 border border-neutral-300
                       dark:border-neutral-600 hover:border-brand-500 hover:text-brand-600
                       dark:hover:border-brand-400 dark:hover:text-brand-400 text-ink dark:text-neutral-200
                       text-sm font-semibold shadow-xs transition-colors"
        >
          Outline
        </button>
        <!-- Ghost -->
        <button
          class="h-10 px-4 rounded-md text-brand-600 dark:text-brand-400
                       hover:bg-brand-50 dark:hover:bg-brand-900/30 text-sm font-semibold transition-colors"
        >
          Ghost
        </button>
        <!-- Danger -->
        <button
          class="h-10 px-4 rounded-md bg-danger-500 hover:bg-danger-600 text-white
                       text-sm font-semibold shadow-xs transition-colors flex items-center gap-2"
        >
          <Trash2 class="w-4 h-4" /> Danger
        </button>
        <!-- Secondary -->
        <button
          class="h-10 px-4 rounded-md bg-ink dark:bg-neutral-700 hover:bg-neutral-900
                       dark:hover:bg-neutral-600 text-white text-sm font-semibold shadow-xs transition-colors"
        >
          Secondary
        </button>
      </div>
    </div>

    <!-- States & sizes row -->
    <div>
      <div
        class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-3"
      >
        Ukuran & State
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <!-- Small -->
        <button
          class="h-8 px-3 rounded-md bg-brand-500 text-white text-xs font-semibold shadow-brand"
        >
          Kecil
        </button>
        <!-- Medium -->
        <button
          class="h-10 px-4 rounded-md bg-brand-500 text-white text-sm font-semibold shadow-brand"
        >
          Sedang
        </button>
        <!-- Large -->
        <button
          class="h-12 px-6 rounded-md bg-brand-500 text-white text-base font-semibold shadow-brand"
        >
          Besar
        </button>
        <!-- Disabled -->
        <button
          disabled
          class="h-10 px-4 rounded-md bg-neutral-200 dark:bg-neutral-700
                                text-neutral-400 dark:text-neutral-500 text-sm font-semibold cursor-not-allowed"
        >
          Nonaktif
        </button>
        <!-- Loading -->
        <button
          :disabled="isLoading"
          @click="simulateLoad"
          class="h-10 px-4 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-sm
                       font-semibold shadow-brand transition-colors flex items-center gap-2 disabled:opacity-80"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          {{ isLoading ? 'Memproses…' : 'Loading state' }}
        </button>
        <!-- Icon only -->
        <button
          class="grid place-items-center w-10 h-10 rounded-md bg-white dark:bg-neutral-700
                       border border-neutral-300 dark:border-neutral-600 hover:border-brand-500
                       hover:text-brand-600 dark:hover:border-brand-400 text-ink dark:text-neutral-300 transition-colors"
        >
          <Download class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</section>
```

---

### C5 — Section: Forms (exact dari UI Kit)

```html
<section id="forms">
  <SectionHeader
    title="Elemen Form"
    subtitle="Input, select, checkbox, radio & toggle"
  />
  <div class="grid gap-5 lg:grid-cols-2">
    <!-- Left: Input, Select, Textarea, Error -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200
                dark:border-neutral-700 shadow-soft p-7 space-y-5"
    >
      <!-- Input -->
      <div>
        <label
          class="block text-sm font-semibold text-ink dark:text-neutral-200 mb-1.5"
          >Nama Vendor</label
        >
        <input
          type="text"
          placeholder="cth. PT Sumber Makmur"
          class="w-full h-11 px-3.5 rounded-md bg-white dark:bg-neutral-750 border border-neutral-300
                 dark:border-neutral-600 text-sm text-ink dark:text-neutral-200
                 placeholder:text-neutral-400 dark:placeholder:text-neutral-500
                 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 outline-none transition"
        />
      </div>

      <!-- Select native (dengan custom chevron) -->
      <div>
        <label
          class="block text-sm font-semibold text-ink dark:text-neutral-200 mb-1.5"
          >Kategori</label
        >
        <div class="relative">
          <select
            class="w-full h-11 pl-3.5 pr-10 rounded-md bg-white dark:bg-neutral-750
                         border border-neutral-300 dark:border-neutral-600 text-sm text-ink dark:text-neutral-200
                         appearance-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15
                         outline-none transition cursor-pointer"
          >
            <option>IT & Software</option>
            <option>Logistik</option>
            <option>Bahan Baku</option>
            <option>Fasilitas</option>
          </select>
          <ChevronDown
            class="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
          />
        </div>
        <p class="mt-1.5 text-xs text-neutral-400 dark:text-neutral-500">
          Native select — background mengikuti tema.
        </p>
      </div>

      <!-- Textarea -->
      <div>
        <label
          class="block text-sm font-semibold text-ink dark:text-neutral-200 mb-1.5"
        >
          Catatan <span class="text-neutral-400 font-normal">(opsional)</span>
        </label>
        <textarea
          rows="3"
          placeholder="Tambahkan konteks untuk approver…"
          class="w-full px-3.5 py-2.5 rounded-md bg-white dark:bg-neutral-750 border border-neutral-300
                 dark:border-neutral-600 text-sm text-ink dark:text-neutral-200
                 placeholder:text-neutral-400 dark:placeholder:text-neutral-500
                 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 outline-none transition resize-none"
        >
        </textarea>
      </div>

      <!-- Error state -->
      <div>
        <label
          class="block text-sm font-semibold text-ink dark:text-neutral-200 mb-1.5"
          >State Error</label
        >
        <input
          value="email@tidak-valid"
          class="w-full h-11 px-3.5 rounded-md bg-danger-50 dark:bg-danger-900/20 border border-danger-500
                 text-sm text-danger-700 dark:text-danger-400
                 focus:ring-4 focus:ring-danger-500/15 outline-none transition"
        />
        <p
          class="mt-1.5 text-xs text-danger-600 dark:text-danger-400 flex items-center gap-1"
        >
          <AlertCircle class="w-3.5 h-3.5" /> Masukkan alamat email yang valid.
        </p>
      </div>
    </div>

    <!-- Right: Checkbox, Radio, Toggle -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200
                dark:border-neutral-700 shadow-soft p-7 space-y-6"
    >
      <!-- Checkboxes -->
      <div>
        <div
          class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-3"
        >
          Checkbox
        </div>
        <div class="space-y-2.5">
          <label
            v-for="opt in checkboxOpts"
            :key="opt.label"
            class="flex items-center gap-3 cursor-pointer"
          >
            <span class="relative w-5 h-5 rounded flex-shrink-0">
              <input
                type="checkbox"
                :checked="opt.checked"
                class="peer sr-only"
              />
              <span
                class="absolute inset-0 rounded border-2 border-neutral-300 dark:border-neutral-600
                           peer-checked:bg-brand-500 peer-checked:border-brand-500 transition-colors"
              ></span>
              <Check
                class="absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100"
              />
            </span>
            <span class="text-sm text-neutral-700 dark:text-neutral-300"
              >{{ opt.label }}</span
            >
          </label>
        </div>
      </div>

      <!-- Radio buttons -->
      <div>
        <div
          class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-3"
        >
          Radio
        </div>
        <div class="space-y-2.5">
          <label
            v-for="opt in radioOpts"
            :key="opt"
            class="flex items-center gap-3 cursor-pointer"
          >
            <span class="relative w-5 h-5 rounded-full flex-shrink-0">
              <input
                type="radio"
                name="demo"
                :value="opt"
                v-model="radioSelected"
                class="peer sr-only"
              />
              <span
                class="absolute inset-0 rounded-full border-2 border-neutral-300 dark:border-neutral-600
                           peer-checked:border-brand-500 transition-colors"
              ></span>
              <span
                class="absolute inset-[4px] rounded-full bg-brand-500 opacity-0 peer-checked:opacity-100 transition-opacity"
              ></span>
            </span>
            <span class="text-sm text-neutral-700 dark:text-neutral-300"
              >{{ opt }}</span
            >
          </label>
        </div>
      </div>

      <!-- Toggle switches -->
      <div>
        <div
          class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-3"
        >
          Toggle
        </div>
        <div class="space-y-3">
          <label
            v-for="tog in toggleOpts"
            :key="tog.label"
            class="flex items-center justify-between cursor-pointer"
          >
            <span class="text-sm text-neutral-700 dark:text-neutral-300"
              >{{ tog.label }}</span
            >
            <button
              @click="tog.on = !tog.on"
              role="switch"
              :aria-checked="tog.on"
              class="relative w-10 h-6 rounded-full transition-colors flex-shrink-0"
              :class="tog.on ? 'bg-brand-500' : 'bg-neutral-300 dark:bg-neutral-600'"
            >
              <span
                class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform"
                :class="tog.on ? 'translate-x-4' : 'translate-x-0'"
              ></span>
            </button>
          </label>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

### C6 — Section: Combobox (exact dari UI Kit)

```html
<section id="combobox">
  <SectionHeader
    title="Combobox Lanjutan"
    subtitle="Select dengan pencarian dan opsi 'Buat baru'"
  />
  <div
    class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200
              dark:border-neutral-700 shadow-soft p-7"
  >
    <div class="max-w-md">
      <label
        class="block text-sm font-semibold text-ink dark:text-neutral-200 mb-1.5"
        >Pilih Vendor</label
      >
      <div class="relative">
        <!-- Trigger button -->
        <button
          @click="cbOpen = !cbOpen"
          class="w-full h-11 px-3.5 rounded-md bg-white dark:bg-neutral-750 border text-sm text-left
                       flex items-center gap-2 transition outline-none"
          :class="cbOpen
                  ? 'border-brand-500 ring-4 ring-brand-500/15'
                  : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400'"
        >
          <span
            :class="cbSelected ? 'text-ink dark:text-neutral-200' : 'text-neutral-400 dark:text-neutral-500'"
          >
            {{ cbSelected || 'Pilih vendor…' }}
          </span>
          <ChevronDown
            class="w-4 h-4 ml-auto text-neutral-400 transition-transform"
            :class="cbOpen ? 'rotate-180' : ''"
          />
        </button>

        <!-- Dropdown -->
        <Transition name="pop">
          <div
            v-if="cbOpen"
            class="absolute z-10 mt-2 w-full rounded-lg bg-white dark:bg-neutral-800
                      border border-neutral-200 dark:border-neutral-700 shadow-lift overflow-hidden"
          >
            <!-- Search -->
            <div
              class="p-2 border-b border-neutral-100 dark:border-neutral-700"
            >
              <div class="relative">
                <search
                  class="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  v-model="cbQuery"
                  ref="cbInputRef"
                  type="text"
                  placeholder="Cari vendor…"
                  class="w-full h-9 pl-9 pr-3 rounded bg-neutral-100 dark:bg-neutral-750
                         text-sm text-ink dark:text-neutral-200 placeholder:text-neutral-400
                         outline-none focus:bg-white dark:focus:bg-neutral-700
                         focus:ring-2 focus:ring-brand-500/30 transition"
                />
              </div>
            </div>
            <!-- List -->
            <ul class="max-h-56 overflow-y-auto py-1">
              <li
                v-for="s in cbFiltered"
                :key="s"
                @click="cbPick(s)"
                class="flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-700
                         dark:text-neutral-300 hover:bg-brand-50 dark:hover:bg-brand-900/30
                         hover:text-brand-700 dark:hover:text-brand-300 cursor-pointer"
              >
                <Building2
                  class="w-4 h-4 text-neutral-400 dark:text-neutral-500"
                />
                <span>{{ s }}</span>
                <Check
                  v-if="cbSelected === s"
                  class="w-4 h-4 ml-auto text-brand-500"
                />
              </li>
              <li
                v-if="cbFiltered.length === 0"
                class="px-3 py-3 text-sm text-neutral-400 dark:text-neutral-500 text-center"
              >
                Tidak ada hasil
              </li>
            </ul>
            <!-- Create new -->
            <button
              v-if="cbQuery && !cbExactMatch"
              @click="cbCreate"
              class="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold
                           text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20
                           hover:bg-brand-100 dark:hover:bg-brand-900/40
                           border-t border-neutral-100 dark:border-neutral-700 transition-colors"
            >
              <span
                class="grid place-items-center w-5 h-5 rounded bg-brand-500 text-white flex-shrink-0"
              >
                <Plus class="w-3.5 h-3.5" />
              </span>
              Buat vendor baru "{{ cbQuery }}"
            </button>
          </div>
        </Transition>
      </div>
      <p class="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
        Ketik nama yang belum ada untuk melihat opsi buat baru.
      </p>
    </div>
  </div>
</section>
```

---

### C7 — Section: Alerts & Badges (exact dari UI Kit)

```html
<section id="alerts">
  <SectionHeader
    title="Alert & Badge"
    subtitle="Banner status dan status pill"
  />
  <div class="space-y-5">
    <!-- Alert banners -->
    <div class="grid gap-3">
      <div
        v-for="alert in alertItems"
        :key="alert.type"
        class="flex items-start gap-3 p-4 rounded-lg border"
        :style="{ background: alertBg[alert.type], borderColor: alertBorder[alert.type] }"
      >
        <component
          :is="alert.icon"
          class="w-5 h-5 mt-0.5 shrink-0"
          :style="{ color: alertColor[alert.type] }"
        />
        <div class="min-w-0">
          <div class="text-sm font-semibold text-ink dark:text-neutral-100">
            {{ alert.title }}
          </div>
          <div class="text-sm text-neutral-600 dark:text-neutral-400">
            {{ alert.body }}
          </div>
        </div>
        <button
          class="ml-auto text-neutral-400 hover:text-neutral-600 shrink-0"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Status pills -->
    <div
      class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200
                dark:border-neutral-700 shadow-soft p-7"
    >
      <div
        class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400
                  dark:text-neutral-500 mb-4"
      >
        Status Pill
      </div>
      <div class="flex flex-wrap gap-2.5">
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-success-50 text-success-700"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-success-500"></span>
          Disetujui
        </span>
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-warning-50 text-warning-700"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-warning-500"></span> Menunggu
        </span>
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-danger-50 text-danger-700"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-danger-500"></span> Ditolak
        </span>
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Dalam
          Review
        </span>
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
        >
          Draft
        </span>
        <span
          class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-brand-500 text-white"
          >BARU</span
        >
        <span
          class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-ink dark:bg-neutral-700 text-white"
          >PRO</span
        >
      </div>
    </div>
  </div>
</section>
```

Alert data:

```ts
const alertItems = [
  {
    type: "success",
    icon: CheckCircle,
    title: "Pesanan Disetujui",
    body: "PO-2026-04817 disetujui oleh Budi Santoso.",
  },
  {
    type: "warning",
    icon: AlertTriangle,
    title: "Anggaran Mendekati Batas",
    body: "Pengeluaran logistik sudah 86% dari anggaran kuartal.",
  },
  {
    type: "danger",
    icon: AlertCircle,
    title: "Kontrak Hampir Berakhir",
    body: "Perjanjian Vertex Logistik berakhir dalam 7 hari.",
  },
  {
    type: "info",
    icon: Info,
    title: "Sinkronisasi Baru",
    body: "12 invoice diimpor dari sistem ERP pagi ini.",
  },
];
// alertBg: { success:'#E8F8EF', warning:'#FEF4E5', danger:'#FDECEC', info:'#EEF3FF' }
// alertBorder: { success:'#C6EED7', warning:'#FCE3BC', danger:'#F9CFCF', info:'#D9E4FF' }
// alertColor: { success:'#15A05A', warning:'#E8920C', danger:'#E11900', info:'#0055FF' }
```

---

### C8 — Section: Cards (exact dari UI Kit)

```html
<section id="cards">
  <SectionHeader
    title="Card & Container"
    subtitle="Template dashboard dengan shadow halus"
  />
  <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    <!-- Stat cards -->
    <div
      v-for="(stat, i) in statCards"
      :key="i"
      :class="['bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200
                   dark:border-neutral-700 transition-shadow p-6',
                   'shadow-card hover:shadow-lift dark:shadow-card-dark']"
    >
      <div class="flex items-center justify-between">
        <div
          class="grid place-items-center w-10 h-10 rounded-md"
          :style="{ background: stat.iconBg, color: stat.iconColor }"
        >
          <component :is="stat.icon" class="w-5 h-5" />
        </div>
        <span
          class="inline-flex items-center gap-0.5 text-xs font-semibold"
          :class="stat.up ? 'text-success-600' : 'text-danger-600'"
        >
          <component
            :is="stat.up ? TrendingUp : TrendingDown"
            class="w-3.5 h-3.5"
          />
          {{ stat.delta }}
        </span>
      </div>
      <!-- Value: Kanit, text-3xl, font-bold -->
      <div
        class="mt-4 text-3xl font-bold text-ink dark:text-neutral-100 tracking-tight"
        style="font-family:'Kanit',sans-serif;"
      >
        {{ stat.value }}
      </div>
      <div class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        {{ stat.label }}
      </div>
    </div>

    <!-- Featured card (full width, dark) -->
    <div
      class="sm:col-span-2 lg:col-span-3 rounded-lg overflow-hidden shadow-lift text-white
                flex flex-col sm:flex-row items-stretch"
      style="background-color:#111111;"
    >
      <div class="p-7 flex-1">
        <div
          class="text-brand-300 text-xs font-semibold uppercase tracking-[.12em] mb-2"
        >
          Featured
        </div>
        <h3
          class="text-xl font-semibold text-white"
          style="font-family:'Kanit',sans-serif;"
        >
          Review Kinerja Q2
        </h3>
        <p class="mt-2 text-neutral-300 text-sm max-w-md">
          12 kontrak akan diperpanjang. Tinjau scorecard sebelum rapat komite.
        </p>
        <button
          class="mt-5 h-10 px-4 rounded-md bg-brand-500 hover:bg-brand-600 text-white
                       text-sm font-semibold shadow-brand transition-colors flex items-center gap-2 w-max"
        >
          Buka Review <ArrowRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</section>
```

---

### C9 — Section: Data Table (exact dari UI Kit)

```html
<section id="table">
  <SectionHeader
    title="Tabel Data"
    subtitle="Tabel bersih dengan border halus & pagination"
  />
  <div
    class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200
              dark:border-neutral-700 shadow-soft overflow-hidden"
  >
    <!-- Table header bar -->
    <div
      class="flex items-center gap-3 px-5 py-4 border-b border-neutral-200 dark:border-neutral-700"
    >
      <h3 class="text-base font-bold text-ink dark:text-neutral-100">
        Permintaan Pembelian
      </h3>
      <span
        class="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-700
                   text-neutral-500 dark:text-neutral-400"
        >{{ tableRows.length }}</span
      >
      <button
        class="ml-auto h-9 px-3 rounded-md bg-white dark:bg-neutral-700 border border-neutral-300
                     dark:border-neutral-600 hover:border-brand-500 hover:text-brand-600 text-sm font-semibold
                     text-ink dark:text-neutral-300 transition-colors flex items-center gap-2"
      >
        <Filter class="w-4 h-4" /> Filter
      </button>
      <button
        class="h-9 px-3 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-sm
                     font-semibold shadow-brand transition-colors flex items-center gap-2"
      >
        <Plus class="w-4 h-4" /> Baru
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr
            class="text-left text-xs font-semibold uppercase tracking-wide
                     text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-850"
          >
            <th class="px-5 py-3 font-semibold">No. Order</th>
            <th class="px-5 py-3 font-semibold">Vendor</th>
            <th class="px-5 py-3 font-semibold">Jumlah</th>
            <th class="px-5 py-3 font-semibold">Status</th>
            <th class="px-5 py-3 font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100 dark:divide-neutral-700">
          <tr
            v-for="row in pagedRows"
            :key="row.id"
            class="hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors"
          >
            <td
              class="px-5 py-3.5 font-mono text-xs text-neutral-600 dark:text-neutral-400"
            >
              {{ row.id }}
            </td>
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2.5">
                <div
                  class="grid place-items-center w-7 h-7 rounded-full text-[11px] font-bold
                            bg-brand-50 text-brand-600"
                >
                  {{ row.vendor.slice(0,2).toUpperCase() }}
                </div>
                <span class="font-medium text-ink dark:text-neutral-200"
                  >{{ row.vendor }}</span
                >
              </div>
            </td>
            <td
              class="px-5 py-3.5 font-semibold text-ink dark:text-neutral-200"
            >
              {{ row.amount }}
            </td>
            <td class="px-5 py-3.5">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                :style="{ background: statusBg[row.status], color: statusText[row.status] }"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :style="{ background: statusDot[row.status] }"
                ></span>
                {{ row.status }}
              </span>
            </td>
            <td class="px-5 py-3.5 text-right">
              <button
                class="grid place-items-center w-8 h-8 rounded-md hover:bg-neutral-100
                             dark:hover:bg-neutral-700 text-neutral-500 ml-auto transition-colors"
              >
                <MoreHorizontal class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      class="flex items-center gap-3 px-5 py-3.5 border-t border-neutral-200 dark:border-neutral-700"
    >
      <span class="text-xs text-neutral-500 dark:text-neutral-400">
        Menampilkan {{ (tablePage-1)*tablePerPage+1 }}–{{
        Math.min(tablePage*tablePerPage, tableRows.length) }} dari {{
        tableRows.length }}
      </span>
      <div class="ml-auto flex items-center gap-1">
        <button
          @click="tablePage = Math.max(1, tablePage-1)"
          :disabled="tablePage===1"
          class="grid place-items-center w-8 h-8 rounded-md border border-neutral-300
                       dark:border-neutral-600 text-neutral-600 dark:text-neutral-400
                       hover:border-brand-500 hover:text-brand-600 disabled:opacity-40 transition-colors"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <button
          v-for="p in totalTablePages"
          :key="p"
          @click="tablePage = p"
          class="grid place-items-center w-8 h-8 rounded-md text-sm font-semibold transition-colors"
          :class="p === tablePage
                  ? 'bg-brand-500 text-white shadow-brand'
                  : 'border border-neutral-300 dark:border-neutral-600 text-neutral-600 hover:border-brand-500 hover:text-brand-600'"
        >
          {{ p }}
        </button>
        <button
          @click="tablePage = Math.min(totalTablePages, tablePage+1)"
          :disabled="tablePage===totalTablePages"
          class="grid place-items-center w-8 h-8 rounded-md border border-neutral-300
                       dark:border-neutral-600 text-neutral-600 dark:text-neutral-400
                       hover:border-brand-500 hover:text-brand-600 disabled:opacity-40 transition-colors"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</section>
```

---

### C10 — Section: Overlays (Modal, Tooltip, Toast)

```html
<section id="overlays">
  <SectionHeader title="Overlay" subtitle="Modal dialog, tooltip & toast" />
  <div
    class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200
              dark:border-neutral-700 shadow-soft p-7 flex flex-wrap items-center gap-4"
  >
    <!-- Modal trigger -->
    <button
      @click="showModal = true"
      class="h-10 px-4 rounded-md bg-brand-500 hover:bg-brand-600 text-white
                   text-sm font-semibold shadow-brand transition-colors"
    >
      Buka Dialog
    </button>

    <!-- Tooltip demo -->
    <div class="relative group">
      <button
        class="h-10 px-4 rounded-md bg-white dark:bg-neutral-700 border border-neutral-300
                     dark:border-neutral-600 text-ink dark:text-neutral-200 text-sm font-semibold
                     flex items-center gap-2"
      >
        <Info class="w-4 h-4" /> Hover untuk tooltip
      </button>
      <div
        class="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                  opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div
          class="bg-ink text-white text-xs font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-lift"
        >
          Persetujuan diarahkan ke manajer Anda
        </div>
        <div
          class="w-2 h-2 bg-ink rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"
        ></div>
      </div>
    </div>

    <!-- Toast triggers -->
    <button
      @click="triggerToast('success')"
      class="h-10 px-4 rounded-md bg-white dark:bg-neutral-700 border border-neutral-300
                   dark:border-neutral-600 text-ink dark:text-neutral-200 text-sm font-semibold
                   hover:border-brand-500 hover:text-brand-600 transition-colors"
    >
      Toast Sukses
    </button>
    <button
      @click="triggerToast('danger')"
      class="h-10 px-4 rounded-md bg-white dark:bg-neutral-700 border border-neutral-300
                   dark:border-neutral-600 text-ink dark:text-neutral-200 text-sm font-semibold
                   hover:border-brand-500 hover:text-brand-600 transition-colors"
    >
      Toast Error
    </button>
    <button
      @click="triggerToast('warning')"
      class="h-10 px-4 rounded-md bg-white dark:bg-neutral-700 border border-neutral-300
                   dark:border-neutral-600 text-ink dark:text-neutral-200 text-sm font-semibold
                   hover:border-brand-500 hover:text-brand-600 transition-colors"
    >
      Toast Warning
    </button>
  </div>

  <!-- Modal (teleport to body) -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 z-40 grid place-items-center p-4"
        @click.self="showModal = false"
      >
        <div class="absolute inset-0 bg-ink-near/60 dark:bg-black/70"></div>
        <Transition name="pop" appear>
          <div
            v-if="showModal"
            class="relative w-full max-w-md bg-white dark:bg-neutral-800 rounded-xl shadow-xl
                      overflow-hidden border border-neutral-100 dark:border-neutral-700"
          >
            <div class="p-6">
              <div class="flex items-start gap-4">
                <div
                  class="grid place-items-center w-11 h-11 rounded-lg bg-danger-50 text-danger-500 flex-shrink-0"
                >
                  <AlertTriangle class="w-5 h-5" />
                </div>
                <div>
                  <h3
                    class="text-lg font-bold text-ink dark:text-neutral-100"
                    style="font-family:'Kanit',sans-serif;"
                  >
                    Batalkan permintaan ini?
                  </h3>
                  <p
                    class="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400"
                  >
                    PO-2026-04817 akan ditarik dari proses persetujuan. Tindakan
                    ini tidak bisa dibatalkan.
                  </p>
                </div>
              </div>
            </div>
            <div
              class="flex items-center justify-end gap-3 px-6 py-4
                        bg-neutral-50 dark:bg-neutral-850 border-t border-neutral-200 dark:border-neutral-700"
            >
              <button
                @click="showModal = false"
                class="h-10 px-4 rounded-md bg-white dark:bg-neutral-700 border border-neutral-300
                             dark:border-neutral-600 hover:bg-neutral-100 text-ink dark:text-neutral-200
                             text-sm font-semibold transition-colors"
              >
                Batalkan
              </button>
              <button
                @click="showModal = false"
                class="h-10 px-4 rounded-md bg-danger-500 hover:bg-danger-600 text-white
                             text-sm font-semibold shadow-xs transition-colors"
              >
                Ya, Batalkan PO
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</section>
```

---

### C11 — Toast System (TIDAK pakai Sonner — pakai custom sesuai UI Kit)

UI Kit menggunakan custom toast (bukan Sonner). Implementasikan sesuai UI Kit:

**Toast container** — letakkan di `app.vue` atau `admin.vue` sebelum `</body>`:

```html
<!-- Toast container: fixed bottom-right -->
<div class="fixed bottom-5 right-5 z-50 space-y-2.5 w-80">
  <TransitionGroup name="pop">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="flex items-start gap-3 p-4 rounded-lg bg-white dark:bg-neutral-800
                border border-neutral-200 dark:border-neutral-700 shadow-lift"
    >
      <component
        :is="t.icon"
        class="w-5 h-5 mt-0.5 flex-shrink-0"
        :style="{ color: toastColor[t.tone] }"
      />
      <div class="min-w-0 flex-1">
        <div class="text-sm font-semibold text-ink dark:text-neutral-100">
          {{ t.title }}
        </div>
        <div class="text-sm text-neutral-600 dark:text-neutral-400">
          {{ t.body }}
        </div>
      </div>
      <button
        @click="dismissToast(t.id)"
        class="text-neutral-400 hover:text-neutral-600 flex-shrink-0"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </TransitionGroup>
</div>
```

**`useToast` composable** (`app/composables/useToast.ts`):

- `toasts: Ref<ToastItem[]>` — useState agar bisa diakses dari mana saja
- `addToast(title, body, tone)` — push item, auto-dismiss setelah 4500ms
- `dismissToast(id)` — filter by id
- Tone icons: success=CheckCircle, danger=AlertCircle, warning=AlertTriangle, info=Info
- Tone colors: success=#15A05A, danger=#E11900, warning=#E8920C, info=#0055FF

**Jangan gunakan Sonner** untuk halaman ini — replace dengan custom implementation di atas.

---

### C12 — CSS Transitions

Tambahkan di `globals.css`:

```css
/* Pop transition (modal, dropdown, toast) */
.pop-enter-active,
.pop-leave-active {
  transition: all 150ms ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(4px);
}

/* Fade transition (modal overlay) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

---

## D — Dashboard Hero Card (Exact Match + Peraturan Perusahaan)

File: `app/pages/dashboard/index.vue`

Hero card harus sama persis dengan UI Kit overview section:

```html
<div
  class="relative overflow-hidden rounded-2xl text-white p-8 sm:p-12 shadow-xl"
  style="background-color:#111111;"
>
  <!-- Stripe: angle 115deg, putih opacity 0.06 -->
  <div
    class="absolute inset-0 opacity-[0.06]"
    style="background-image:repeating-linear-gradient(115deg,#fff 0 14px,transparent 14px 40px);"
  ></div>
  <div class="relative">
    <!-- Badge pill -->
    <div
      class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10
                text-brand-300 text-xs font-semibold tracking-wide mb-5"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
      SISTEM MANAJEMEN · v2.0
    </div>
    <!-- Title: Kanit, text-4xl sm:text-5xl, font-bold, leading-[1.1] -->
    <h1
      class="text-4xl sm:text-5xl font-bold text-white max-w-2xl leading-[1.1]"
      style="font-family:'Kanit',sans-serif;"
    >
      Selamat datang kembali, {{ userName }}
    </h1>
    <!-- Subtitle -->
    <p class="mt-4 text-neutral-300 text-lg max-w-xl font-normal">
      Kelola seluruh operasional Partnership dari satu tempat yang terpercaya.
    </p>
    <!-- Two buttons — sama persis style UI Kit -->
    <div class="mt-7 flex flex-wrap gap-3">
      <!-- Button 1: solid brand (sama seperti "Get started") -->
      <button
        class="h-11 px-5 rounded-md bg-brand-500 hover:bg-brand-600 text-white
                     font-semibold text-sm shadow-brand transition-colors flex items-center gap-2"
      >
        <LayoutDashboard class="w-4 h-4" /> Lihat Dashboard
      </button>
      <!-- Button 2: bg-white/10 (sama seperti "Guidelines") → aksi ke /regulations -->
      <NuxtLink
        to="/regulations"
        class="h-11 px-5 rounded-md bg-white/10 hover:bg-white/15 text-white
                       font-semibold text-sm transition-colors flex items-center gap-2"
      >
        <BookOpen class="w-4 h-4" /> Peraturan Perusahaan
      </NuxtLink>
    </div>
  </div>
</div>
```

Stat cards (sesuai UI Kit cards section):

- Icon container: `w-10 h-10 rounded-md grid place-items-center` bg tone-50, color tone-500
- Delta badge: `text-xs font-semibold` success-600 atau danger-600 + trending icon
- Value: `text-3xl font-bold tracking-tight` style `font-family:'Kanit',sans-serif`
- Label: `text-sm text-neutral-500`
- Card hover: `shadow-card hover:shadow-lift` transition-shadow

---

## E — Focus Ring (Keyboard Tab Navigation)

Semua elemen interaktif di sidebar harus menggunakan focus ring **biru**, bukan browser default hitam.

Tambahkan ke `globals.css`:

```css
/* Override browser default focus ring — gunakan brand blue */
:focus-visible {
  outline: 2px solid var(--color-brand-500);
  outline-offset: 2px;
}
```

Pada nav items di sidebar, tambahkan class:

```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950
```

Ini berlaku untuk: semua `<button>`, `<a>`, nav items, profile footer button, logout button, collapse toggle.

---

## F — Notification Badge Sidebar

Item "Notifikasi" di sidebar wajib menampilkan badge angka dummy merah:

```html
<!-- Nav item Notifikasi dengan badge danger -->
<NuxtLink to="/notifications" :class="navItemClass('/notifications')">
  <Bell class="w-[18px] h-[18px] flex-shrink-0" />
  <span v-if="!isCollapsed">Notifikasi</span>
  <!-- Badge: warna danger, bukan brand -->
  <span
    class="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full
               bg-danger-500 text-white min-w-[18px] text-center leading-none py-[3px]"
  >
    3
  </span>
</NuxtLink>
```

Catatan: badge ini hardcode angka "3" (dummy). Saat collapsed, badge tetap tampil sebagai dot kecil di pojok icon:

```html
<!-- Collapsed: dot indicator saja -->
<span
  v-if="isCollapsed"
  class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-white dark:ring-neutral-950"
>
</span>
```

---

## G — Sidebar Collapse Button

**Posisi:** tombol collapse ada di kanan sidebar, di level navbar (vertikal center dengan `h-16` logo area).
Letakkan **di luar** sidebar `<aside>`, sebagai elemen fixed/absolute yang overlap di tepi kanan sidebar.

```html
<!-- Collapse toggle button — overlap di tepi kanan sidebar -->
<button
  @click="isCollapsed = !isCollapsed"
  class="fixed z-40 flex items-center justify-center w-6 h-6 rounded-full
               bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700
               shadow-soft text-neutral-500 dark:text-neutral-400
               hover:bg-brand-50 hover:border-brand-300 hover:text-brand-600
               transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-500"
  :style="{
          top: '28px',
          left: isCollapsed ? '52px' : '248px',
          transform: 'translateY(-50%)'
        }"
  :title="isCollapsed ? 'Buka sidebar' : 'Tutup sidebar'"
>
  <ChevronLeft
    class="w-3.5 h-3.5 transition-transform duration-200"
    :class="isCollapsed ? 'rotate-180' : ''"
  />
</button>
```

Style rule:

- Ukuran: `w-6 h-6` lingkaran kecil
- Bg: putih/dark dengan border tipis
- Shadow: `shadow-soft`
- Posisi bergeser smooth mengikuti lebar sidebar (`transition-all duration-200` pada `left`)
- Icon ChevronLeft rotate-180 saat collapsed

---

## H — Hover Card & Table Style (Exact Match)

### Card hover

```
shadow-card hover:shadow-lift (light)
shadow-card-dark hover:shadow-lift-dark (dark) -- definisikan di globals.css jika belum ada
transition: box-shadow 200ms ease
```

Tambahkan token di `globals.css` jika belum:

```css
@theme {
  --shadow-lift-dark:
    0 12px 28px rgba(0, 0, 0, 0.35), 0 4px 8px rgba(0, 0, 0, 0.2);
}
```

### Table styles (exact dari UI Kit)

- Container: `bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft overflow-hidden`
- Header bar: `flex items-center gap-3 px-5 py-4 border-b border-neutral-200`
- TH: `text-xs font-semibold uppercase tracking-wide text-neutral-500 bg-neutral-50 dark:bg-neutral-850 px-5 py-3`
- TD: `px-5 py-3.5`
- Row divider: `divide-y divide-neutral-100 dark:divide-neutral-700`
- Row hover: `hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors`
- Pagination row: `flex items-center gap-3 px-5 py-3.5 border-t border-neutral-200`
- Pagination button (inactive): `w-8 h-8 rounded-md border border-neutral-300 hover:border-brand-500 hover:text-brand-600`
- Pagination button (active): `w-8 h-8 rounded-md bg-brand-500 text-white shadow-brand`

---

## Execution Order

```
1. Update globals.css:
   a. Tambah :focus-visible override (biru, bukan hitam) — Section E
   b. Tambah .pop dan .fade CSS transitions — Section C12
   c. Tambah --shadow-lift-dark token jika belum ada — Section H

2. Rebuild admin.vue:
   a. Logo area (A1) — exact Montserrat classes, klik ke /settings
   b. Nav items (A2) — exact classes per state (active/inactive light/dark)
   c. Sidebar nav: hapus overflow, gunakan flex-1 tanpa scroll
   d. Sidebar footer profile (A3) — hapus dari navbar, tambah ke footer sidebar
   e. Sidebar collapse bug fix (A4) — icon-only mode, ukuran benar
   f. Collapse toggle button (G) — posisi, style, animasi ChevronLeft
   g. Navbar (A5) — sticky, backdrop-blur, breadcrumb, search, bell, theme toggle, lang switcher
   h. Menu struktur lengkap (B) — Peraturan Perusahaan DIHAPUS dari Operasional
   i. Notifikasi badge merah "3" (F) — expanded dan collapsed mode

3. Rebuild dashboard/index.vue (D):
   a. Hero card: stripe pattern exact, badge pill, Kanit title, 2 buttons
   b. Button kedua → "Peraturan Perusahaan" style bg-white/10
   c. Stat cards: Kanit value, shadow-card hover:shadow-lift
   d. Pastikan layout dan spacing sesuai

4. Update app/composables/useToast.ts — custom toast composable (C11)

5. Rebuild ui-preview/index.vue (C0–C12):
   - Wrapper: px-5 sm:px-8 py-8 max-w-[1100px] mx-auto space-y-16
   - SectionHeader sebagai Vue component lokal (atau inline per section)
   - 10 sections berurutan: overview, typography, colors, buttons, forms,
     combobox, alerts, cards, table, overlays
   - Custom toast container di app.vue atau layout admin.vue

6. Verifikasi: pnpm dev — zero errors, zero console warnings
7. Report ke Planner: ✅/❌ per Completion Checklist di bawah
```

---

## Completion Checklist

Sebelum report ke Planner, verifikasi manual setiap item:

```
Layout
  ✅/❌ px-5 sm:px-8 page margin ada
  ✅/❌ space-y-16 antar section

Admin Shell
  ✅/❌ Logo: Montserrat text-[15px], sub-label text-[10px] uppercase brand-500
  ✅/❌ Logo area klik → /settings
  ✅/❌ Nav active: bg-brand-500 shadow-brand
  ✅/❌ Nav inactive light: text-neutral-600 hover:bg-neutral-100
  ✅/❌ Focus ring keyboard: biru brand-500, bukan hitam
  ✅/❌ Sidebar tidak scroll (overflow: visible / flex-1)
  ✅/❌ Collapse button: posisi tepi kanan sidebar, w-6 h-6 lingkaran, ChevronLeft rotate
  ✅/❌ Collapse: icon-only mode, ukuran active button benar di semua layar
  ✅/❌ Profile di footer sidebar, ada logout icon
  ✅/❌ "Peraturan Perusahaan" TIDAK ada di sidebar
  ✅/❌ Notifikasi badge angka "3" merah di sidebar (expanded & collapsed)
  ✅/❌ Navbar: sticky, backdrop-blur, h-16
  ✅/❌ Breadcrumb kiri navbar
  ✅/❌ Theme toggle (sun/moon)
  ✅/❌ Language switcher (ID/EN)

Dashboard
  ✅/❌ Hero card: stripe 115deg opacity 0.06, badge pill, Kanit title
  ✅/❌ Button 1: solid brand "Lihat Dashboard"
  ✅/❌ Button 2: bg-white/10 "Peraturan Perusahaan" → /regulations
  ✅/❌ Stat cards: Kanit value text-3xl, shadow-card hover:shadow-lift

UI Preview
  ✅/❌ Section 1: Hero card #111111, stripe, badge, Kanit title, 2 buttons
  ✅/❌ Section 2: H1-H6 Kanit, body/mono panel terpisah
  ✅/❌ Section 3: Brand scale, neutral scale, status
  ✅/❌ Section 4: 5 button variants + sizes + states
  ✅/❌ Section 5: Input, select+chevron, textarea, error, checkbox, radio, toggle
  ✅/❌ Section 6: Combobox dengan search + create new
  ✅/❌ Section 7: 4 alert types + status pills (7 variants)
  ✅/❌ Section 8: 3 stat cards + featured dark card
  ✅/❌ Section 9: Tabel dengan header bar, rows, pagination
  ✅/❌ Section 10: Modal + tooltip + toast triggers
  ✅/❌ Toast: muncul bottom-right, auto-dismiss 4500ms, custom (bukan Sonner)
```
