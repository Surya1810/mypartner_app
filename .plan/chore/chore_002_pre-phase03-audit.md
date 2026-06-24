# Chore 002 — Pre-Phase 03 Readiness Audit

**Depends on:** fix_010 selesai ✅  
**Shell:** PowerShell (Windows)  
**Output:** Laporan audit dengan verdict READY / NOT READY

---

## Goal

Verifikasi menyeluruh bahwa seluruh codebase sudah sesuai dengan rules, plan, dan
design system yang disepakati — sebelum melanjutkan ke Phase 03 Auth.

---

## Audit Checklist

Executor membaca setiap rule file lalu memverifikasi kepatuhan di codebase.
Untuk setiap item, laporkan: ✅ Pass / ❌ Fail / ⚠️ Warning (ada tapi minor).

---

### 1. TypeScript Compliance (shared.md)

- Zero `any` types: `grep -rn ": any\|as any\|<any>" app/ --include="*.ts" --include="*.vue"`
- Zero `TODO`/`FIXME`: `grep -rn "TODO\|FIXME\|HACK\|XXX" app/`
- Zero `console.log`: `grep -rn "console\." app/ --include="*.ts" --include="*.vue"`
- `pnpm typecheck` — zero errors

### 2. File Size (shared.md)

- Semua `.vue` dan `.ts` di bawah 800 baris: `find app/ -name "*.vue" -o -name "*.ts" | xargs wc -l | sort -rn | head -20`
- Flag setiap file di atas 600 baris (warning) dan 800 baris (fail)

### 3. Naming Conventions (shared.md)

- File names: semua `kebab-case` English
- Composables: semua `use*.ts` pattern
- Components: semua `PascalCase.vue`
- Tidak ada nama variabel/fungsi dalam Bahasa Indonesia di kode teknis

### 4. Design Tokens (frontend.md)

- Zero hardcoded hex di luar `globals.css @theme`: `grep -rn "#[0-9A-Fa-f]\{3,6\}" app/ --include="*.vue" --include="*.ts"` — hanya boleh ada di ui-preview (color swatch demo) dan globals.css
- `@variant dark` ada di baris awal `globals.css`
- Semua color scale success/warning/danger/brand/neutral lengkap di `@theme`
- Zero `style="font-family:..."` inline — semua pakai `font-display`/`font-sans`/`font-mono` class

### 5. CSS Rules (frontend.md)

- Zero `<style scoped>` yang mengandung token/layout override
- Semua custom CSS hanya di `globals.css`

### 6. Component Patterns (frontend.md)

- Semua button solid menggunakan pola: `bg-brand-500 hover:bg-brand-600 text-white ... shadow-brand`
- Semua input menggunakan pola: `h-11 px-3.5 rounded-md border border-neutral-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15`
- Semua card menggunakan: `bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft`

### 7. Sidebar & Navbar Structure (frontend.md)

- Sidebar collapsed/expanded berfungsi, state tersimpan di localStorage
- Keuangan accordion tidak terbuka secara default
- Navbar order: `[Breadcrumb] ← | → [DateTime] [Bell] [Settings] [Theme] [Lang]`
- DateTime: `dayFull` bold + separator `|` + `timeStr` badge mono
- Logout: tersembunyi saat collapsed, tombol terpisah saat expanded

### 8. Auth Stubs (auth.md)

- File-file Phase 03 stub ada dan bersih (tanpa TODO):
  - `app/composables/useAuth.ts`
  - `app/middleware/auth.ts`
  - `app/middleware/guest.ts`
  - `app/plugins/auth.server.ts`
  - `app/plugins/01.auth.client.ts`
  - `app/plugins/02.csrf.client.ts`

### 9. Page Structure

- Semua halaman yang ada menggunakan `definePageMeta({ layout: 'admin' })`
- Semua halaman menggunakan `useHead({ title: '...' })`
- Browser tab: `{Page} | MyPartner by Partnership`

### 10. Dark Mode

- `@variant dark (&:where(.dark, .dark *));` ada di globals.css
- Toggle tema berfungsi: dark class diterapkan ke `<html>`
- Default preference: light

### 11. ESLint & Tooling

- `pnpm lint` — zero errors
- `pnpm dev` — zero errors, zero console warnings

### 12. ui-preview Completeness

- Buka `/ui-preview` dan verifikasi semua 12 section tampil:
  C1 Overview, C2 Typography, C3 Colors, C4 Buttons, C5 Forms,
  C6 Combobox, C7 Alerts/Badges, C8 Info Box, C9 Cards,
  C10 Card Highlight, C11 Table, C12 Overlays
- Semua elemen interaktif berfungsi (checkbox, radio, toggle, modal, toast)

---

## Output Format

Laporkan dalam format ini:

```
## AUDIT REPORT — Pre-Phase 03

### 1. TypeScript Compliance
✅ Zero any types
✅ Zero TODO/FIXME
✅ Zero console.log
✅ pnpm typecheck — 0 errors

### 2. File Size
✅ Semua file di bawah 800 baris
⚠️ [nama file]: X baris (warning >600)

... (semua 12 section)

---
VERDICT: READY TO PROCEED / NOT READY

Issues yang harus diperbaiki sebelum lanjut:
- [list jika ada]
```

Jika ada item FAIL: jangan perbaiki sendiri — laporkan saja ke Planner.
Jika semua PASS / hanya WARNING minor: update PROGRESS.md lalu laporkan READY.
