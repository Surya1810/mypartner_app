# Fix 007 — Theme Fix & UI Polish

**Depends on:** fix_006 selesai ✅  
**Shell:** PowerShell (Windows)  
**Reference:** `public/ui-kit-reference.html` — buka saat eksekusi  
**Rules:** `.plan/rules/frontend.md` — baca penuh sebelum mulai

---

## Goal

Perbaiki root cause tema gelap yang tidak berfungsi (Tailwind v4 `@variant dark`),
redesain stat cards agar lebih informatif, ganti search bar dengan datetime berbadge,
susun ulang layout card menjadi 6-column grid, dan perbaiki beberapa detail UI.

---

## ⚠️ CRITICAL — Baca Ini Dulu

**Root cause tema gelap tidak berfungsi:**

Tailwind v4 secara default menggunakan `prefers-color-scheme` media query untuk `dark:`
variants, BUKAN class `.dark` pada `<html>`. Tanpa konfigurasi tambahan, klik tombol
toggle tema tidak berdampak karena Tailwind tidak mendengarkan class `.dark` dari
`@nuxtjs/color-mode`.

**Fix wajib — tambahkan di `globals.css` TEPAT setelah `@import "tailwindcss"`:**

```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));
```

Baris ini memberitahu Tailwind v4: "terapkan `dark:` variants ketika ancestor punya
class `.dark`". Setelah ini, semua `dark:bg-*`, `dark:text-*`, `dark:border-*` yang
sudah ada akan langsung berfungsi.

---

## Acceptance Criteria

### A — Tema Terang/Gelap (Critical Fix)

- [ ] `@variant dark (&:where(.dark, .dark *));` ada di baris kedua `globals.css` (tepat setelah `@import`)
- [ ] Klik tombol toggle tema → halaman LANGSUNG berganti warna (sidebar, konten, teks)
- [ ] Light mode: sidebar putih, konten bg-neutral-50, teks gelap
- [ ] Dark mode: sidebar bg-neutral-950, konten bg-neutral-850, teks terang
- [ ] Semua teks readable di kedua tema (tidak ada teks hitam di atas background hitam)

### B — Margin

- [ ] Padding kiri-kanan main content: `px-8` (lebih lebar dari sebelumnya `px-5`)
- [ ] Padding atas-bawah: `py-6` (tidak berubah)

### C — Info Box

- [ ] Icon di setiap info box vertically centered dengan konten teks (`items-center` bukan `items-start`)
- [ ] Tombol close (X) DIHAPUS dari semua varian info box di UI Preview
- [ ] 4 varian tetap ada (info, success, warning, danger), hanya tanpa tombol close

### D — Stat Cards Redesign (6 Cards)

- [ ] Dashboard menampilkan 6 stat cards dalam 1 grid: `grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4`
- [ ] Card Highlight (gradient) masuk ke dalam grid yang sama, ukuran identik dengan card lain
- [ ] Setiap card memiliki: title label (small caps), angka besar, teks deskripsi
- [ ] 6 card: Card Highlight, Total Klien, Prospek Aktif, Stok Kritis, Dokumen Aktif, Total Vendor
- [ ] Layout tidak ada gap besar / area kosong dalam card

### E — Toast Colors

- [ ] Setelah `@variant dark` fix, dark mode toast: bg-[tone]-900/30 tampil benar
- [ ] Light mode toast: teks `text-[tone]-800` (bukan text-ink), readable di atas bg-[tone]-50
- [ ] Border-2 warna sesuai tone

### F — Notification Dropdown Colors

- [ ] Popover background: `bg-white dark:bg-neutral-800` — tidak transparan
- [ ] Item text: `text-neutral-700 dark:text-neutral-200`
- [ ] Header & footer border: `border-neutral-100 dark:border-neutral-700`
- [ ] Hover item: `hover:bg-neutral-50 dark:hover:bg-neutral-700/50`

### G — Logo Text Sidebar

- [ ] "MyPartner" text: `text-xl font-bold` (18px → 20px), font Kanit
- [ ] "V2.0" badge: styled sebagai pill `px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 text-[10px] font-bold`

### H — Card Highlight

- [ ] Card Highlight ada di DALAM grid 6 card, bukan full-width di atas grid
- [ ] Ukuran card sama dengan 5 card lainnya (bukan col-span)
- [ ] `cursor-default` — tidak ada pointer cursor saat hover
- [ ] Gradient dan hover effect tetap ada (warna gradient berubah subtle saat hover, tapi bukan pointer)

### I — Navbar: Search → Styled DateTime

- [ ] Search bar (`<input>` dengan placeholder "Cari modul...") DIHAPUS dari navbar
- [ ] DateTime display tetap di kiri navbar (dari fix_006), diperbarui stylenya:
  - Day badge: `px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 text-[10px] font-bold uppercase tracking-widest font-sans`
  - Date string: `font-mono text-sm text-neutral-500 dark:text-neutral-400 tabular-nums`
  - Separator: `·` (text-neutral-300)
  - Time string: `font-mono text-sm font-semibold text-neutral-700 dark:text-neutral-200 tabular-nums`
  - WIB label: `text-[10px] text-neutral-400 dark:text-neutral-500 font-sans ml-0.5`
- [ ] `useDateTime` composable expose: `dayShort` (mis. "Rab"), `dateStr` (mis. "24 Jun 2026"), `timeStr` (mis. "11:12:58")
- [ ] Waktu terupdate setiap detik

### J — Karyawan di Operasional

- [ ] Item "Karyawan" ditambahkan di grup Operasional (setelah "Cuti & Izin")
- [ ] Status: disabled (on-hold), badge "Segera"
- [ ] Icon: `UserCog` dari lucide-vue-next
- [ ] Route: `/employees` (belum aktif, pointer-events-none)

---

## Files to Modify

- `app/assets/css/globals.css` — tambah `@variant dark` (WAJIB, baris pertama)
- `app/layouts/admin.vue` — hapus search bar, update datetime style, logo text bigger, tambah Karyawan di nav
- `app/pages/dashboard/index.vue` — redesain 6 stat cards + card highlight dalam grid
- `app/pages/ui-preview/index.vue` — perbaiki info box (center icon, hapus close btn), perbarui card highlight section
- `app/composables/useDateTime.ts` — expose dayShort, dateStr, timeStr secara terpisah
- `app/app.vue` — fix toast text colors (tone-specific)

---

## Implementation Notes

### A — globals.css: @variant dark

Baris pertama dan kedua harus menjadi:

```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));
```

Jangan pindahkan atau ubah konten lain. Tambahkan hanya 1 baris ini di posisi itu.
Setelah ini, semua `dark:` classes yang sudah ada di seluruh codebase langsung aktif.

---

### B — Main Padding

Di `admin.vue`, ubah `<main>`:

```
class="flex-1 px-5 py-6"  →  class="flex-1 px-8 py-6"
```

---

### C — Info Box Fix

Di `ui-preview/index.vue`, temukan semua info box items:

1. Ubah `items-start` → `items-center` pada wrapper flex parent
2. Hapus seluruh elemen `<button>` (X / dismiss) dari semua 4 varian

---

### D — Stat Cards Redesign

**Data baru `statCards` array di `dashboard/index.vue`:**

```js
const statCards = [
  // Card Highlight — BUKAN objek biasa, flag isHighlight: true
  {
    isHighlight: true,
    title: "RINGKASAN BULAN INI",
    value: "Rp 48,2JT",
    description: "Total nilai kontrak aktif Partnership",
    sub: "Rp 48.200.000 verified",
  },
  {
    title: "TOTAL KLIEN",
    value: "147",
    description: "Dari 159 klien terdaftar",
    sub: "+12 bulan ini",
    delta: "+8%",
    up: true,
    icon: Users,
    iconBg: "var(--color-brand-50)",
    iconColor: "var(--color-brand-600)",
  },
  {
    title: "PROSPEK AKTIF",
    value: "23",
    description: "Dalam pipeline Pre-Sales",
    sub: "4 follow-up hari ini",
    delta: "+4%",
    up: true,
    icon: TrendingUp,
    iconBg: "var(--color-success-50)",
    iconColor: "var(--color-success-600)",
  },
  {
    title: "STOK KRITIS",
    value: "5",
    description: "Item perlu restok segera",
    sub: "Ambang batas 10 unit",
    delta: "-2",
    up: false,
    icon: PackageOpen,
    iconBg: "var(--color-warning-50)",
    iconColor: "var(--color-warning-600)",
  },
  {
    title: "DOKUMEN AKTIF",
    value: "18",
    description: "Surat dalam proses persetujuan",
    sub: "3 menunggu tanda tangan",
    delta: "+3",
    up: true,
    icon: FileText,
    iconBg: "var(--color-brand-50)",
    iconColor: "var(--color-brand-500)",
  },
  {
    title: "TOTAL VENDOR",
    value: "34",
    description: "Vendor aktif terdaftar",
    sub: "3 baru bulan ini",
    delta: "+3",
    up: true,
    icon: Truck,
    iconBg: "var(--color-neutral-100)",
    iconColor: "var(--color-neutral-600)",
  },
];
```

Import tambahan: `FileText`, `Truck` dari `lucide-vue-next`.

**Grid container:**

```html
<div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4"></div>
```

**Template card biasa (isHighlight: false):**

```html
<div
  class="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200
            dark:border-neutral-700 p-5 shadow-card hover:shadow-lift
            transition-shadow flex flex-col gap-2"
>
  <!-- Top: icon + delta -->
  <div class="flex items-center justify-between">
    <div
      class="grid place-items-center w-8 h-8 rounded-lg"
      :style="{ background: card.iconBg, color: card.iconColor }"
    >
      <component :is="card.icon" class="w-4 h-4" />
    </div>
    <span
      class="text-xs font-semibold"
      :class="card.up ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'"
    >
      {{ card.delta }}
    </span>
  </div>
  <!-- Title label -->
  <p
    class="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500"
  >
    {{ card.title }}
  </p>
  <!-- Big number -->
  <div
    class="text-2xl font-bold text-ink dark:text-neutral-100 leading-none"
    style="font-family:'Kanit',sans-serif;"
  >
    {{ card.value }}
  </div>
  <!-- Description -->
  <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-snug">
    {{ card.description }}
  </p>
  <!-- Sub detail -->
  <p class="text-[10px] text-neutral-400 dark:text-neutral-500">
    {{ card.sub }}
  </p>
</div>
```

**Template Card Highlight (isHighlight: true) — ukuran SAMA, dalam grid yang sama:**

```html
<div
  class="relative overflow-hidden rounded-xl p-5 flex flex-col gap-2 cursor-default
            transition-all duration-300
            bg-gradient-to-br from-brand-600 to-brand-900
            hover:from-brand-500 hover:to-brand-800"
>
  <!-- Stripe dekorasi subtle -->
  <div
    class="absolute inset-0 opacity-[0.04]"
    style="background-image:repeating-linear-gradient(115deg,#fff 0 14px,transparent 14px 40px);"
  />
  <div class="relative flex flex-col gap-2">
    <p
      class="text-[10px] uppercase tracking-widest font-semibold text-white/50"
    >
      {{ card.title }}
    </p>
    <div
      class="text-2xl font-bold text-white leading-none"
      style="font-family:'Kanit',sans-serif;"
    >
      {{ card.value }}
    </div>
    <p class="text-xs text-white/70 leading-snug">{{ card.description }}</p>
    <p class="text-[10px] text-white/40">{{ card.sub }}</p>
  </div>
</div>
```

Gunakan `v-if="card.isHighlight"` untuk pilih template mana yang di-render.

---

### E — Toast Text Colors

Di `app.vue`, perbarui warna teks pada toast card:

Tambahkan computed atau helper untuk teks color per tone:

```
success → text-success-800 dark:text-success-200
danger  → text-danger-800  dark:text-danger-200
warning → text-warning-800 dark:text-warning-200
info    → text-brand-800   dark:text-brand-200
```

Gunakan untuk judul dan body teks — bukan `text-ink` atau `text-neutral-600` yang tidak
kontras dengan bg-[tone]-50.

---

### F — Notification Dropdown

Di `admin.vue`, temukan `PopoverContent` notifikasi.
Pastikan class `PopoverContent` atau wrapper pertama di dalamnya memiliki:

```
bg-white dark:bg-neutral-800
border border-neutral-200 dark:border-neutral-700
```

Setiap item notifikasi:

```
hover:bg-neutral-50 dark:hover:bg-neutral-700/50
text-sm font-medium text-neutral-800 dark:text-neutral-100  (judul)
text-xs text-neutral-500 dark:text-neutral-400              (sub)
text-[10px] text-neutral-400 dark:text-neutral-500          (waktu)
```

Footer "Lihat Semua Notifikasi":

```
text-brand-600 dark:text-brand-400
hover:bg-brand-50 dark:hover:bg-brand-900/20
border-t border-neutral-100 dark:border-neutral-700
```

---

### G — Logo Text Sidebar

Di `admin.vue`, temukan logo text area:

```html
<!-- SEBELUM -->
<div
  class="font-bold tracking-tight text-[15px] truncate"
  style="font-family:'Montserrat',sans-serif"
>
  MyPartner
</div>
<div
  class="text-[10px] uppercase tracking-[.14em] text-brand-500 font-semibold"
>
  V2.0
</div>

<!-- SESUDAH -->
<div
  class="font-bold text-xl truncate"
  :class="isDark ? 'text-white' : 'text-ink'"
  style="font-family:'Kanit',sans-serif;"
>
  MyPartner
</div>
<span
  class="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide
             bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400"
>
  V2.0
</span>
```

---

### H — Card Highlight di Grid

Hapus Card Highlight yang full-width di atas grid (jika ada dari fix_006).
Card Highlight sekarang menjadi ITEM PERTAMA di dalam grid 6-column (lihat Section D di atas).
`cursor-default` ada pada class card highlight.
Hover hanya mengubah gradient warna, bukan menambah cursor pointer.

---

### I — Navbar: Hapus Search, Update DateTime Style

**1. Hapus search bar:**
Temukan dan hapus seluruh blok:

```html
<div class="relative ml-auto max-w-xs w-full hidden md:block">
  <search ... />
  <input type="text" placeholder="Cari modul, klien, dokumen…" ... />
</div>
```

Hapus juga import `Search` dari lucide jika tidak dipakai lain.

**2. Update `useDateTime.ts` — expose tiga nilai terpisah:**

```ts
const dayShort = computed(() =>
  now.value.toLocaleDateString("id-ID", { weekday: "short" }),
);
// "Rab" — diambil dari 3 huruf pertama hari
const dateStr = computed(() =>
  now.value.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }),
);
// "24 Jun 2026"
const timeStr = computed(() =>
  now.value.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
);
// "11:12:58"

return { dayShort, dateStr, timeStr, formatted };
```

**3. Update template datetime di `admin.vue`:**

```html
<div class="flex items-center gap-2 flex-shrink-0">
  <!-- Day badge -->
  <span
    class="px-1.5 py-0.5 rounded font-sans text-[10px] font-bold uppercase tracking-widest
               bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400"
  >
    {{ dateTime.dayShort }}
  </span>
  <!-- Date -->
  <span
    class="font-mono text-sm text-neutral-500 dark:text-neutral-400 tabular-nums"
  >
    {{ dateTime.dateStr }}
  </span>
  <!-- Separator -->
  <span class="text-neutral-300 dark:text-neutral-600 select-none font-mono"
    >·</span
  >
  <!-- Time -->
  <span
    class="font-mono text-sm font-semibold text-neutral-700 dark:text-neutral-200 tabular-nums"
  >
    {{ dateTime.timeStr }}<span
      class="text-[10px] text-neutral-400 dark:text-neutral-500 font-sans ml-0.5 font-normal"
      >WIB</span
    >
  </span>
</div>
```

Tempatkan di dalam div kiri navbar, baris pertama (di atas atau menggantikan posisi breadcrumb sebelumnya).
Sesuaikan agar breadcrumb tetap ada di bawahnya jika ada ruang, atau gabungkan dalam satu flex-col.

---

### J — Karyawan di Operasional

Di array `navigation` dalam `admin.vue`, temukan grup `Operasional`.
Tambahkan item setelah `leave` (Cuti & Izin):

```js
{ id: 'employees', label: 'Karyawan', icon: UserCog, disabled: true, badge: 'Segera' },
```

Import `UserCog` dari `lucide-vue-next`.

---

## Execution Order

```
1. WAJIB PERTAMA: Edit globals.css — tambah @variant dark (Section A)
   → Test: toggle tema seharusnya langsung bekerja setelah ini
2. Edit admin.vue:
   a. Logo text: text-xl Kanit + V2.0 badge (Section G)
   b. Hapus search bar (Section I)
   c. Update datetime composable import & template (Section I)
   d. Fix notification popover colors (Section F)
   e. Padding main: px-8 (Section B)
   f. Tambah Karyawan di nav (Section J)
3. Edit useDateTime.ts: expose dayShort, dateStr, timeStr (Section I)
4. Edit dashboard/index.vue: 6 card grid dengan card highlight (Section D & H)
5. Edit app.vue: toast text colors per tone (Section E)
6. Edit ui-preview/index.vue: info box center icon + hapus close btn (Section C)
   + perbarui Card Highlight section (Section H)
7. Jalankan pnpm dev — verifikasi semua criteria, report ke Planner
```

---

## Completion

Jalankan `pnpm dev`, verifikasi **semua** acceptance criteria terpenuhi.  
Laporkan hasil ke Planner dalam format:

```
✅ / ❌  [item dari acceptance criteria]
```

No screenshots — Planner melakukan visual review sendiri.
