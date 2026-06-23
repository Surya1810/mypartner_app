# Chore 001 — Fix Tailwind v4, pnpm warning, duplicate components

**Priority:** HIGH — harus selesai sebelum Plan 02 dilanjutkan  
**Shell:** PowerShell (Windows)

---

## Goal

Fix tiga isu yang muncul saat menjalankan `pnpm dev`:

1. `globals.css` — `@apply` error karena Tailwind v4 Vite plugin belum dikonfigurasi
2. pnpm warning tentang `onlyBuiltDependencies` di `package.json`
3. Warning duplicate component registrations dari shadcn-vue

---

## Fix 1 — Tailwind v4: update globals.css ke sintaks v4

**Root cause:** `@tailwindcss/vite` sudah terpasang dan sudah ada di `nuxt.config.ts` — plugin sudah benar. Masalahnya hanya `globals.css` masih memakai sintaks Tailwind v3 (`@tailwind base/components/utilities`). Tailwind v4 tidak mengenali directive lama ini, sehingga `@apply px-2.5` gagal.

**Step 1a — Update `app/assets/css/globals.css`:**

Ganti HANYA tiga baris pertama:

```css
/* HAPUS tiga baris ini: */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* GANTI dengan satu baris ini (Tailwind v4 syntax): */
@import "tailwindcss";
```

Seluruh isi file setelah tiga baris pertama TIDAK berubah — hanya baris import yang diganti.

**Step 1b — Verify:**

```powershell
pnpm dev
```

Error `Cannot apply unknown utility class` harus hilang.

---

## Fix 2 — pnpm: pindahkan `onlyBuiltDependencies` dari package.json

**Root cause:** pnpm versi terbaru tidak lagi membaca `pnpm.onlyBuiltDependencies` dari `package.json`. Setting ini harus dipindah ke `.npmrc`.

**Step 2a — Buat file `.npmrc` di root project:**

```ini
onlyBuiltDependencies[]=@parcel/watcher
onlyBuiltDependencies[]=@prisma/client
onlyBuiltDependencies[]=@prisma/engines
onlyBuiltDependencies[]=@sentry/cli
onlyBuiltDependencies[]=esbuild
onlyBuiltDependencies[]=msgpackr-extract
onlyBuiltDependencies[]=prisma
onlyBuiltDependencies[]=puppeteer
onlyBuiltDependencies[]=sharp
onlyBuiltDependencies[]=vue-demi
```

**Step 2b — Hapus `onlyBuiltDependencies` dari `package.json`:**

Di `package.json`, bagian `"pnpm"` hanya boleh menyisakan `"overrides"`:

```json
"pnpm": {
  "overrides": {
    "browserslist": "4.28.4"
  }
}
```

Hapus key `"onlyBuiltDependencies"` beserta isinya dari sana.

**Step 2c — Verify:**

```powershell
pnpm dev
```

Warning `[WARN] The "pnpm" field... onlyBuiltDependencies` harus hilang.

---

## Fix 3 — Duplicate component warnings dari shadcn-vue

**Root cause:** Nuxt auto-import memungut file `.vue` individual DAN `index.ts` di dalam folder `app/components/ui/`, menyebabkan komponen terdaftar dua kali.

**Step 3a — Tambahkan konfigurasi `components` ke `nuxt.config.ts`:**

`nuxt.config.ts` saat ini belum punya key `components`. Tambahkan setelah `modules: [...]`:

```ts
components: [
  {
    path: '~/components/ui',
    pathPrefix: false,
    extensions: ['vue'],   // hanya .vue, abaikan index.ts
  },
  {
    path: '~/components/shared',
    pathPrefix: false,
  },
],
```

> **Catatan:** Nuxt 4 dengan `future.compatibilityVersion: 4` menggunakan `app/` directory — path di atas adalah relative dari `app/`. Jika Nuxt tetap menampilkan warning setelah perubahan ini, periksa apakah shadcn-vue menghasilkan file `index.ts` di dalam folder komponen dan hapus jika ada, atau ubah ke `extensions: ['vue', 'ts']` dan pastikan tidak ada re-export conflict.

**Step 3b — Verify:**

```powershell
pnpm dev
```

Warning duplicate component `[WARN] ... Table ... already registered` harus hilang.

---

---

## Fix 4 — Rename halaman `/kitchen-sink` → `/ui-preview`

**Root cause:** Nama "kitchen-sink" adalah istilah internal developer. Diganti ke `/ui-preview` agar lebih deskriptif dan konsisten dengan gaya penamaan project.

**Files yang perlu diubah:**

**Step 4a — Rename folder halaman:**

```powershell
Rename-Item "app\pages\kitchen-sink" "app\pages\ui-preview"
```

**Step 4b — Update judul di dalam page:**

Di `app/pages/ui-preview/index.vue`, cari heading atau title yang masih menyebut "Kitchen Sink" dan ganti ke `"UI Preview"`.

**Step 4c — Update globals.css (jika ada komentar referencing kitchen-sink):**

Cari dan ganti referensi `kitchen-sink` di manapun dalam kodebase:

```powershell
Get-ChildItem -Recurse -Include "*.vue","*.ts","*.css" | Select-String "kitchen-sink" | Select-Object Path, LineNumber, Line
```

Ganti semua hasil yang ditemukan ke `ui-preview`.

**Step 4d — Verify:**

- `http://localhost:3000/ui-preview` bisa diakses
- `http://localhost:3000/kitchen-sink` mengembalikan 404

---

## Completion Criteria

- [x] `pnpm dev` berjalan tanpa error `Cannot apply unknown utility class`
- [x] Tidak ada warning `pnpm.onlyBuiltDependencies`
- [x] Tidak ada warning duplicate component registration
- [x] `globals.css` dimulai dengan `@import "tailwindcss";` (bukan `@tailwind base/components/utilities`)
- [x] `.npmrc` ada di root project
- [x] `http://localhost:3000/ui-preview` accessible, `/kitchen-sink` returns 404
- [x] Tidak ada sisa string "kitchen-sink" di kodebase (cek dengan grep)

**Setelah selesai, lanjutkan Plan 02.**
