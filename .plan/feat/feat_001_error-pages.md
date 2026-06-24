# Feat 001 — Error Pages

**Depends on:** fix_010 selesai ✅  
**Shell:** PowerShell (Windows)  
**Rules:** `.plan/rules/frontend.md`, `.plan/rules/shared.md`

---

## Goal

Membuat `app/error.vue` yang menangani semua error HTTP dengan tampilan branded,
menggantikan default Nuxt error page.

---

## Acceptance Criteria

- [ ] `app/error.vue` ada dan menggantikan default Nuxt error page
- [ ] Error 404 — judul "Halaman Tidak Ditemukan", deskripsi singkat, tombol "Kembali ke Dashboard"
- [ ] Error 403 — judul "Akses Ditolak", deskripsi singkat, tombol "Kembali ke Dashboard"
- [ ] Error 500 — judul "Terjadi Kesalahan", deskripsi singkat, tombol "Muat Ulang"
- [ ] Default (kode lain) — judul "Terjadi Kesalahan", tampilkan `error.statusCode`
- [ ] Menggunakan design system: `font-display` untuk heading, brand colors, dark mode support
- [ ] Tidak menggunakan admin layout — standalone page (tidak ada sidebar/navbar)
- [ ] Tombol aksi berfungsi: `clearError({ redirect: '/dashboard' })` atau `reload`
- [ ] Tampil baik di mobile dan desktop
- [ ] `pnpm dev` — navigasi ke URL tidak ada → tampil 404 custom (bukan default Nuxt)

---

## Files to Create

- `app/error.vue`

---

## Implementation Notes

Nuxt 4 menyediakan prop `error` dengan shape:

```ts
interface NuxtError {
  statusCode: number;
  statusMessage: string;
  message: string;
}
```

Gunakan `defineProps` untuk menerima `error`, lalu switch berdasarkan `statusCode`.

**Layout halaman error (standalone, tanpa sidebar):**

```
Background: bg-neutral-50 dark:bg-neutral-900
Center content secara vertikal dan horizontal (min-h-screen flex items-center justify-center)

Konten (max-w-md, text-center):
  - Kode error besar: text-8xl font-display font-bold text-brand-500 (404 / 500 / 403)
  - Judul: text-2xl font-display font-semibold text-ink dark:text-neutral-100 mt-4
  - Deskripsi: text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-xs mx-auto
  - Tombol aksi: mt-8, button solid (bg-brand-500)
  - Link sekunder: "Laporkan masalah" → text-sm text-brand-500 underline mt-3 (hanya untuk 500)
```

**Konten per status code:**

| Code    | Angka        | Judul                   | Deskripsi                                             | Tombol               |
| ------- | ------------ | ----------------------- | ----------------------------------------------------- | -------------------- |
| 404     | 404          | Halaman Tidak Ditemukan | Halaman yang kamu cari tidak ada atau telah dipindah. | Kembali ke Dashboard |
| 403     | 403          | Akses Ditolak           | Kamu tidak memiliki izin untuk mengakses halaman ini. | Kembali ke Dashboard |
| 500     | 500          | Terjadi Kesalahan       | Server mengalami masalah. Coba muat ulang halaman.    | Muat Ulang           |
| default | `statusCode` | Terjadi Kesalahan       | Terjadi kesalahan tak terduga. Silakan coba lagi.     | Kembali ke Dashboard |

**Tombol aksi:**

```ts
// Kembali ke Dashboard
const goHome = () => clearError({ redirect: "/dashboard" });

// Muat Ulang (hanya 500)
const reload = () => {
  clearError();
  window.location.reload();
};
```

**Tidak ada:**

- Tidak ada `definePageMeta` (error.vue bukan page biasa)
- Tidak ada `useHead` (tidak diperlukan di error page)
- Tidak ada admin layout
- Tidak ada sidebar/navbar

---

## Execution Order

```
1. Buat app/error.vue
2. pnpm dev
3. Navigasi ke URL random (misal /tidak-ada) → verifikasi 404 custom muncul
4. Update PROGRESS.md → feat_001 status: Done
5. Report: ✅ / ❌ per acceptance criteria
```

---

## Completion

Report ke Planner: `✅ / ❌` per acceptance criteria. No screenshots.
