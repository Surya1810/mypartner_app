# Fix 009 — Color Scale Completion & Dark Mode Audit

**Depends on:** fix_008 selesai ✅  
**Shell:** PowerShell (Windows)  
**Priority:** HIGH — dark mode colors tidak render sama sekali tanpa ini  
**Rules:** `.plan/rules/frontend.md` — baca penuh sebelum mulai

---

## Goal

Melengkapi scale warna semantic yang hilang di `@theme` (critical — menyebabkan semua
dark mode color pada toast, alert, dan badge tidak tampil), memperbaiki deviasi
implementasi toast dari spec fix_008, dan membersihkan dead code serta TypeScript issues.

---

## Acceptance Criteria

### A — Semantic Color Scale Completion (globals.css)

- [ ] `success-200` sampai `success-400` terdefinisi di `@theme`
- [ ] `success-800` dan `success-900` terdefinisi di `@theme`
- [ ] `warning-200` sampai `warning-400` terdefinisi di `@theme`
- [ ] `warning-800` dan `warning-900` terdefinisi di `@theme`
- [ ] `danger-200` sampai `danger-400` terdefinisi di `@theme`
- [ ] `danger-800` dan `danger-900` terdefinisi di `@theme`
- [ ] Dark mode alert di ui-preview menampilkan background berwarna (bukan transparan)
- [ ] Dark mode toast menampilkan background berwarna (bukan transparan)
- [ ] Dark mode badge menampilkan teks berwarna (bukan warna default)

### B — Toast Class Fix (app.vue)

- [ ] `toastClass` menggunakan `-50` untuk background (bukan `-100`)
- [ ] `toastClass` menggunakan `-300` untuk border (bukan `-400`)
- [ ] Toast title `<p>` menggunakan `toastTextColor` bukan `toastIconColor`
- [ ] `getToastStyle()` tidak menggunakan `as any` — menggunakan return type yang benar

### C — useToast.ts Cleanup

- [ ] `toastColor` object (hardcoded hex) dihapus dari file
- [ ] `icon` field di `ToastItem` interface menggunakan type `Component` (bukan `any`)
- [ ] Import `type { Component } from 'vue'` ditambahkan

### D — Badge Pill Border Fix (ui-preview/index.vue)

- [ ] Semua badge pill yang memiliki `dark:border-*` juga memiliki class `border` eksplisit
- [ ] Badge pill dengan `dark:border-success-500/30` → tambahkan `border border-transparent dark:border-success-500/30`

### E — Inline Font-Family Cleanup

- [ ] Semua `style="font-family:'Kanit',sans-serif"` diganti dengan class `font-display`
- [ ] File yang terpengaruh: `admin.vue`, `dashboard/index.vue`, `ui-preview/index.vue`
- [ ] Tidak mengubah file `login.vue` (sudah menggunakan `font-display` dengan benar ✅)

### F — Code Comment Fix

- [ ] Section Overlays di `ui-preview/index.vue` dikomentari `<!-- C12 — Section: Overlays -->` (bukan C10)

### G — Verification

- [ ] `pnpm dev` zero errors, zero console warnings
- [ ] Jalankan `pnpm typecheck` — zero TypeScript errors
- [ ] Dark mode visual check: toggle tema gelap → alert/toast/badge semua berwarna

---

## Files to Modify

- `app/assets/css/globals.css` — tambah missing color values di `@theme` block
- `app/app.vue` — fix toastClass values, fix title text color, fix `as any`
- `app/composables/useToast.ts` — hapus toastColor, fix icon type
- `app/pages/ui-preview/index.vue` — fix badge border, fix section comment, replace font-family inline
- `app/layouts/admin.vue` — replace font-family inline, tambah TODO comment pada user data
- `app/pages/dashboard/index.vue` — replace font-family inline

---

## Implementation Notes

### A — Missing Color Values

Di `globals.css`, dalam blok `@theme {}`, cari baris-baris warna `success`, `warning`, `danger`
yang ada saat ini, lalu tambahkan nilai yang hilang.

Scale yang harus lengkap setelah fix:

**Success** (referensi: 500 = `#15A05A`):

```
--color-success-200: #99DDB8;
--color-success-300: #5DC98A;
--color-success-400: #30B96F;
--color-success-800: #0A5231;
--color-success-900: #073D24;
```

**Warning** (referensi: 500 = `#E8920C`):

```
--color-warning-200: #FBCF8D;
--color-warning-300: #F7AF55;
--color-warning-400: #EFA22E;
--color-warning-800: #7B4E07;
--color-warning-900: #5C3B05;
```

**Danger** (referensi: 500 = `#E11900`):

```
--color-danger-200: #F7ACAC;
--color-danger-300: #EE6D6D;
--color-danger-400: #E53D3D;
--color-danger-800: #720D00;
--color-danger-900: #560A00;
```

Tempatkan setiap nilai di posisi yang benar (ascending: 200 sebelum 300, dst).
Setelah semua skala ditambahkan, verifikasi urutan: 50 → 100 → 200 → 300 → 400 → 500 → 600 → 700 → 800 → 900 — semakin gelap setiap langkahnya.

---

### B — Toast Class Fix (app.vue)

**B1 — toastClass values:**

Ubah dari:

```js
success: 'bg-success-100  border-success-400 dark:bg-success-900/40 dark:border-success-500/60',
danger:  'bg-danger-100   border-danger-400  dark:bg-danger-900/40  dark:border-danger-500/60',
warning: 'bg-warning-100  border-warning-400 dark:bg-warning-900/40 dark:border-warning-500/60',
info:    'bg-brand-100    border-brand-400   dark:bg-brand-900/40   dark:border-brand-500/60',
```

Menjadi:

```js
success: 'bg-success-50  border-success-300 dark:bg-success-900/40 dark:border-success-600/50',
danger:  'bg-danger-50   border-danger-300  dark:bg-danger-900/40  dark:border-danger-600/50',
warning: 'bg-warning-50  border-warning-300 dark:bg-warning-900/40 dark:border-warning-600/50',
info:    'bg-brand-50    border-brand-300   dark:bg-brand-900/40   dark:border-brand-600/50',
```

**B2 — Toast title text:**

Ubah dari:

```html
<p class="text-sm font-bold" :class="toastIconColor[t.tone]"></p>
```

Menjadi:

```html
<p class="text-sm font-bold" :class="toastTextColor[t.tone]"></p>
```

**B3 — getToastStyle return type:**

Import `CSSProperties` dari vue dan gunakan sebagai return type:

```ts
import type { CSSProperties } from "vue";

function getToastStyle(i: number): CSSProperties {
  if (isToastExpanded.value || toasts.value.length === 1) {
    return {
      position: "relative",
      transform: "none",
      opacity: 1,
      zIndex: toasts.value.length - i,
    };
  }
  if (i === 0)
    return {
      position: "absolute",
      top: "0px",
      width: "100%",
      transform: "scale(1)",
      opacity: 1,
      zIndex: 30,
    };
  if (i === 1)
    return {
      position: "absolute",
      top: "10px",
      width: "100%",
      transform: "scale(0.93) translateX(3.5%)",
      opacity: 0.65,
      zIndex: 20,
    };
  return {
    position: "absolute",
    top: "18px",
    width: "100%",
    transform: "scale(0.86) translateX(7%)",
    opacity: 0.35,
    zIndex: 10,
  };
}
```

Hapus semua `as any` dari fungsi ini.

---

### C — useToast.ts Cleanup

1. Tambahkan import: `import type { Component } from 'vue'`
2. Ubah interface `ToastItem`:
   ```ts
   export interface ToastItem {
     id: string;
     title: string;
     body: string;
     tone: "success" | "danger" | "warning" | "info";
     icon: Component;
   }
   ```
3. Hapus seluruh objek `toastColor` beserta returnnya dari `useToast()`.
   ```ts
   // Hapus ini:
   const toastColor = {
     success: "#15A05A",
     danger: "#E11900",
     warning: "#E8920C",
     info: "#0055FF",
   };
   // Dan hapus dari return statement: , toastColor
   ```
4. Update return statement `useToast()` — pastikan `toastColor` tidak ada di sana.

---

### D — Badge Pill Border Fix (ui-preview/index.vue)

Temukan semua badge pill yang memiliki `dark:border-*` tetapi TIDAK memiliki class `border`.
Pattern yang dicari (contoh success):

```html
class="... dark:bg-success-500/20 dark:text-success-300
dark:border-success-500/30"
```

Tambahkan `border border-transparent` sebelum `dark:border-*`:

```html
class="... dark:bg-success-500/20 dark:text-success-300 border
border-transparent dark:border-success-500/30"
```

Terapkan ke semua 4 badge berwarna (success, warning, danger, brand/info). Badge neutral
dan badge solid (`bg-brand-500 text-white`) tidak perlu border.

---

### E — Inline Font-Family Cleanup

Ganti semua `style="font-family:'Kanit',sans-serif"` dan `style="font-family:'Kanit',sans-serif;"` dengan class `font-display` pada elemen yang sama.

Contoh:

```html
<!-- Sebelum -->
<h3
  class="text-xl font-semibold text-white"
  style="font-family:'Kanit',sans-serif;"
>
  <!-- Sesudah -->
  <h3 class="text-xl font-semibold text-white font-display"></h3>
</h3>
```

File yang diubah:

- `app/layouts/admin.vue` — cek pada logo text area
- `app/pages/dashboard/index.vue` — cek pada heading hero dan angka stat card
- `app/pages/ui-preview/index.vue` — heading setiap section dan typography demo

**Pengecualian:** Di section Typography (`C2`) di `ui-preview/index.vue`, elemen yang
_mendemonstrasikan_ font Kanit (seperti baris H1-H6 demo) BOLEH tetap menggunakan
`font-display` class — ganti inline style juga di sana.

---

### F — Section Comment Fix (ui-preview/index.vue)

Temukan di `ui-preview/index.vue`:

```html
<!-- C10 — Section: Overlays -->
```

Ubah menjadi:

```html
<!-- C12 — Section: Overlays -->
```

Tidak ada perubahan lain di Section F.

---

## Execution Order

```
1. globals.css — tambahkan missing color scale (Section A)
   Prioritas pertama karena semua fix lain bergantung pada warna ini.

2. app/composables/useToast.ts — cleanup (Section C)
   Hapus toastColor, fix icon type.

3. app/app.vue — fix toast class values + title color + CSSProperties (Section B)

4. app/pages/ui-preview/index.vue — badge border + section comment + font-family (Section D, F, E)

5. app/layouts/admin.vue — font-family + TODO comments (Section E, F)

6. app/pages/dashboard/index.vue — font-family inline (Section E)

7. Jalankan pnpm typecheck — zero errors
8. Jalankan pnpm dev — verifikasi dark mode: toast, alert, badge semua berwarna
9. Update PROGRESS.md → fix_009 status: ✅ DONE
```

---

## Completion

Jalankan `pnpm typecheck` lalu `pnpm dev`, verifikasi **semua** acceptance criteria terpenuhi.  
Laporkan hasil ke Planner dalam format:

```
✅ / ❌  [item dari acceptance criteria]
```

No screenshots — Planner melakukan visual review sendiri.
