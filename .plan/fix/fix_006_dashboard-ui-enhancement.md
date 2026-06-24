# Fix 006 — Dashboard & UI Enhancement

**Depends on:** fix_005 selesai ✅  
**Shell:** PowerShell (Windows)  
**Reference:** `public/ui-kit-reference.html` — buka saat eksekusi  
**Rules:** `.plan/rules/frontend.md` — baca penuh sebelum mulai

---

## Goal

Memperkaya dashboard dengan date/time live, card highlight bergradasi, dan enhancement
stat cards; melengkapi UI Preview dengan info box; menyamakan margin/padding seluruh
halaman; membenahi tema terang/gelap; memperbaiki toast, notifikasi, alert, badge;
menggeser profile dari navbar ke sidebar bawah; dan memperbaiki sejumlah bug visual kecil.

---

## Acceptance Criteria

### A — Date/Time

- [ ] Tanggal dan waktu tampil di navbar, format: `Rabu, 24 Juni 2026 | 11:12:58 WIB`
- [ ] Waktu diperbarui setiap detik (live clock)
- [ ] Format hari dan bulan dalam Bahasa Indonesia
- [ ] Style: text-xs atau text-sm, muted color, tampil di sisi kiri navbar

### B — Dashboard Stat Cards

- [ ] Icon container: `w-12 h-12` (lebih besar dari sebelumnya `w-10 h-10`)
- [ ] Icon di dalam: `w-6 h-6`
- [ ] Setiap card memiliki mini sparkline/dekorasi grafik SVG di sudut kanan bawah card
- [ ] Angka stat menggunakan Kanit, `text-3xl font-bold`
- [ ] Delta badge (±%) lebih besar dan readable

### C — Info Box (UI Preview)

- [ ] Section baru "Info Box" muncul di UI Preview
- [ ] Menampilkan 4 varian: info (biru), success (hijau), warning (oranye), danger (merah)
- [ ] Setiap varian: icon di kiri + judul bold + teks deskripsi + optional dismiss button
- [ ] Style: `rounded-lg p-4 border`, warna bg dari `-50` scale, teks dari `-700` scale (light mode)
- [ ] Dark mode: bg dari `-900/20` scale, border dari `-700/30`, teks tetap readable

### D — Margin & Padding

- [ ] `<main>` di `admin.vue` memiliki padding `px-5 py-6` — semua halaman otomatis mengikuti
- [ ] UI Preview: hapus `max-w-[1100px] mx-auto` dan `sm:px-8` — ganti dengan wrapper standar tanpa max-width
- [ ] Dashboard: tidak ada padding tambahan di level halaman (cukup dari `<main>`)
- [ ] Padding sama di layar kecil (non-mobile, ~768px) dan layar besar (>1280px) — tidak ada perubahan px responsif

### E — Light/Dark Theme

- [ ] Light mode adalah default (colorMode.defaultValue: 'light' — dari fix_005)
- [ ] Sidebar: `bg-white dark:bg-neutral-950` — putih di light, hampir hitam di dark
- [ ] Konten area: `bg-neutral-50 dark:bg-neutral-850`
- [ ] Navbar: `bg-white/95 dark:bg-neutral-900/95`
- [ ] Semua teks memiliki dark: variant: label grup sidebar, nav item, breadcrumb, input placeholder
- [ ] Toggle theme bekerja: klik Sun/Moon → halaman langsung berganti tema

### F — Hero Card Button

- [ ] Tombol pertama hero card di Dashboard berubah: `Lihat Dashboard` → `Mulai Eksplorasi`
- [ ] Icon berubah dari `LayoutDashboard` → `Rocket`
- [ ] Style tombol tidak berubah (tetap solid brand blue)

### G — Toast Style

- [ ] Background toast berwarna sesuai tone (bukan putih polos):
  - success: bg-success-50 / dark: bg-success-900/30
  - danger: bg-danger-50 / dark: bg-danger-900/30
  - warning: bg-warning-50 / dark: bg-warning-900/30
  - info: bg-brand-50 / dark: bg-brand-900/30
- [ ] Border lebih tebal: `border-2` (bukan border-1)
- [ ] Border warna sesuai tone: success-200, danger-200, warning-200, brand-200 (dark: versi -600/50)
- [ ] Icon lebih besar: `w-5 h-5` dengan container centered secara vertikal (`items-center`)
- [ ] Tombol close (X) juga vertically centered (`self-start` → ganti `self-center` atau `mt-0`)
- [ ] Stack mode: peek toast kedua lebih terlihat — `top: 10px; scale: 0.94; opacity: 0.6`
      dan peek ketiga `top: 18px; scale: 0.88; opacity: 0.3`
- [ ] Hover area toast → expand semua toast terlihat penuh, smooth transition 200ms

### H — Notification Dropdown Bug

- [ ] Klik bell icon membuka Popover notifikasi tanpa error
- [ ] Popover muncul di bawah bell icon, tidak terpotong layar, z-index benar
- [ ] 3 dummy item tampil dengan benar
- [ ] Link "Lihat Semua Notifikasi" dapat diklik
- [ ] Popover tertutup saat klik di luar area

### I — Alert & Badge Dark Mode

- [ ] Alert success dark mode: `dark:bg-success-900/30 dark:border-success-600/40 dark:text-success-300`
- [ ] Alert danger dark mode: `dark:bg-danger-900/30 dark:border-danger-600/40 dark:text-danger-300`
- [ ] Alert warning dark mode: `dark:bg-warning-900/30 dark:border-warning-600/40 dark:text-warning-300`
- [ ] Alert info dark mode: `dark:bg-brand-900/30 dark:border-brand-600/40 dark:text-brand-300`
- [ ] Badge warna tidak pucat di dark mode — menggunakan opacity atau tone yang lebih vibrant

### J — Logo Centering Collapsed

- [ ] Saat sidebar collapsed (w-16), logo icon berada tepat di tengah secara horizontal
- [ ] Logo container menggunakan `justify-center` dan `w-full` saat collapsed

### K — Sidebar Scrollbar

- [ ] Scrollbar sidebar tidak terlihat (hidden secara visual) di semua browser
- [ ] Konten sidebar masih bisa discroll jika melebihi tinggi layar

### L — Profile: Navbar → Sidebar

- [ ] Avatar + DropdownMenu DI HAPUS dari kanan atas navbar (reversal dari fix_005 Section D)
- [ ] Sidebar footer memiliki shadow pemisah di bagian atas: `shadow-[0_-4px_12px_rgba(0,0,0,0.06)]`
- [ ] Sidebar footer: avatar + nama + role — klik area ini → navigate ke `/profile`
- [ ] Logout button (LogOut icon) ada di sidebar footer, di kanan (jika expanded) atau di bawah avatar (jika collapsed)
- [ ] Header logo sidebar (area MyPartner): NuxtLink to="/settings" — sudah ada, pastikan berfungsi
- [ ] Sidebar footer avatar nama: NuxtLink to="/profile" — pastikan berfungsi
- [ ] Navbar setelah perubahan: [DateTime] [Breadcrumb] | [Search] [Bell] [Settings] [Theme] [Lang]
      — tidak ada avatar di ujung kanan

### M — Card Highlight (Gradient)

- [ ] Komponen Card Highlight ada di Dashboard: 1 card, full-width atau di atas grid stat cards
- [ ] Komponen Card Highlight ada di UI Preview: 1 card dalam section baru "Card Highlight"
- [ ] Background: gradient `from-brand-600 to-brand-900` (deep blue) atau `from-neutral-800 to-brand-900`
- [ ] Teks: putih (white)
- [ ] Hover: `hover:from-brand-500 hover:to-brand-800` dengan `transition-all duration-300`
      atau subtle scale: `hover:scale-[1.01]`
- [ ] Content: badge pill kecil + judul besar (Kanit) + subtitle + tombol kecil
- [ ] Dark mode: gradient tetap tampil baik (tidak berubah, sudah dark by nature)

---

## Files to Create

- `app/composables/useDateTime.ts` — live clock dengan format Indonesia + WIB

## Files to Modify

- `app/layouts/admin.vue` — datetime di navbar, hapus avatar, profile → sidebar footer,
  logo center saat collapsed, hide scrollbar
- `app/pages/dashboard/index.vue` — button rename, stat card enhancement, card highlight
- `app/pages/ui-preview/index.vue` — section info box, section card highlight, fix container padding
- `app/assets/css/globals.css` — scrollbar hide, alert dark mode colors
- `app/app.vue` — toast style revision (border, color, icon size, stack visibility)

---

## Implementation Notes

### A — useDateTime Composable

```
app/composables/useDateTime.ts:

- ref now = new Date()
- onMounted: setInterval(() => now.value = new Date(), 1000)
- onUnmounted: clearInterval
- computed formatted: toLocaleDateString('id-ID', { weekday:'long', day:'numeric',
  month:'long', year:'numeric' }) + ' | ' + toLocaleTimeString('id-ID') + ' WIB'
```

Di `admin.vue`, tampilkan di sisi KIRI navbar, sebagai baris PERTAMA (di atas breadcrumb):

```html
<div class="flex flex-col justify-center mr-4">
  <span class="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium leading-none mb-1">
    {{ dateTime.formatted }}
  </span>
  <!-- breadcrumb tetap ada di bawahnya -->
  <div class="flex items-center gap-2 text-sm ...breadcrumb...</div>
</div>
```

---

### B — Stat Card Enhancement

Perubahan di `dashboard/index.vue`:

1. Icon container: `w-10 h-10` → `w-12 h-12` (dan icon `w-5 h-5` → `w-6 h-6`)

2. Tambah dekorasi sparkline SVG di sudut kanan bawah card (static, dekoratif):
   - Setiap card memiliki varian sparkline berbeda (naik, turun, atau datar)
   - Warna: sesuai iconColor card (misal brand-200 untuk Total Klien)
   - Ukuran: `w-20 h-10`, `absolute bottom-4 right-4 opacity-20`
   - Gunakan SVG polyline dengan beberapa path poin

Contoh sparkline naik (untuk stat up):

```html
<svg class="absolute bottom-4 right-4 w-20 h-10 opacity-20" viewBox="0 0 80 40">
  <polyline
    points="0,35 20,28 40,20 60,10 80,4"
    fill="none"
    :stroke="stat.iconColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
```

Turunkan card ke `relative overflow-hidden` agar sparkline tidak keluar batas.

---

### C — Info Box (UI Preview)

Tambah section baru di `ui-preview/index.vue` setelah section Alert yang ada:

```
Section header: "Info Box"
Subtitle: "Komponen notifikasi inline untuk pesan kontekstual"

4 varian dalam grid 2x2 atau stack vertikal:
- Info    → bg-brand-50   border-l-4 border-brand-500 → icon: Info (brand-500)
- Success → bg-success-50 border-l-4 border-success-500 → icon: CheckCircle
- Warning → bg-warning-50 border-l-4 border-warning-500 → icon: AlertTriangle
- Danger  → bg-danger-50  border-l-4 border-danger-500  → icon: AlertCircle
```

Struktur satu item:

```html
<div
  class="flex items-start gap-3 p-4 rounded-lg border border-l-4 [border-color] [bg-color]"
>
  <Icon class="w-5 h-5 flex-shrink-0 mt-0.5 [text-color]" />
  <div>
    <p class="text-sm font-semibold [text-color]">Judul Info Box</p>
    <p class="text-sm [text-muted] mt-0.5">
      Pesan deskriptif untuk memberikan konteks kepada pengguna.
    </p>
  </div>
  <button
    class="ml-auto flex-shrink-0 [text-muted] hover:[text-color] transition-colors"
  >
    <X class="w-4 h-4" />
  </button>
</div>
```

Dark mode: bg-[tone]-900/20, border-[tone]-600/40, text-[tone]-300.

---

### D — Margin & Padding

Di `admin.vue`, ubah `<main>`:

```html
<!-- SEBELUM -->
<main class="flex-1">
  <!-- SESUDAH -->
  <main class="flex-1 px-5 py-6"></main>
</main>
```

Di `ui-preview/index.vue`, hapus wrapper `max-w-[1100px] mx-auto px-5 sm:px-8 py-8`
dari pembungkus luar. Biarkan konten mengalir langsung dengan padding dari `<main>`.
Pastikan setiap `section` punya `space-y-16` atau serupa antar section.

Di `dashboard/index.vue`, pastikan tidak ada padding tambahan di wrapper terluar
(cukup `class="space-y-8"` atau serupa, tanpa `px-` yang menduplikasi).

---

### E — Theme Audit

Audit `admin.vue` menyeluruh. Setiap elemen harus punya dark: variant. Checklist:

- Group label sidebar: `text-neutral-400 dark:text-neutral-500` ✓ (verifikasi)
- Nav item inactive: `text-neutral-600 dark:text-neutral-400` ✓ (verifikasi)
- Nav item hover: `hover:bg-neutral-100 dark:hover:bg-white/5` ✓ (verifikasi)
- Sidebar border: `border-neutral-200 dark:border-white/10` ✓ (verifikasi)
- Input search: `bg-neutral-100 dark:bg-neutral-800` ✓ (verifikasi)

Jika ada class yang hardcode warna tanpa dark: variant → tambahkan.

Verifikasi `nuxt.config.ts` sudah ada `defaultValue: 'light'` (dari fix_005).

---

### F — Hero Button

Di `dashboard/index.vue`, temukan:

```
<LayoutDashboard class="w-4 h-4" /> Lihat Dashboard
```

Ganti dengan:

```
<Rocket class="w-4 h-4" /> Mulai Eksplorasi
```

Import `Rocket` dari `lucide-vue-next`. Hapus import `LayoutDashboard` jika tidak dipakai lagi.

---

### G — Toast Revision (app.vue)

**Border:** ganti `border` → `border-2`. Tambah warna border dinamis per tone:

- success: `border-success-300 dark:border-success-600/60`
- danger: `border-danger-300 dark:border-danger-600/60`
- warning: `border-warning-300 dark:border-warning-600/60`
- info: `border-brand-300 dark:border-brand-600/60`

**Icon:** bungkus icon dalam container `flex-shrink-0 flex items-center self-stretch`:

```html
<div class="flex-shrink-0 flex items-center">
  <component
    :is="t.icon"
    class="w-5 h-5"
    :style="{ color: toastColor[t.tone] }"
  />
</div>
```

**Close button:** tambahkan `self-center` pada button (hapus `flex-shrink-0` isolasi), pastikan `mt-0`.

**Stack visibility:** perbarui style index:

- index 0: `{ top: 0, zIndex: toasts.length, transform: 'none', opacity: 1 }`
- index 1: `{ top: '10px', zIndex: toasts.length - 1, transform: 'scale(0.94)', opacity: 0.6 }`
- index 2+: `{ top: '18px', zIndex: toasts.length - 2, transform: 'scale(0.88)', opacity: 0.3 }`

---

### H — Notification Bug Fix

Checklist debug yang harus dilakukan executor:

1. Pastikan `Popover`, `PopoverTrigger`, `PopoverContent` diimport dengan benar dari `@/components/ui/popover`
2. Pastikan `<PopoverTrigger as-child>` membungkus button (jangan nested trigger)
3. Pastikan `<PopoverContent>` punya `align="end"` dan `side="bottom"` agar muncul di bawah kanan
4. Pastikan z-index popover > navbar (`z-50` minimum)
5. Jika masih bug: cek shadcn-vue popover versi — pastikan `@radix-vue` tidak konflik
6. Test: klik bell → popover terbuka, klik di luar → tutup

---

### I — Alert & Badge Dark Mode

Di `ui-preview/index.vue` dan semua tempat alert dipakai:
Perbarui dark mode classes agar lebih vibrant (bukan terlalu pucat):

```
Alert success dark:
  bg-success-900/30 → bg-success-800/40
  border-success-700/30 → border-success-600/50
  text: dark:text-success-300

Alert danger dark:
  bg-danger-800/40, border-danger-600/50, dark:text-danger-300

Alert warning dark:
  bg-warning-800/40, border-warning-600/50, dark:text-warning-300

Alert info dark:
  bg-brand-800/40, border-brand-600/50, dark:text-brand-300
```

Badge (shadcn badge atau custom): di dark mode gunakan opacity-based yang lebih visible:

- Badge success: `dark:bg-success-500/20 dark:text-success-300 dark:border-success-500/30`
- Badge danger: `dark:bg-danger-500/20 dark:text-danger-300 dark:border-danger-500/30`
- dst.

---

### J — Logo Centering (Collapsed)

Di `admin.vue`, temukan logo area header sidebar:

```html
<div class="flex items-center gap-2.5 px-5 h-16 border-b...">
  <NuxtLink to="/settings" class="flex items-center gap-2.5 ..."></NuxtLink>
</div>
```

Tambahkan kondisi saat collapsed:

```html
<div
  class="flex items-center h-16 border-b flex-shrink-0"
  :class="isCollapsed ? 'justify-center px-0' : 'px-5 gap-2.5'"
>
  <NuxtLink
    to="/settings"
    class="flex items-center focus-visible:outline-none..."
    :class="isCollapsed ? 'justify-center w-full' : 'gap-2.5'"
  >
    <!-- Logo icon: selalu centered saat collapsed -->
    <div
      class="grid place-items-center w-9 h-9 rounded-lg bg-brand-500 shadow-brand flex-shrink-0"
    >
      <img ... />
    </div>
    <!-- Label: hanya jika tidak collapsed -->
    <div v-if="!isCollapsed" class="leading-tight..."></div
  ></NuxtLink>
</div>
```

---

### K — Sidebar Scrollbar

Di `globals.css`, tambahkan:

```css
/* Sembunyikan scrollbar sidebar secara visual */
.mp-scroll {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 11 */
}
.mp-scroll::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}
```

Di `admin.vue`, pastikan nav masih punya class `mp-scroll` dan `overflow-y-auto`
(bukan overflow-hidden) agar konten bisa discroll tanpa scrollbar terlihat:

```html
<nav
  class="flex-1 px-3 py-4 space-y-6 overflow-y-auto mp-scroll flex flex-col min-h-0"
></nav>
```

`min-h-0` diperlukan agar flex child bisa scroll di dalam flex container.

---

### L — Profile: Navbar → Sidebar Bottom

**Hapus dari navbar:**
Temukan dan hapus seluruh blok Avatar + DropdownMenu yang ditambahkan di fix_005 Section D.
Navbar kembali berakhir di Language switcher.

**Perbarui sidebar footer:**

```html
<div
  class="flex-shrink-0 border-t border-neutral-200 dark:border-white/10"
  style="box-shadow: 0 -4px 12px rgba(0,0,0,0.06);"
>
  <!-- Profile row: klik → /profile -->
  <NuxtLink
    to="/profile"
    class="flex items-center gap-3 px-4 py-3 transition-colors
           hover:bg-neutral-100 dark:hover:bg-white/5"
  >
    <!-- Avatar -->
    <div
      class="w-9 h-9 rounded-full grid place-items-center font-bold text-sm flex-shrink-0
                bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300"
    >
      {{ userInitials }}
    </div>

    <!-- Nama & Role (jika expanded) -->
    <div v-if="!isCollapsed" class="leading-tight min-w-0 flex-1">
      <div
        class="text-sm font-semibold truncate text-ink dark:text-neutral-100"
      >
        {{ userName }}
      </div>
      <div class="text-xs truncate text-neutral-500 dark:text-neutral-400">
        {{ userRole }}
      </div>
    </div>

    <!-- Logout button (jika expanded) -->
    <button
      v-if="!isCollapsed"
      class="ml-auto text-neutral-400 hover:text-danger-500 transition-colors flex-shrink-0
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
      @click.prevent.stop="logout"
    >
      <LogOut class="w-4 h-4" />
    </button>
  </NuxtLink>

  <!-- Logout icon solo saat collapsed -->
  <button
    v-if="isCollapsed"
    class="w-full flex justify-center py-2 text-neutral-400 hover:text-danger-500 transition-colors
           focus-visible:outline-none"
    @click="logout"
  >
    <LogOut class="w-4 h-4" />
  </button>
</div>
```

Pastikan `logout()` function tetap ada di script.

---

### M — Card Highlight

**Definisi style Card Highlight:**

```
bg: gradient-to-br from-brand-600 to-brand-900
text: white
border: none
hover: from-brand-500 to-brand-800 + scale-[1.01] transition-all duration-300
padding: p-6 atau p-7
border-radius: rounded-2xl
```

**Di `dashboard/index.vue`:**
Tambahkan 1 Card Highlight di ATAS grid stat cards (sebelum `<div class="grid...">`):

```html
<!-- Card Highlight -->
<div
  class="relative overflow-hidden rounded-2xl p-6 text-white cursor-pointer
            transition-all duration-300 group
            bg-gradient-to-br from-brand-600 to-brand-900
            hover:from-brand-500 hover:to-brand-800 hover:scale-[1.01]"
>
  <!-- Stripe dekorasi (sama seperti hero card tapi lebih subtle) -->
  <div
    class="absolute inset-0 opacity-[0.04]"
    style="background-image:repeating-linear-gradient(115deg,#fff 0 14px,transparent 14px 40px);"
  />
  <div class="relative">
    <div
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10
                text-white/80 text-[10px] font-semibold tracking-wide mb-3"
    >
      <TrendingUp class="w-3 h-3" /> BULAN INI
    </div>
    <div
      class="text-3xl font-bold tracking-tight"
      style="font-family:'Kanit',sans-serif"
    >
      Rp 48.200.000
    </div>
    <div class="mt-1 text-sm text-white/70">
      Total nilai kontrak aktif Partnership
    </div>
  </div>
</div>
```

**Di `ui-preview/index.vue`:**
Tambah section baru "Card Highlight":

- Section header: "Card Highlight"
- Subtitle: "Card dengan background gradasi untuk metric utama"
- Tampilkan 1 contoh Card Highlight (gunakan konten dummy yang sama)

---

## Execution Order

```
1. Create useDateTime.ts composable (Section A)
2. Edit admin.vue:
   a. Import useDateTime, tambah datetime ke navbar kiri (Section A)
   b. Hapus Avatar+DropdownMenu dari navbar (Section L)
   c. Perbarui sidebar footer → NuxtLink /profile + logout button (Section L)
   d. Fix logo centering saat collapsed (Section J)
   e. Tambah min-h-0 + overflow-y-auto + mp-scroll pada nav (Section K)
   f. Theme audit: verifikasi semua dark: variants (Section E)
3. Edit globals.css:
   a. Tambah .mp-scroll scrollbar-width: none rules (Section K)
   b. Perbarui alert dark mode colors (Section I)
4. Edit dashboard/index.vue:
   a. Ganti button "Lihat Dashboard" → "Mulai Eksplorasi" + Rocket (Section F)
   b. Tambah Card Highlight di atas stat cards (Section M)
   c. Enhance stat cards: bigger icon, sparkline SVG (Section B)
5. Edit app.vue: perbarui toast border, icon size, close btn, stack visibility (Section G)
6. Edit ui-preview/index.vue:
   a. Hapus max-w-[1100px] mx-auto dari wrapper, sesuaikan padding (Section D)
   b. Tambah section Info Box (Section C)
   c. Tambah section Card Highlight (Section M)
   d. Perbarui alert/badge dark mode colors (Section I)
7. Debug dan fix notification dropdown (Section H)
8. Jalankan pnpm dev — verifikasi semua acceptance criteria, report ke Planner
```

---

## Completion

Jalankan `pnpm dev`, verifikasi **semua** acceptance criteria terpenuhi.  
Laporkan hasil ke Planner dalam format:

```
✅ / ❌  [item dari acceptance criteria]
```

No screenshots — Planner melakukan visual review sendiri.
