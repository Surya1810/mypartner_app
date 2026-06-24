# Feat 006 — Peraturan Perusahaan

**Route:** `/regulations`  
**Layout:** admin  
**Depends on:** feat_001 selesai  
**Auth:** `middleware: 'auth'`  
**Referensi:** Tombol "Peraturan Perusahaan" di hero card dashboard

---

## Goal

Halaman yang menampilkan dokumen peraturan perusahaan yang wajib dibaca karyawan,
dengan PDF viewer placeholder dan tombol download.

---

## Acceptance Criteria

- [ ] Route `/regulations` dapat diakses, menggunakan admin layout
- [ ] Tab browser: `Peraturan Perusahaan | MyPartner by Partnership`
- [ ] Header: judul "Peraturan Perusahaan" + deskripsi singkat ("Dokumen ini wajib dibaca oleh seluruh karyawan.")
- [ ] Card info di atas viewer: nama dokumen, tanggal berlaku, versi dokumen (mock)
- [ ] PDF viewer area: placeholder box (`min-h-[600px]`) dengan:
  - Background `bg-neutral-100 dark:bg-neutral-800`
  - Icon `FileText` besar di tengah
  - Teks "PDF akan ditampilkan di sini setelah dokumen diunggah"
  - Rounded border `border-2 border-dashed border-neutral-300 dark:border-neutral-600`
- [ ] Tombol "Unduh Dokumen" (outline button, Download icon) — non-fungsional, UI only
- [ ] Tombol "Tandai Sudah Dibaca" (solid button, CheckCircle icon) — tampilkan toast success saat diklik, ubah state tombol menjadi "Sudah Dibaca ✓" (disabled)
- [ ] Dark mode berfungsi
- [ ] `definePageMeta({ layout: 'admin', middleware: 'auth' })`

---

## Implementation Notes

- PDF viewer sesungguhnya akan diimplementasi saat file PDF asli tersedia
- State "sudah dibaca": `ref(false)` — toggle saat tombol diklik, persist di localStorage dengan key `regulations-read-v1`
- Jika localStorage sudah `true`, tombol langsung tampil sebagai "Sudah Dibaca ✓" saat halaman dibuka
- Mock document info: `{ name: 'Peraturan Perusahaan 2026', effectiveDate: '1 Januari 2026', version: 'v1.0' }`
- Tidak ada `<embed>` atau `<iframe>` PDF — hanya placeholder

---

## Files to Create

- `app/pages/regulations/index.vue`
