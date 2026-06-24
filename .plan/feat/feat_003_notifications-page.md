# Feat 003 — Notifications Page

**Route:** `/notifications`  
**Layout:** admin  
**Depends on:** feat_001 selesai  
**Auth:** `middleware: 'auth'`

---

## Goal

Halaman daftar lengkap notifikasi — versi full dari popover notifikasi di navbar.

---

## Acceptance Criteria

- [ ] Route `/notifications` dapat diakses, menggunakan admin layout
- [ ] Tab browser: `Notifikasi | MyPartner by Partnership`
- [ ] Header halaman: judul "Notifikasi" + tombol "Tandai Semua Dibaca"
- [ ] Filter tab: Semua / Belum Dibaca / Sudah Dibaca
  - Tab aktif: `text-brand-600 border-b-2 border-brand-500`
  - Tab tidak aktif: `text-neutral-500 hover:text-neutral-700`
- [ ] Daftar notifikasi (minimal 8 item mock):
  - Layout per item: icon container (kiri) + konten (tengah) + waktu + dot unread (kanan)
  - Icon container: `w-10 h-10 rounded-full grid place-items-center`
  - Warna icon container sesuai tipe: brand (info), success (approve), warning (stok), danger (tolak)
  - Item unread: background `bg-brand-50 dark:bg-brand-900/20`, dot biru kanan
  - Item read: background putih/default
  - Hover: `hover:bg-neutral-50 dark:hover:bg-neutral-800`
  - Border bawah antar item
- [ ] Tipe notifikasi mock (variasikan):
  - Permintaan baru (Bell, brand)
  - Dokumen disetujui (CheckCircle, success)
  - Stok kritis (AlertCircle, warning)
  - Permintaan ditolak (XCircle, danger)
- [ ] Pagination sederhana di bawah (Prev / Next / nomor halaman) — mock, tidak perlu fungsional
- [ ] Empty state: jika tab "Belum Dibaca" diklik dan semua sudah dibaca — tampilkan ilustrasi kosong + teks "Tidak ada notifikasi baru"
- [ ] Dark mode berfungsi di semua elemen
- [ ] `definePageMeta({ layout: 'admin', middleware: 'auth' })`

---

## Implementation Notes

- Data mock: array of 8-10 notifikasi dengan field: `id`, `type`, `title`, `body`, `time`, `read`
- Filter tab mengubah list yang ditampilkan via computed (filter by `read` field)
- "Tandai Semua Dibaca" — set semua `read: true` di array mock, update tampilan
- Waktu: gunakan string relatif ("2 menit lalu", "1 jam lalu", "kemarin") — tidak perlu library
- Card wrapper list: `bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft overflow-hidden`

---

## Files to Create

- `app/pages/notifications/index.vue`
