# Feat 004 — Settings Page

**Route:** `/settings`  
**Layout:** admin  
**Depends on:** feat_001 selesai  
**Auth:** `middleware: 'auth'`

---

## Goal

Halaman pengaturan sistem — preferensi tampilan, bahasa, dan informasi perusahaan.

---

## Acceptance Criteria

- [ ] Route `/settings` dapat diakses, menggunakan admin layout
- [ ] Tab browser: `Pengaturan | MyPartner by Partnership`
- [ ] Section 1 — Preferensi Tampilan:
  - Toggle tema: Terang / Gelap (terhubung ke `useTheme()` yang sudah ada)
  - Pilihan bahasa: Indonesia / English (toggle/select, UI only — tidak mengubah bahasa sesungguhnya)
- [ ] Section 2 — Informasi Perusahaan (read-only untuk non-admin):
  - Nama perusahaan: PT Partnership Procurement Solution
  - Alamat, telepon, email perusahaan (mock placeholder)
  - Logo perusahaan (placeholder box dengan teks "Logo Perusahaan")
- [ ] Section 3 — Tentang Sistem:
  - Nama aplikasi: MyPartner
  - Versi: 1.0.0
  - Dikembangkan oleh: PT Partnership Procurement Solution
  - Tahun: 2026
- [ ] Semua section dalam card wrapper design system
- [ ] Dark mode berfungsi
- [ ] `definePageMeta({ layout: 'admin', middleware: 'auth' })`

---

## Implementation Notes

- Theme toggle gunakan `useTheme()` composable yang sudah ada — bukan buat baru
- Bahasa toggle: `ref('id')` — perubahan hanya update UI toggle, tidak ada i18n
- Informasi perusahaan: hardcoded mock data — akan diganti saat backend siap
- Section header pattern sama dengan profile page
- Tidak ada tombol "Simpan" untuk section read-only; section preferensi auto-save (langsung apply)

---

## Files to Create

- `app/pages/settings/index.vue`
