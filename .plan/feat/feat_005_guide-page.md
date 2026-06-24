# Feat 005 — Panduan Sistem (Getting Started)

**Route:** `/guide`  
**Layout:** admin  
**Depends on:** feat_001 selesai  
**Auth:** `middleware: 'auth'`  
**Referensi:** Tombol "Mulai Eksplorasi" di hero card dashboard

---

## Goal

Halaman panduan onboarding untuk user baru — menjelaskan fitur utama sistem MyPartner
dalam format yang mudah dibaca, seperti manual book ringkas.

---

## Acceptance Criteria

- [ ] Route `/guide` dapat diakses, menggunakan admin layout
- [ ] Tab browser: `Panduan Sistem | MyPartner by Partnership`
- [ ] Header: judul "Panduan Sistem MyPartner" + deskripsi singkat
- [ ] Navigasi sidebar kiri (sticky): daftar section yang bisa diklik untuk scroll ke section tersebut
- [ ] Konten mock dalam beberapa section:
  - **Selamat Datang** — intro singkat tentang MyPartner
  - **Navigasi Sistem** — cara menggunakan sidebar, navbar, tema
  - **Dashboard** — penjelasan card statistik dan hero card
  - **Modul Operasional** — gambaran singkat Pre-Sales, After-Sales
  - **Master Data** — penjelasan data referensi (vendor, klien, dll)
  - **Pengaturan Akun** — cara ganti password, update profil
- [ ] Setiap section punya heading `font-display`, paragraf body, dan contoh/tips dalam Info Box
- [ ] Tombol "Kembali ke Dashboard" di bagian bawah
- [ ] Dark mode berfungsi
- [ ] `definePageMeta({ layout: 'admin', middleware: 'auth' })`

---

## Implementation Notes

- Layout: dua kolom — navigasi kiri (w-64, sticky top-6) + konten kanan (flex-1)
- Navigasi kiri: list item dengan `NuxtLink` ke anchor (`#selamat-datang`, `#navigasi`, dst)
- Active section highlight di navigasi: gunakan `useActiveSection` atau IntersectionObserver sederhana
- Konten: semua placeholder/mock — tidak perlu konten nyata
- Info Box di dalam konten gunakan komponen yang sudah ada di ui-preview (alert style info)
- Di mobile: navigasi kiri disembunyikan, cukup scroll vertikal

---

## Files to Create

- `app/pages/guide/index.vue`
