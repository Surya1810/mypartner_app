# Fix 008 — Toast, DateTime, Title & Menu

**Depends on:** fix_007 selesai ✅  
**Shell:** PowerShell (Windows)  
**Reference:** Screenshot toast merah (Gagal memuat batas penarikan saldo) — gunakan sebagai ground truth visual untuk toast style  
**Rules:** `.plan/rules/frontend.md` — baca penuh sebelum mulai

---

## Goal

Perbaiki style toast agar sesuai referensi (outline berwarna, tanpa tombol close, stack
terlihat), pindahkan datetime ke kanan navbar dengan style lebih bersih, tambahkan page
title template, tambahkan menu Pengumuman, dan perbaiki icon vertikal notifikasi dropdown.

---

## Acceptance Criteria

### A — Menu Pengumuman

- [ ] Item "Pengumuman" ada di bagian PALING BAWAH grup Operasional
- [ ] Status: disabled (on-hold), badge "Segera", pointer-events-none
- [ ] Icon: `Megaphone` dari lucide-vue-next
- [ ] Route: `/announcements` (tidak aktif)

### B — Page Title Template

- [ ] Tab browser menampilkan: `Dashboard | MyPartner by Partnership`
- [ ] Format: `{Nama Halaman} | MyPartner by Partnership`
- [ ] Jika tidak ada title set: `MyPartner by Partnership`
- [ ] Semua halaman yang ada (dashboard, ui-preview, dll) sudah set title masing-masing

### C — DateTime Relocation & Style

- [ ] DateTime dipindah ke KANAN navbar, tepat SEBELUM bell icon
- [ ] DateTime DIHAPUS dari posisi kiri navbar (tidak ada lagi di kiri)
- [ ] Format: `Rabu, 24 Juni 2026 | [11:12:58]`
- [ ] "Rabu, 24 Juni 2026" — style: `text-sm font-semibold text-neutral-700 dark:text-neutral-300`
- [ ] "|" separator — style: `text-neutral-300 dark:text-neutral-600 mx-1.5`
- [ ] "11:12:58" — dalam badge: `font-mono text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 tabular-nums`
- [ ] Waktu terupdate setiap detik

### D — Toast Style (Ground Truth: Screenshot Referensi)

- [ ] Background: tone-50 (light colored, bukan putih)
- [ ] Border: `border` (1px) dengan warna `border-[tone]-300` — BUKAN hitam, BUKAN border-2
- [ ] Icon: menggunakan ikon yang sesuai tone:
  - success → `CheckCircle` (warna success-500)
  - danger → `XCircle` (warna danger-500)
  - warning → `AlertTriangle` (warna warning-500)
  - info → `Info` (warna brand-500)
- [ ] Icon: `w-5 h-5`, vertically centered dengan teks (`items-center` pada container)
- [ ] Teks pesan: `text-sm font-medium text-[tone]-800 dark:text-[tone]-200`
- [ ] Tombol close (X) DIHAPUS — tidak ada tombol dismiss
- [ ] Shadow: `shadow-md` (lebih terasa dibanding shadow-lift yang terlalu subtle)
- [ ] Padding: `px-4 py-3` (kompak, tidak terlalu tinggi)
- [ ] Alert dan Info Box di ui-preview: border warna matching tone (bukan default hitam), terapkan style yang sama

### D2 — Toast Stack Style

- [ ] Stack collapsed: toast kedua peek terlihat jelas di bawah toast pertama
  - Index 0 (terbaru): `top: 0, scale: 1, opacity: 1, z-index: tinggi`
  - Index 1: `top: 10px, scale: 0.93, opacity: 0.65`
  - Index 2+: `top: 18px, scale: 0.86, opacity: 0.35`
- [ ] Container stacked: `relative`, height cukup untuk menampilkan peek (min-height: ~16px lebih tinggi dari 1 toast)
- [ ] Stack expanded (hover): `gap-2.5 flex flex-col` — semua toast terlihat full dengan jarak
- [ ] Transition: `transition-all duration-200 ease-out` pada setiap item
- [ ] Di ui-preview ada 4 tombol trigger toast (Success, Error, Warning, Info) untuk test

### E — Notification Dropdown: Icon Vertical Center

- [ ] Icon container kiri setiap item notifikasi menggunakan `self-center` (bukan `self-start`)
- [ ] Teks multi-line di kanan tetap rata atas (tidak terpengaruh)
- [ ] Test: item dengan sub-teks panjang — icon harus tetap center secara vertikal

### F — Sidebar Logout Button

- [ ] Saat sidebar COLLAPSED: tombol logout TERSEMBUNYI sepenuhnya (tidak ada icon logout)
- [ ] Saat sidebar EXPANDED: tombol logout tampil sebagai baris TERPISAH di bawah profile row
- [ ] Tombol logout expanded: full-width, label teks "Keluar" + icon `LogOut`, mudah diklik
- [ ] Style tombol logout: `px-4 py-2.5`, tampil normal (neutral), hover menjadi danger color
- [ ] Touch target tombol logout: cukup besar dan tidak berdempetan dengan elemen lain

---

## Files to Modify

- `app/layouts/admin.vue` — pindah datetime ke kanan navbar, tambah Pengumuman di nav, fix notif icon, redesign sidebar logout button
- `app/app.vue` — useHead titleTemplate, revisi toast style (hapus tombol close, border warna)
- `app/pages/dashboard/index.vue` — useHead title: 'Dashboard'
- `app/pages/ui-preview/index.vue` — useHead title: 'UI Preview', perbaiki alert & info box border warna
- `app/composables/useDateTime.ts` — pastikan expose `dayFull` (mis. "Rabu, 24 Juni 2026") + `timeStr`

---

## Implementation Notes

### A — Pengumuman Nav Item

Di `admin.vue`, grup Operasional, tambahkan di akhir array `items`:

```js
{ id: 'announcements', label: 'Pengumuman', icon: Megaphone, disabled: true, badge: 'Segera' },
```

Import `Megaphone` dari `lucide-vue-next`. Pastikan ada di posisi PALING BAWAH grup Operasional.

---

### B — Page Title

Di `app/app.vue`, tambahkan di `<script setup>`:

```js
useHead({
  titleTemplate: (title) =>
    title ? `${title} | MyPartner by Partnership` : "MyPartner by Partnership",
});
```

Di setiap halaman, tambahkan:

```js
// dashboard/index.vue
useHead({ title: "Dashboard" });

// ui-preview/index.vue
useHead({ title: "UI Preview" });
```

Untuk halaman-halaman lain yang sudah ada: tambahkan `useHead({ title: 'Nama Halaman' })`.

---

### C — DateTime: Pindah ke Kanan, Style Baru

**Hapus datetime dari kiri navbar** — temukan dan hapus blok datetime yang ada di sisi kiri
(di atas atau sebelum breadcrumb).

**Update `useDateTime.ts`** — pastikan expose dua nilai:

```ts
// "Rabu, 24 Juni 2026"
const dayFull = computed(() =>
  now.value.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
);
// "11:12:58"
const timeStr = computed(() =>
  now.value.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
);
return { dayFull, timeStr };
```

**Template datetime di kanan navbar** (tempatkan SEBELUM `<!-- Notification button -->`):

```html
<!-- DateTime — kanan navbar, sebelum bell -->
<div class="flex items-center gap-1.5 flex-shrink-0">
  <span
    class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap"
  >
    {{ dateTime.dayFull }}
  </span>
  <span class="text-neutral-300 dark:text-neutral-600 select-none">|</span>
  <span
    class="font-mono text-xs px-2 py-0.5 rounded-md tabular-nums
               bg-neutral-100 dark:bg-neutral-800
               text-neutral-600 dark:text-neutral-300"
  >
    {{ dateTime.timeStr }}
  </span>
</div>
```

Navbar order final setelah perubahan:

```
[Breadcrumb] kiri  ←————————————→  [DateTime] [Bell] [Settings] [Theme] [Lang] kanan
```

---

### D — Toast Style

**Di `app.vue`, revisi total template setiap toast item:**

```html
<div
  v-for="(t, i) in toasts"
  :key="t.id"
  class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-md border"
  :class="toastClass[t.tone]"
  :style="getToastStyle(i)"
>
  <component
    :is="t.icon"
    class="w-5 h-5 flex-shrink-0"
    :class="toastIconColor[t.tone]"
  />
  <p class="text-sm font-medium flex-1" :class="toastTextColor[t.tone]">
    {{ t.title }}{{ t.body ? ': ' + t.body : '' }}
  </p>
  <!-- TIDAK ADA tombol close -->
</div>
```

**Hapus `dismissToast` button** dari template toast (tombol X tidak perlu lagi).
Pastikan toast auto-dismiss setelah 4500ms (di useToast.ts).

**Tambahkan di script:**

```js
const toastClass = {
  success:
    "bg-success-50  border-success-300 dark:bg-success-900/30 dark:border-success-600/50",
  danger:
    "bg-danger-50   border-danger-300  dark:bg-danger-900/30  dark:border-danger-600/50",
  warning:
    "bg-warning-50  border-warning-300 dark:bg-warning-900/30 dark:border-warning-600/50",
  info: "bg-brand-50    border-brand-300   dark:bg-brand-900/30   dark:border-brand-600/50",
};
const toastTextColor = {
  success: "text-success-800 dark:text-success-200",
  danger: "text-danger-800  dark:text-danger-200",
  warning: "text-warning-800 dark:text-warning-200",
  info: "text-brand-800   dark:text-brand-200",
};
const toastIconColor = {
  success: "text-success-500",
  danger: "text-danger-500",
  warning: "text-warning-500",
  info: "text-brand-500",
};
```

**Update `useToast.ts`** — icon per tone:

```js
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-vue-next";

const iconMap = {
  success: CheckCircle,
  danger: XCircle,
  warning: AlertTriangle,
  info: Info,
};
```

Pastikan icon yang disimpan ke toast object adalah dari iconMap ini (bukan icon sebelumnya).

---

### D2 — Toast Stack Style

**Fungsi `getToastStyle(index)` di `app.vue`:**

```js
function getToastStyle(i: number) {
  if (isToastExpanded.value || toasts.value.length === 1) {
    return { position: 'relative', transform: 'none', opacity: 1, zIndex: toasts.value.length - i }
  }
  if (i === 0) return { position: 'absolute', top: '0px', width: '100%', transform: 'scale(1)', opacity: 1, zIndex: 30 }
  if (i === 1) return { position: 'absolute', top: '10px', width: '100%', transform: 'scale(0.93) translateX(3.5%)', opacity: 0.65, zIndex: 20 }
  return { position: 'absolute', top: '18px', width: '100%', transform: 'scale(0.86) translateX(7%)', opacity: 0.35, zIndex: 10 }
}
```

`translateX(3.5%)` dan `translateX(7%)` digunakan agar card yang lebih kecil tetap
terlihat di tengah (kompensasi scale shrink).

**Container wrapper** saat stacked (toasts.length > 1 && !isToastExpanded):

```html
<div
  class="relative w-full transition-all duration-200"
  :style="{ minHeight: isToastExpanded || toasts.length <= 1 ? 'auto' : '76px' }"
></div>
```

`76px` ≈ tinggi 1 toast + 18px peek. Sesuaikan jika tinggi toast berbeda.

---

### D3 — Alert & Info Box Border Fix (ui-preview)

Di `ui-preview/index.vue`, temukan semua komponen Alert:

- Ganti `border` default dengan `border border-[tone]-300 dark:border-[tone]-600/50`

Temukan semua Info Box:

- Ganti border `border-l-4 border-[tone]-500` pertahankan (ini sudah benar, hanya `border` outer yang perlu matching)
- Jika ada outer border yang hitam/default, ganti dengan tone-spesifik

Pastikan semua komponen alert/infobox:

- Background: tone-50 (light) / dark: tone-900/30
- Border: matching tone color
- Teks: tone-800 / dark: tone-200
- Icon: tone-500

---

### F — Sidebar Logout Button

Di `admin.vue`, temukan sidebar footer section. Ubah struktur menjadi:

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
  </NuxtLink>

  <!-- Logout button: HANYA tampil saat EXPANDED -->
  <button
    v-if="!isCollapsed"
    class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium
           text-neutral-500 dark:text-neutral-400 transition-colors
           hover:bg-danger-50 dark:hover:bg-danger-900/20
           hover:text-danger-600 dark:hover:text-danger-400
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    @click="logout"
  >
    <LogOut class="w-4 h-4 flex-shrink-0" />
    <span>Keluar</span>
  </button>
</div>
```

Tidak ada logout apapun saat `isCollapsed = true`. User harus expand sidebar untuk logout.
Hapus tombol logout yang sebelumnya berada di dalam profile row (inline dengan avatar).

---

### E — Notification Icon: Vertical Center

Di `admin.vue`, temukan template list item notifikasi di dalam PopoverContent.
Setiap item memiliki struktur seperti:

```html
<div class="flex items-start gap-3 ...">
  <div class="... icon container ...">
    ← tambahkan self-center di sini
    <component :is="..." />
  </div>
  <div class="flex-1 min-w-0">...teks...</div>
</div>
```

Tambahkan `self-center` pada div icon container agar icon berada di tengah vertikal
relatif terhadap tinggi item, bukan selalu di atas.

---

## Execution Order

```
1. admin.vue:
   a. Tambah Megaphone import + Pengumuman nav item (Section A)
   b. Pindahkan datetime ke kanan navbar (Section C) — hapus dari kiri
   c. Redesign sidebar footer: hapus logout inline, buat tombol logout terpisah (Section F)
   d. Update notification item icon: tambah self-center (Section E)
2. useDateTime.ts: expose dayFull + timeStr (Section C)
3. app.vue:
   a. useHead titleTemplate (Section B)
   b. Revisi toast template: hapus close button, styled per tone (Section D)
   c. Update toastClass/toastTextColor/toastIconColor objects (Section D)
   d. Update getToastStyle() untuk stack (Section D2)
4. useToast.ts: update iconMap (XCircle, CheckCircle, dll) (Section D)
5. dashboard/index.vue: useHead({ title: 'Dashboard' }) (Section B)
6. ui-preview/index.vue:
   a. useHead({ title: 'UI Preview' }) (Section B)
   b. Fix alert + info box border colors (Section D3)
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
