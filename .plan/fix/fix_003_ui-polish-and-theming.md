# Fix 003 — UI Polish & Theming

**Depends on:** `fix_002` selesai (design tokens, fonts, admin layout sudah ada)  
**Shell:** PowerShell (Windows)  
**Reference:** `public/ui-kit-reference.html` — visual ground truth wajib dibuka saat eksekusi  
**Rules:** `.plan/rules/frontend.md` — baca penuh sebelum mulai

---

## Goal

Polish menyeluruh admin shell dan halaman dashboard + ui-preview agar sesuai UI Kit:
light/dark theme, sidebar collapsible, notification + profile dropdown, breadcrumb,
toast system, typography alignment, full UI Preview audit, dan sidebar menu yang lengkap
dengan struktur grup, on-hold modules, sub-menu, dan language switcher.

---

## Acceptance Criteria

- [ ] Light/dark theme toggle berfungsi; sidebar color mengikuti tema
- [ ] Sidebar dapat di-collapse (lebar menyempit, hanya tampil icon)
- [ ] Sidebar tidak scrollable; footer section fixed di bawah
- [ ] Tombol logout ada di profile dropdown (bukan di sidebar langsung)
- [ ] Avatar top-right berbentuk lingkaran dengan inisial user
- [ ] Settings icon button muncul di kanan navbar (sebelum avatar)
- [ ] Notification button membuka dropdown: dummy unread items + tombol "Lihat Inbox"
- [ ] Breadcrumb muncul di kiri navbar, mengikuti route aktif
- [ ] Logo teks "MyPartner" lebih besar; icon biru lebih besar
- [ ] Angka stat cards menggunakan font Montserrat (font-sans)
- [ ] Teks dan icon pada stat cards lebih besar
- [ ] Card bergaris: garis abu lebih terang, teks "MyPartner · V2.0", tombol solid, tanpa emoji
- [ ] Toast: 1 trigger button, posisi top-right, stacking — expand on hover
- [ ] Kanit hanya untuk heading/display; Montserrat untuk body/label (sesuai rules)
- [ ] Toggle component sesuai UI Kit (warna, track, thumb)
- [ ] Invalid input state: border merah + ring merah + error text
- [ ] Select/dropdown tidak bug; posisi, z-index, dan styling sesuai UI Kit
- [ ] Seluruh section UI Preview sesuai UI Kit (typography, spacing, warna, state)
- [ ] Sidebar menampilkan semua grup: Intelligence (tanpa label), Operasional, Sales, Produk & Inventaris, Master Data
- [ ] Setiap grup memiliki section label dan nav items yang benar sesuai spesifikasi
- [ ] Modul on-hold (Tugas, Project, Transaksi, Keuangan) muncul di sidebar dengan badge "Segera" dan tidak bisa diklik
- [ ] Keuangan memiliki sub-menu yang dapat di-expand (accordion): Pemasukan, Pengeluaran, Laporan Keuangan
- [ ] "Brankas Akun" diganti menjadi "Akun" dan dipindah ke grup Master Data
- [ ] Language switcher (ID / EN) muncul di navbar kanan atas
- [ ] Semua label UI menggunakan Bahasa Indonesia
- [ ] `pnpm dev` zero errors, zero console warnings

---

## Files to Create

- `app/composables/useTheme.ts` — wrapper tipis di atas `useColorMode`
- `app/composables/useSidebar.ts` — state collapsed/expanded, persist via localStorage
- `app/composables/useBreadcrumb.ts` — auto-generate dari route path
- `app/composables/useLocale.ts` — simple locale switcher (id/en), persist localStorage
- `app/locales/id.ts` — terjemahan Indonesian (sidebar + navbar labels)
- `app/locales/en.ts` — terjemahan English (sidebar + navbar labels)

---

## Files to Modify

- `nuxt.config.ts` — tambah `@nuxtjs/color-mode` ke modules
- `app/assets/css/globals.css` — tambah dark mode overrides (`html.dark { ... }`)
- `app/layouts/admin.vue` — sidebar collapsible, theme toggle, notification dropdown, profile dropdown, settings button, breadcrumb, footer sidebar
- `app/pages/dashboard/index.vue` — font angka, ukuran card, perbaikan hero card
- `app/pages/ui-preview/index.vue` — full audit: typography, toggle, input invalid, select, semua section

---

## Implementation Notes

### A — Theme System

Install `@nuxtjs/color-mode`:

```
pnpm add @nuxtjs/color-mode
```

Config di `nuxt.config.ts`:

```
modules: ['@nuxtjs/color-mode'],
colorMode: { classSuffix: '' }  // adds .dark on <html>, bukan .dark-mode
```

Di `globals.css`, tambah blok dark overrides **setelah** `@theme`:

```css
html.dark {
  /* sidebar & layout */
  --sidebar-bg: var(--color-neutral-950);
  --sidebar-text: var(--color-neutral-300);
  --sidebar-icon: var(--color-neutral-500);
  --navbar-bg: var(--color-neutral-900);
  --content-bg: var(--color-neutral-850);
  /* surface */
  --card-bg: var(--color-neutral-800);
  --card-border: var(--color-neutral-700);
  /* text */
  --text-primary: var(--color-neutral-50);
  --text-secondary: var(--color-neutral-400);
  --text-muted: var(--color-neutral-500);
}

html:not(.dark) {
  --sidebar-bg: #ffffff;
  --sidebar-text: var(--color-neutral-700);
  --sidebar-icon: var(--color-neutral-500);
  --navbar-bg: #ffffff;
  --content-bg: var(--color-neutral-50);
  --card-bg: #ffffff;
  --card-border: var(--color-neutral-200);
  --text-primary: var(--color-ink);
  --text-secondary: var(--color-neutral-500);
  --text-muted: var(--color-neutral-400);
}
```

Semua komponen layout harus menggunakan CSS var di atas, bukan hardcode hex.
`useTheme.ts` expose: `isDark`, `toggle()` menggunakan `useColorMode()`.

---

### B — Admin Layout (`admin.vue`)

**B1 — Sidebar collapsible**

- `useSidebar.ts`: ref `isCollapsed` (default false), persist ke `localStorage`
- Saat collapsed: sidebar width = 64px, hanya tampilkan icon (label tersembunyi)
- Transisi CSS: `transition: width 200ms ease`
- Toggle button: panah kecil di tepi kanan sidebar, atau di navbar
- Sidebar tidak boleh `overflow-y: auto` — konten harus fit tanpa scroll
- Nav items: jika collapsed → hanya icon + tooltip saat hover

**B2 — Sidebar footer**

- Fixed di bottom sidebar: `mt-auto` / absolute bottom
- Isi: avatar kecil + nama user + role (light: text-neutral-600, dark: text-neutral-400)
- Saat collapsed: hanya avatar kecil

**B3 — Profile dropdown (kanan atas)**

- Gunakan shadcn `DropdownMenu` dengan trigger `Avatar` (circular, inisial, brand bg)
- Isi dropdown: nama + email (disabled), divider, "Profil Saya", "Pengaturan", divider, "Keluar"
- Logout ada **hanya** di sini, bukan di sidebar

**B4 — Settings button**

- Icon button `<Settings />` dari Lucide, antara notification dan avatar
- Klik → belum ada aksi (placeholder, cukup console log atau toast "Coming soon")

**B5 — Notification dropdown**

- Icon button `<Bell />`, ada badge merah angka jika ada unread
- Klik → shadcn `Popover` muncul dari kanan
- Isi: header "Notifikasi", list 3 dummy item (ikon tipe, judul, waktu, dot merah = belum baca)
- Footer: tombol "Lihat Semua Notifikasi" → `/notifications` (route boleh belum ada)

**B6 — Breadcrumb (kiri navbar)**

- `useBreadcrumb.ts`: parse `useRoute().path` → array `[{ label, href }]`
  - `/dashboard` → `[{ label: 'Dashboard' }]`
  - `/clients/new` → `[{ label: 'Klien', href: '/clients' }, { label: 'Tambah Baru' }]`
- Render dengan shadcn `Breadcrumb` component
- Posisi: kiri navbar, menggantikan area kosong saat ini

**B7 — Logo & icon sizing**

- Logo icon (SVG/img biru): minimal `w-9 h-9`
- Teks "MyPartner": `text-xl font-bold` (Kanit), pastikan visible di collapsed mode = hidden

---

### C — Dashboard (`dashboard/index.vue`)

**C1 — Stat cards**

- Angka nilai: `font-sans text-3xl font-bold` (Montserrat, lebih besar dari sekarang)
- Label: `text-sm font-medium` (Montserrat)
- Icon container: `w-12 h-12`, icon `w-6 h-6`

**C2 — Hero card bergaris**

- Garis/stripe: warna harus lebih terang — gunakan `rgba(255,255,255,0.06)` atau sesuai UI Kit
- Stripe lebih vertikal/tegak — pakai `background-image: repeating-linear-gradient` dengan sudut ~-65deg
- Teks hero: ganti "MYPARTNER" → "MyPartner · V2.0" (Kanit, font-bold)
- CTA button: bukan ghost — gunakan `bg-white text-brand-500` atau `bg-brand-400`
- Hapus emoji 👋 dari greeting

---

### D — Toast System

Sonner sudah include dari shadcn-vue. Konfigurasi:

**D1 — Setup**

- Di `app.vue`: pastikan `<Toaster position="top-right" expand :visibleToasts="3" />`
- `expand` prop: saat hover → toast tersusun vertikal (built-in Sonner behavior)
- Pastikan `richColors: true`

**D2 — Test button**

- Di `app/pages/ui-preview/index.vue`, tambah Section baru "Toast" (atau di atas semua section)
- 4 button: "Success", "Error", "Warning", "Info" — masing-masing trigger toast sesuai tipe
- Warna toast harus sesuai brand (success-500, danger-500, warning-500, brand-500)

---

### E — UI Preview Full Audit (`ui-preview/index.vue`)

Buka `http://localhost:3000/ui-kit-reference.html` sebagai referensi visual. Audit setiap section:

**E1 — Typography**

- Heading / display text: wajib `font-display` (Kanit)
- Body, label, caption: wajib `font-sans` (Montserrat)
- Code/mono: `font-mono` (JetBrains Mono)
- Pastikan demo di section Typography menampilkan contoh ketiganya

**E2 — Form inputs**

- **Invalid state:** tambah class `border-danger-500 ring-4 ring-danger-500/15` + teks error merah di bawah field
- Demo: satu input field dengan `aria-invalid` dan error message "Field ini wajib diisi"

**E3 — Toggle / Switch**

- Gunakan shadcn `Switch` — pastikan warna checked = `bg-brand-500`, unchecked = `bg-neutral-300`
- Track dan thumb sesuai UI Kit

**E4 — Select / Combobox**

- Pastikan shadcn `Select` tidak ada bug z-index (dropdown muncul di atas konten lain)
- Styling: tinggi item `h-9`, font `text-sm`, selected item highlight `bg-brand-50 text-brand-600`
- Jika masih bug, cek versi shadcn-vue select — mungkin perlu `Teleport` ke body

**E5 — Semua section lainnya**
Audit minimal: Badge, Button variants, Card, Alert, Table, Tabs, Modal/Dialog, Pagination, Datepicker (jika ada).
Setiap section: spacing antar elemen, warna, border radius — cocokkan dengan UI Kit pixel-by-pixel.

---

## F — Sidebar Menu Structure & Language

### F1 — Struktur Menu Lengkap

Definisikan nav config sebagai array di `admin.vue` atau composable `useNavigation.ts`.
Struktur per grup:

```
[Tanpa label — Intelligence]
  - Dashboard          → /dashboard         icon: LayoutDashboard
  - Laporan            → /reports           icon: BarChart2
  - Audit Log          → /audit-log         icon: ClipboardList
  - Notifikasi         → /notifications     icon: Bell

[Operasional]
  - Manajemen Dokumen  → /documents         icon: FolderOpen
  - Pengajuan Cuti     → /leave             icon: CalendarOff
  - Peraturan          → /regulations       icon: BookOpen
  - Generator Surat    → /letters           icon: Mail
  - Tugas              → disabled           icon: CheckSquare      badge: "Segera"
  - Keuangan           → disabled (expandable sub-menu)            badge: "Segera"
      Sub: Pemasukan   → /finance/income    icon: TrendingUp
      Sub: Pengeluaran → /finance/expense   icon: TrendingDown
      Sub: Lap. Keuangan → /finance/report  icon: FileSpreadsheet

[Sales]
  - Pre-Sales / CRM    → /presales          icon: Target
  - After-Sales        → /aftersales        icon: HeartHandshake
  - Project            → disabled           icon: Briefcase        badge: "Segera"
  - Transaksi          → disabled           icon: ArrowLeftRight   badge: "Segera"

[Produk & Inventaris]
  - Katalog Produk     → /products          icon: Package
  - Generator Katalog  → /catalog-generator icon: Layers
  - Inventaris & Stok  → /inventory         icon: Warehouse

[Master Data]
  - Entitas            → /entity            icon: Building2
  - Divisi             → /division          icon: Network
  - Pengguna           → /users             icon: Users
  - Klien              → /clients           icon: UserCheck
  - Supplier           → /suppliers         icon: Truck
  - Akun               → /vault             icon: KeyRound
```

**On-hold item rules:**

- Rendered tapi `pointer-events: none`, opacity 50%
- Badge kecil "Segera" di kanan (brand-50 bg, brand-600 text, text-xs)
- Tidak ada hover state
- Route prop diabaikan (tidak perlu `<NuxtLink>`)

**Sub-menu (Keuangan accordion):**

- Parent item memiliki ChevronDown icon di kanan, toggle expand/collapse
- State expand: `ref<Record<string, boolean>>` per group key, default collapsed
- Sub-items indent lebih dalam (`pl-8`), font-size `text-xs`
- Animasi: `v-show` + CSS `max-height` transition 200ms

### F2 — Language Switcher

Pendekatan: simple `useLocale` composable (tanpa install @nuxtjs/i18n — terlalu berat untuk MVP).

- `app/composables/useLocale.ts`: useState `locale` ('id' | 'en'), persist localStorage
- `app/locales/id.ts` dan `app/locales/en.ts`: objek key-value flat (hanya untuk label sidebar + navbar)
- Composable expose: `locale`, `t(key: string): string`, `setLocale(lang)`

Di navbar kanan atas (antara notification dan settings):

- Toggle button: tampilkan "ID" atau "EN" — klik switch ke yang lain
- Style: `h-8 px-2.5 rounded-md border border-neutral-200 text-xs font-semibold`

Cakupan terjemahan Phase ini (minimal — hanya sidebar dan navbar labels):

- Semua nav group labels
- Semua nav item labels
- Navbar: label breadcrumb "Dashboard", "Beranda" dst.
- Tidak perlu menerjemahkan seluruh halaman — itu scope i18n penuh, bukan sekarang

## Execution Order

```
1. Install @nuxtjs/color-mode (pnpm add)
2. Update nuxt.config.ts (module + colorMode config)
3. Update globals.css (dark/light CSS vars)
4. Create composables: useTheme.ts, useSidebar.ts, useBreadcrumb.ts, useLocale.ts
5. Create app/locales/id.ts dan en.ts (sidebar + navbar labels)
6. Rebuild admin.vue:
   a. Nav config array lengkap (semua grup, on-hold, sub-menu Keuangan)
   b. Collapsible sidebar, dark/light aware
   c. Dropdowns: profile (logout di sini), notification
   d. Navbar: breadcrumb (kiri), language switcher + settings + notification + avatar (kanan)
   e. Sidebar footer: avatar + nama + role
7. Update dashboard/index.vue (font angka, ukuran card, hero card)
8. Update app.vue (Toaster top-right, expand on hover)
9. Rebuild ui-preview/index.vue (typography, toast section, form states, select, full audit)
10. Run pnpm dev — verifikasi semua criteria, report ke Planner
```

---

## Completion

Jalankan `pnpm dev`, verifikasi **semua** acceptance criteria terpenuhi.  
Laporkan hasil ke Planner dalam format:

```
✅ / ❌  [item dari acceptance criteria]
```

No screenshots — Planner melakukan visual review sendiri.
