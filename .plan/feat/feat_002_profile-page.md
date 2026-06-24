# Feat 002 — Profile Page

**Route:** `/profile`  
**Layout:** admin  
**Depends on:** feat_001 selesai  
**Auth:** `middleware: 'auth'`, mock user dari `useAuth()`

---

## Goal

Halaman profil user — menampilkan info akun dan formulir edit profil serta ganti password.

---

## Acceptance Criteria

- [ ] Route `/profile` dapat diakses, menggunakan admin layout
- [ ] Tab browser: `Profil Saya | MyPartner by Partnership`
- [ ] Section 1 — Info Profil:
  - Avatar lingkaran besar (inisial user, bg-brand-50 text-brand-600)
  - Nama lengkap, role/jabatan, email (dari mock useAuth())
  - Tombol "Unggah Foto" (non-fungsional, UI only)
- [ ] Section 2 — Edit Profil (form):
  - Field: Nama Lengkap, Email, Jabatan, Nomor HP
  - Tombol "Simpan Perubahan" — tampilkan toast success saat diklik
- [ ] Section 3 — Ganti Password (form terpisah di bawah):
  - Field: Password Lama, Password Baru, Konfirmasi Password Baru
  - Semua field type="password" dengan toggle show/hide
  - Tombol "Ubah Password" — tampilkan toast success saat diklik
- [ ] Semua input menggunakan pola design system (h-11, border-neutral-300, focus ring brand)
- [ ] Dark mode berfungsi di semua elemen
- [ ] `definePageMeta({ layout: 'admin', middleware: 'auth' })`

---

## Implementation Notes

- Mock user data dari `useAuth().user` (stub return null — gunakan fallback hardcoded sementara)
- Tidak ada API call — form submit hanya trigger toast, tidak benar-benar menyimpan
- Layout halaman: dua kolom di desktop (info kiri, form kanan), satu kolom di mobile
- Password toggle: gunakan icon `Eye` / `EyeOff` dari lucide-vue-next
- Section header: `text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 mb-4`
- Card wrapper setiap section: `bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft p-6`

---

## Files to Create

- `app/pages/profile/index.vue`
