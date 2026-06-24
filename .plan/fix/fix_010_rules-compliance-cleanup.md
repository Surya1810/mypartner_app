# Fix 010 — Rules Compliance Cleanup

**Depends on:** fix_009 selesai ✅  
**Shell:** PowerShell (Windows)  
**Priority:** HIGH — beberapa item melanggar shared.md secara eksplisit  
**Rules:** `.plan/rules/shared.md` — baca section "Coding Conduct", "TypeScript Standards", "File Size Limits"

---

## Goal

Menghapus semua komentar `TODO`/`FIXME` yang dilarang, memperbaiki `any` yang tersisa,
membuang dead code, dan memecah `ui-preview/index.vue` (1045 baris — melewati hard limit
800 baris) menjadi sub-komponen yang terkontrol.

---

## Acceptance Criteria

### A — No TODO/FIXME Comments

- [ ] Zero `TODO`, `FIXME`, `HACK`, `XXX` di seluruh `app/` (verifikasi: `grep -rn "TODO\|FIXME" app/`)
- [ ] `app/composables/useAuth.ts` — stub tanpa komentar TODO
- [ ] `app/middleware/auth.ts` — stub tanpa komentar TODO
- [ ] `app/middleware/guest.ts` — stub tanpa komentar TODO
- [ ] `app/plugins/auth.server.ts` — stub tanpa komentar TODO
- [ ] `app/plugins/01.auth.client.ts` — stub tanpa komentar TODO
- [ ] `app/plugins/02.csrf.client.ts` — stub tanpa komentar TODO
- [ ] `app/layouts/admin.vue` — fungsi `logout()` melakukan `navigateTo('/login')`, tanpa komentar TODO

### B — Zero `any` Types

- [ ] `useDateTime.ts`: `let interval: any` diganti `ReturnType<typeof setInterval> | null`
- [ ] `pnpm typecheck` zero errors setelah perubahan ini

### C — Dead Code Removal (useDateTime.ts)

- [ ] Properti `formatted` (computed string gabungan) DIHAPUS dari return useDateTime
- [ ] Properti `now` (raw ref) DIHAPUS dari return useDateTime
- [ ] Properti `dayShort` DIHAPUS dari return useDateTime
- [ ] Properti `dateStr` DIHAPUS dari return useDateTime
- [ ] Hanya `dayFull` dan `timeStr` yang di-return (keduanya dipakai di `admin.vue`)
- [ ] Tidak ada error di `admin.vue` setelah properti dihapus

### D — ui-preview Split (File Size Hard Limit)

- [ ] `ui-preview/index.vue` di bawah 300 baris (shell tipis + import komponen)
- [ ] Komponen hasil split masing-masing di bawah 400 baris
- [ ] Semua section UI Preview masih tampil dengan benar di `/ui-preview`
- [ ] Semua state interaktif (checkbox, radio, toggle, combobox, modal, toast) masih berfungsi
- [ ] File split ditempatkan di `app/components/preview/`

### E — Verification

- [ ] `pnpm typecheck` zero errors
- [ ] `pnpm lint` zero errors
- [ ] `pnpm dev` zero console errors
- [ ] `grep -rn "TODO\|FIXME\|HACK\|XXX" app/` — zero output

---

## Files to Modify

- `app/composables/useDateTime.ts` — fix `any`, hapus dead exports
- `app/composables/useAuth.ts` — hapus TODO comment
- `app/middleware/auth.ts` — hapus TODO comment
- `app/middleware/guest.ts` — hapus TODO comment
- `app/plugins/auth.server.ts` — hapus TODO comment
- `app/plugins/01.auth.client.ts` — hapus TODO comment
- `app/plugins/02.csrf.client.ts` — hapus TODO comment
- `app/layouts/admin.vue` — implement logout(), hapus TODO comment

## Files to Create

- `app/components/preview/PreviewFoundation.vue` — section C1, C2, C3
- `app/components/preview/PreviewControls.vue` — section C4, C5, C6
- `app/components/preview/PreviewFeedback.vue` — section C7, C8, C12 (Overlays)
- `app/components/preview/PreviewData.vue` — section C9, C10, C11

## Files to Refactor

- `app/pages/ui-preview/index.vue` — jadikan shell tipis yang mengimpor 4 komponen di atas

---

## Implementation Notes

### A — Hapus TODO Comments dari Auth Stubs

Keenam file auth stub adalah placeholder untuk Phase 03. Hapus hanya baris komentarnya;
pertahankan export/stub yang sudah ada karena diperlukan oleh Nuxt runtime.

**useAuth.ts** — ubah dari:

```ts
// TODO: implement in Phase 03
export {};
```

Menjadi:

```ts
export function useAuth() {
  const user = useState<null>("auth-user", () => null);
  return { user };
}
```

(Stub minimal yang bisa dipakai oleh admin.vue nantinya, tanpa komentar.)

**middleware/auth.ts** dan **middleware/guest.ts** — hapus hanya baris TODO:

```ts
// Sebelum:
// TODO: implement in Phase 03
export default defineNuxtRouteMiddleware((to, from) => {});

// Sesudah:
export default defineNuxtRouteMiddleware(() => {});
```

**plugins/auth.server.ts**, **01.auth.client.ts**, **02.csrf.client.ts** — sama:

```ts
// Sebelum:
// TODO: implement in Phase 03
export default defineNuxtPlugin((nuxtApp) => {});

// Sesudah:
export default defineNuxtPlugin(() => {});
```

Pastikan tidak ada teks "TODO", "FIXME", atau sejenisnya di baris manapun.

---

### A7 — Logout Function (admin.vue)

Temukan fungsi:

```ts
const logout = () => {
  // TODO: Implement actual logout
};
```

Ganti menjadi:

```ts
const logout = () => {
  navigateTo("/login");
};
```

Import `navigateTo` dari `#imports` jika belum ada.

---

### B — Fix `interval: any` (useDateTime.ts)

Ubah:

```ts
let interval: any;
```

Menjadi:

```ts
let interval: ReturnType<typeof setInterval> | null = null;
```

Sesuaikan juga `onUnmounted`:

```ts
onUnmounted(() => {
  if (interval !== null) clearInterval(interval);
});
```

---

### C — Dead Code Removal (useDateTime.ts)

Setelah fix B, hapus:

1. Computed `formatted` (string gabungan tanggal + waktu) — tidak dipakai
2. Computed `dayShort` — tidak dipakai
3. Computed `dateStr` — tidak dipakai (berbeda dari `timeStr`)
4. Jangan return `now` secara eksplisit

Return statement akhir yang benar:

```ts
return { dayFull, timeStr };
```

Verifikasi: cari di seluruh `app/` apakah ada yang pakai `dayShort`, `dateStr`, `formatted`,
atau `useDateTime().now`. Jika ada, jangan hapus yang itu. Jika tidak ada, hapus.

---

### D — ui-preview Split

**Prinsip split:**

- Pindahkan blok `<section>` (beserta reactive state yang digunakannya) ke komponen masing-masing
- Komponen preview adalah presentational — tidak ada API call, tidak ada composable bisnis
- Setiap komponen membawa state-nya sendiri (ref, computed, fungsi) yang hanya dipakai di section itu

**Pembagian:**

| Komponen            | Section                                           | Perkiraan baris |
| ------------------- | ------------------------------------------------- | --------------- |
| `PreviewFoundation` | C1 Overview, C2 Typography, C3 Colors             | ~180            |
| `PreviewControls`   | C4 Buttons, C5 Forms, C6 Combobox                 | ~330            |
| `PreviewFeedback`   | C7 Alerts/Badges, C8 Info Box, C12 Overlays/Toast | ~280            |
| `PreviewData`       | C9 Cards, C10 Card Highlight, C11 Table           | ~260            |

**State yang perlu dipindah ke komponen masing-masing:**

- `PreviewControls` membawa: `isLoading`, `simulateLoad`, `checkboxOpts`, `radioOpts`,
  `radioSelected`, `toggleOpts`, `comboboxOpen`, `comboboxValue`
- `PreviewFeedback` membawa: `alertItems`, `infoBoxItems`, `showModal`, `useToast()` call,
  toast trigger buttons
- `PreviewData` membawa: `statCards`, `tableData`, `sortKey`, `sortDir`, `currentPage`,
  `pageSize`, import dari Lucide yang dipakai di cards/table

**Shell `ui-preview/index.vue` setelah split (~100-150 baris):**

```vue
<script setup lang="ts">
import { useHead } from "#imports";
import PreviewFoundation from "@/components/preview/PreviewFoundation.vue";
import PreviewControls from "@/components/preview/PreviewControls.vue";
import PreviewFeedback from "@/components/preview/PreviewFeedback.vue";
import PreviewData from "@/components/preview/PreviewData.vue";

definePageMeta({ layout: "admin" });
useHead({ title: "UI Preview" });
</script>

<template>
  <div class="p-6 space-y-16 max-w-[1200px] mx-auto">
    <PreviewFoundation />
    <PreviewControls />
    <PreviewFeedback />
    <PreviewData />
  </div>
</template>
```

Perhatian saat memindah state:

- Import Lucide icons hanya ke komponen yang memakainya
- `useToast()` hanya dipanggil di `PreviewFeedback`
- `showModal` dan `Dialog` hanya di `PreviewFeedback`
- Jangan duplikasi: jika sebuah icon dipakai di dua komponen, import di masing-masing

---

## Execution Order

```
1. useDateTime.ts — fix interval:any, hapus dead exports (Section B + C)
2. useAuth.ts — ubah menjadi stub minimal tanpa TODO (Section A)
3. middleware/auth.ts, guest.ts — hapus baris TODO (Section A)
4. plugins/auth.server.ts, 01.auth.client.ts, 02.csrf.client.ts — hapus baris TODO (Section A)
5. admin.vue — implement logout(), hapus TODO (Section A7)
6. Split ui-preview:
   a. Buat app/components/preview/ folder
   b. Buat PreviewFoundation.vue — pindahkan C1, C2, C3 beserta state/import-nya
   c. Buat PreviewControls.vue — pindahkan C4, C5, C6 beserta state/import-nya
   d. Buat PreviewFeedback.vue — pindahkan C7, C8, C12 beserta state/import-nya
   e. Buat PreviewData.vue — pindahkan C9, C10, C11 beserta state/import-nya
   f. Refactor ui-preview/index.vue menjadi shell tipis
7. Verifikasi:
   - grep -rn "TODO\|FIXME\|HACK\|XXX" app/ → zero output
   - pnpm typecheck → zero errors
   - pnpm lint → zero errors
   - pnpm dev → buka /ui-preview, verifikasi semua section tampil dan interaktif
8. Update PROGRESS.md → fix_010 status: Done
```

---

## Completion

Jalankan urutan verifikasi di atas, laporkan ke Planner:

```
✅ / ❌  [item dari acceptance criteria]
```

No screenshots — Planner melakukan visual review sendiri.
