# Fix 005 — Admin Shell Completeness

**Depends on:** fix_004 selesai ✅  
**Shell:** PowerShell (Windows)  
**Reference:** `public/ui-kit-reference.html` — buka saat eksekusi  
**Rules:** `.plan/rules/frontend.md` — baca penuh sebelum mulai

---

## Goal

Melengkapi navbar dengan 3 elemen yang hilang (notification popover, settings button,
profile avatar + dropdown), memperbaiki 3 bug eksisting, menetapkan light mode sebagai
default, merevisi toast system (warna, posisi, stack behavior), dan menghapus item
Notifikasi dari sidebar. JANGAN ubah elemen yang sudah benar.

---

## Acceptance Criteria

- [ ] Default theme adalah LIGHT saat pertama load (bukan mengikuti sistem OS)
- [ ] Klik bell notification → Popover terbuka dengan 3 dummy item + footer "Lihat Semua Notifikasi"
- [ ] Settings icon button muncul di navbar (antara bell dan theme toggle)
- [ ] Avatar lingkaran (inisial user) muncul di paling kanan navbar
- [ ] Klik avatar → DropdownMenu: nama+role header (disabled), Profil Saya, Pengaturan, separator, Keluar
- [ ] Logout HANYA dapat diakses via navbar dropdown — logout icon di sidebar footer DIHAPUS
- [ ] Keuangan sub-menu tertutup secara default, hanya terbuka saat chevron diklik
- [ ] Sub-menu accordion menggunakan transisi smooth (bukan class `max-h-[200ms]` yang salah)
- [ ] Toast muncul di kanan atas (top-5 right-5)
- [ ] Warna background toast sesuai tone: success=hijau, danger=merah, warning=oranye, info=biru
- [ ] Saat ada multiple toast: tersusun menumpuk (stack), hanya toast terbaru terlihat penuh
- [ ] Saat hover area toast: semua toast expand ke bawah secara urut dengan jarak antar item
- [ ] Item "Notifikasi" dihapus dari sidebar nav — notifikasi HANYA via bell icon di navbar
- [ ] `pnpm dev` zero errors, zero console warnings

---

## Files to Modify

- `nuxt.config.ts` — tambah `defaultValue: 'light'` ke colorMode
- `app/layouts/admin.vue` — 7 perubahan: notification popover, settings button, navbar avatar dropdown, hapus logout sidebar, perbaiki sub-menu bug + accordion, hapus Notifikasi dari nav array
- `app/app.vue` — revisi toast: posisi top-right, colored bg, stack + expand on hover

---

## Implementation Notes

### A — Default Theme (nuxt.config.ts)

Ubah config `colorMode`:

```
colorMode: {
  classSuffix: '',
  defaultValue: 'light',
}
```

Tidak ada perubahan lain pada file ini.

---

### B — Navbar: Notification Popover

Ganti plain Bell `<button>` yang ada sekarang dengan shadcn `Popover`.
Komponen yang diimport: `Popover`, `PopoverTrigger`, `PopoverContent`.

**Trigger:** Bell button (pertahankan style yang ada — w-10 h-10, badge merah).

**Konten Popover (`w-80 p-0`, `side="bottom"`, `align="end"`):**

```
Header (px-4 py-3 border-b):
  - "Notifikasi" → text-sm font-semibold text-ink dark:text-neutral-100
  - "Tandai semua dibaca" → text-xs text-brand-500 hover:underline (ml-auto)

3 dummy item (px-4 py-3 border-b hover:bg-neutral-50 dark:hover:bg-neutral-800):
  Item 1: [Bell icon — brand-500] | judul: "Permintaan baru" | sub: "Pre-Sales dari PT Maju Bersama" | waktu: "2 mnt lalu" | dot biru (unread)
  Item 2: [CheckCircle — success-500] | judul: "Dokumen disetujui" | sub: "SK-2026-0023 telah disetujui" | waktu: "1 jam lalu" | dot biru (unread)
  Item 3: [AlertCircle — warning-500] | judul: "Stok kritis" | sub: "HP ProBook 450 tersisa 2 unit" | waktu: "3 jam lalu" | (tidak ada dot — sudah dibaca)

Footer (px-4 py-3 text-center):
  NuxtLink to="/notifications":
  "Lihat Semua Notifikasi" — text-sm text-brand-600 hover:text-brand-700 font-medium
```

Item layout: `flex items-start gap-3`

- Kiri: icon container `w-8 h-8 rounded-full grid place-items-center` dengan bg sesuai tipe
- Tengah: flex-1, judul `text-sm font-medium`, sub `text-xs text-neutral-500`, waktu `text-[10px] text-neutral-400 mt-0.5`
- Kanan: dot `w-2 h-2 rounded-full bg-brand-500` (hanya jika unread)

---

### C — Navbar: Settings Button

Tambahkan antara Notification Popover dan Theme toggle:

```html
<button
  class="grid place-items-center w-10 h-10 rounded-md hover:bg-neutral-100
         dark:hover:bg-neutral-800 transition-colors flex-shrink-0
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
  @click="addToast('Coming Soon', 'Halaman pengaturan segera hadir.', 'info')"
>
  <Settings class="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
</button>
```

Import `Settings` dari `lucide-vue-next`. Import `useToast` sudah tersedia via composable.

---

### D — Navbar: Profile Avatar + DropdownMenu

Tambahkan di PALING KANAN navbar (setelah language switcher).

Komponen yang diimport dari shadcn:
`DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`,
`DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`

**Trigger — Avatar:**

```html
<DropdownMenuTrigger as-child>
  <button
    class="grid place-items-center w-9 h-9 rounded-full font-bold text-sm
                 bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300
                 hover:ring-2 hover:ring-brand-500/30 transition-all flex-shrink-0
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
  >
    {{ userInitials }}
  </button>
</DropdownMenuTrigger>
```

**Content (`align="end"`, `class="w-56"`):**

```
DropdownMenuLabel (tidak bisa diklik):
  - userName → text-sm font-semibold
  - userRole → text-xs text-neutral-500

DropdownMenuSeparator

DropdownMenuItem → NuxtLink to="/profile":
  User icon + "Profil Saya"

DropdownMenuItem → NuxtLink to="/settings":
  Settings icon + "Pengaturan"

DropdownMenuSeparator

DropdownMenuItem (text-danger-600, @click="logout"):
  LogOut icon + "Keluar"
```

---

### E — Sidebar Footer: Hapus Logout

Di sidebar footer, hapus HANYA blok ini:

```html
<!-- Logout icon -->
<button v-if="!isCollapsed" class="..." @click="logout">
  <LogOut class="w-4 h-4" />
</button>
```

Sidebar footer tetap menampilkan: avatar kecil + nama + role.
Jangan hapus elemen lain di sidebar footer.

LogOut icon import TETAP ada (masih dipakai di navbar dropdown). Jangan hapus import.

---

### F — Sidebar: Perbaiki Sub-menu Bug

Temukan baris:

```
v-show="!isCollapsed && (isKeuanganOpen || item.disabled)"
```

Ubah menjadi:

```
v-show="!isCollapsed && isKeuanganOpen"
```

Default `isKeuanganOpen = ref(false)` sudah benar — tidak perlu diubah.

---

### G — Accordion: Perbaiki Transisi

Temukan class yang mengandung `max-h-[200ms]` pada wrapper sub-items dan ganti
implementasinya menjadi transisi yang benar menggunakan dynamic style binding:

```html
<div
  class="overflow-hidden transition-all duration-200 space-y-1 mt-1"
  :style="{ maxHeight: isKeuanganOpen ? '200px' : '0px' }"
>
  <!-- sub items disini — hapus v-show dari div ini, gunakan maxHeight binding saja -->
</div>
```

Hapus `v-show` dari div wrapper ini karena `maxHeight: 0` sudah menyembunyikannya.

---

### H — Toast System Revision (app.vue)

**H1 — Posisi:** Ganti `bottom-5 right-5` → `top-5 right-5` di container toast.

**H2 — Warna background per tone:**

Ganti class `bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700`
dengan kelas dinamis berdasarkan `t.tone`:

```
success → bg-success-50  border-success-200  dark:bg-success-900/20  dark:border-success-700/30
danger  → bg-danger-50   border-danger-200   dark:bg-danger-900/20   dark:border-danger-700/30
warning → bg-warning-50  border-warning-200  dark:bg-warning-900/20  dark:border-warning-700/30
info    → bg-brand-50    border-brand-200    dark:bg-brand-900/20    dark:border-brand-700/30
```

Teks judul toast: `text-ink dark:text-neutral-100` (tetap gelap — bisa dibaca di bg terang).
Teks body toast: `text-neutral-600 dark:text-neutral-400`.

**H3 — Stack + Expand on Hover:**

Tambahkan `ref isToastExpanded = ref(false)` di `<script setup>`.

Struktur container:

```
<div
  class="fixed top-5 right-5 z-50 w-80 pointer-events-none"
  @mouseenter="isToastExpanded = true"
  @mouseleave="isToastExpanded = false"
>
```

Wrap TransitionGroup dengan div yang mengatur mode:

**Mode stacked (isToastExpanded = false, toasts.length > 1):**

- Container: `position: relative`, height = tinggi satu toast (~80px)
- Setiap toast: `position: absolute; width: 100%`
- Index 0 (terbaru): `top: 0; z-index: tinggi; transform: none; opacity: 1`
- Index 1: `top: 8px; z-index: -1; transform: scale(0.96); opacity: 0.7`
- Index 2+: `top: 14px; z-index: -2; transform: scale(0.92); opacity: 0`

**Mode expanded (isToastExpanded = true, atau hanya 1 toast):**

- Container: normal flow (tidak absolute)
- Toasts: `position: relative; margin-bottom: 10px`
- Semua toast terlihat penuh, urut dari atas ke bawah (terbaru di atas)

Gunakan computed style binding per index untuk menerapkan style dinamis.
Transisi semua properti: `transition: all 0.2s ease`.

Perhatian:

- `pointer-events-none` pada container, `pointer-events-auto` pada setiap toast item
  (agar hover container terdeteksi dan tombol dismiss bisa diklik)
- `@mouseenter`/`@mouseleave` pada container luar — bukan pada setiap item

---

### I — Hapus Notifikasi dari Sidebar

Di array `navigation` dalam `admin.vue`, temukan objek item:

```js
{ id: 'notifications', label: 'Notifikasi', icon: Bell, badge: '3' }
```

dan **hapus baris ini** dari group pertama (Intelligence, tanpa label).

Setelah dihapus, bersihkan juga conditional rendering yang mereferensikan `item.id === 'notifications'`:

- Bagian collapsed dot: `v-if="isCollapsed && item.id === 'notifications'"` → hapus blok `<span>` ini
- Bagian badge number: `v-if="item.id === 'notifications'"` pada badge danger → hapus kondisi khusus ini,
  atau sederhanakan: semua badge non-disabled cukup gunakan satu style badge "Segera" yang uniform

Import `Bell` dari lucide TETAP ada — masih dipakai untuk trigger Popover di navbar.

---

## Navbar Element Order (Final)

```
[Breadcrumb]  ←kiri                   kanan→  [Search] [Bell] [Settings] [Theme] [Lang] [Avatar]
```

---

## Execution Order

```
1. Ubah nuxt.config.ts (colorMode defaultValue: 'light')
2. Edit admin.vue:
   a. Import komponen baru: Settings, Popover/*, DropdownMenu/*
   b. Import useToast (jika belum)
   c. Hapus item Notifikasi dari navigation array (Section I)
   d. Bersihkan conditional rendering notifications (Section I)
   e. Ganti Bell button → Popover (Section B)
   f. Tambah Settings button (Section C)
   g. Tambah Avatar + DropdownMenu (Section D)
   h. Hapus logout dari sidebar footer (Section E)
   i. Fix v-show condition sub-menu (Section F)
   j. Fix accordion transition (Section G)
3. Edit app.vue: revisi toast system (Section H) — posisi, warna, stack behavior
4. Jalankan pnpm dev — verifikasi semua criteria, report ke Planner
```

---

## Completion

Jalankan `pnpm dev`, verifikasi **semua** acceptance criteria terpenuhi.  
Laporkan hasil ke Planner dalam format:

```
✅ / ❌  [item dari acceptance criteria]
```

No screenshots — Planner melakukan visual review sendiri.
