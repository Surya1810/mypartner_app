# Phase 3 — Folder Structure MyPartner

**Approach:** Frontend First  
**Framework:** Nuxt.js 4 (full-stack, satu repo)  
**Project Root:** `D:\03 Projects\MyPartner_app`

> Folder yang bertanda `[FASE BACKEND]` belum dibuat selama fase Frontend.  
> Dibuat saat backend phase dimulai (setelah UI approved).

---

## Root Project

```
MyPartner_app/
├── app/                          ← Frontend (Nuxt 4 app directory)
├── server/                       ← Backend (Nuxt server routes) [FASE BACKEND]
├── prisma/                       ← DB schema & migrations [FASE BACKEND]
├── public/                       ← Static files (favicon, robots.txt)
├── .plan/                        ← Planning artifacts (development branch only)
├── nuxt.config.ts
├── package.json
├── tsconfig.json
├── .env.example
├── .env                          ← gitignored
├── .gitignore
├── .nvmrc                        ← Node.js version pin
├── eslint.config.mjs
├── .prettierrc
├── commitlint.config.mjs
├── docker-compose.yml            ← [FASE BACKEND]
├── CLAUDE.md                     ← renamed dari PLANNER.md (dibaca Claude)
└── GEMINI.md                     ← renamed dari EXECUTOR.md (dibaca Gemini)
```

---

## app/ — Frontend

```
app/
├── app.vue                       ← root; hanya page transition wrapper
│
├── assets/
│   └── css/
│       └── globals.css           ← SATU TEMPAT: CSS vars, Tailwind base, shadcn tokens
│
├── layouts/
│   ├── default.vue               ← public pages (login, dll)
│   └── admin.vue                 ← protected; definePageMeta auth middleware disini
│
├── middleware/
│   ├── auth.ts                   ← named; cek session, redirect ke login jika gagal
│   ├── guest.ts                  ← redirect authenticated user dari login page
│   └── role-guard.ts             ← optional per-page role restriction
│
├── plugins/
│   ├── auth.server.ts            ← SSR: pre-populate useState sebelum render
│   ├── 01.auth.client.ts         ← init useAuth dari useState
│   └── 02.csrf.client.ts         ← override $fetch, inject X-CSRF-Token otomatis
│
├── composables/
│   ├── useAuth.ts                ← single source of truth auth state
│   ├── usePermissions.ts         ← cek role/permission dari state
│   ├── useToast.ts               ← wrapper Sonner
│   ├── usePagination.ts          ← shared pagination logic (page, limit, total)
│   ├── useFileUpload.ts          ← GCS upload helper via /api/files proxy
│   ├── useClients.ts             ← M4: data fetching + mutations
│   ├── useSuppliers.ts           ← M5
│   ├── useDocuments.ts           ← M6
│   ├── useLetters.ts             ← M10
│   ├── usePresales.ts            ← M11
│   ├── useAftersales.ts          ← M13
│   ├── useProducts.ts            ← M15
│   ├── useInventory.ts           ← M17
│   ├── useNotifications.ts       ← M21
│   ├── useAuditLogs.ts           ← M20
│   └── useReports.ts             ← M19
│
├── types/
│   ├── api.ts                    ← ApiSuccess<T>, ApiList<T>, ApiError, ApiMeta
│   ├── auth.ts                   ← AuthUser, Role enum
│   └── modules/
│       ├── entity.ts             ← M1
│       ├── division.ts           ← M2
│       ├── user.ts               ← M3
│       ├── client.ts             ← M4
│       ├── supplier.ts           ← M5
│       ├── document.ts           ← M6
│       ├── vault.ts              ← M7
│       ├── leave.ts              ← M8
│       ├── regulation.ts         ← M9
│       ├── letter.ts             ← M10
│       ├── presales.ts           ← M11
│       ├── aftersales.ts         ← M13
│       ├── product.ts            ← M15-M16
│       ├── inventory.ts          ← M17
│       └── notification.ts       ← M21
│
├── components/
│   │
│   ├── ui/                       ← shadcn-vue (copy-owned, JANGAN install ulang)
│   │   ├── Button.vue
│   │   ├── Dialog.vue
│   │   ├── AlertDialog.vue
│   │   ├── Form.vue
│   │   ├── FormField.vue
│   │   ├── FormItem.vue
│   │   ├── FormLabel.vue
│   │   ├── FormControl.vue
│   │   ├── FormMessage.vue
│   │   ├── Input.vue
│   │   ├── Textarea.vue
│   │   ├── Select.vue
│   │   ├── Checkbox.vue
│   │   ├── Table.vue
│   │   ├── Badge.vue
│   │   ├── Card.vue
│   │   ├── Skeleton.vue
│   │   ├── Sonner.vue
│   │   ├── Separator.vue
│   │   ├── Tabs.vue
│   │   ├── DropdownMenu.vue
│   │   ├── Popover.vue
│   │   └── Calendar.vue
│   │
│   ├── shared/                   ← reusable lintas modul
│   │   ├── AppSidebar.vue        ← navigasi utama, role-aware
│   │   ├── AppNavbar.vue         ← topbar, notif badge, user avatar
│   │   ├── AppBreadcrumb.vue
│   │   ├── AppPagination.vue     ← pakai usePagination composable
│   │   ├── AppDataTable.vue      ← wrapper Table + pagination + search
│   │   ├── AppStatusBadge.vue    ← generic status badge dengan color map
│   │   ├── AppEmptyState.vue     ← tampilan saat data kosong
│   │   ├── AppConfirmDialog.vue  ← wrapper AlertDialog untuk destructive action
│   │   ├── AppFileUpload.vue     ← drag-drop + preview + progress
│   │   ├── AppRichTextEditor.vue ← TipTap/TinyMCE wrapper (ClientOnly)
│   │   ├── AppSearchInput.vue    ← debounced search input
│   │   ├── AppDatePicker.vue     ← wrapper Calendar shadcn-vue
│   │   └── AppAvatar.vue         ← user photo atau initials fallback
│   │
│   ├── entity/                   ← M1
│   │   ├── EntityCard.vue
│   │   ├── EntityLegalDocsTable.vue
│   │   └── EntityLetterConfigForm.vue
│   │
│   ├── division/                 ← M2
│   │   └── DivisionCard.vue
│   │
│   ├── users/                    ← M3
│   │   ├── UserRoleTag.vue
│   │   └── PermissionMatrix.vue
│   │
│   ├── clients/                  ← M4
│   │   ├── ClientStatusBadge.vue
│   │   ├── ClientPicList.vue
│   │   ├── ClientQualificationForm.vue
│   │   └── ClientStatusLog.vue
│   │
│   ├── suppliers/                ← M5
│   │   ├── SupplierStatusBadge.vue
│   │   └── SupplierTagList.vue
│   │
│   ├── documents/                ← M6
│   │   ├── DocumentFolderTree.vue
│   │   ├── DocumentFileList.vue
│   │   ├── DocumentFileCard.vue
│   │   └── DocumentVersionHistory.vue
│   │
│   ├── vault/                    ← M7
│   │   ├── VaultEntryCard.vue
│   │   └── VaultPasswordReveal.vue
│   │
│   ├── leave/                    ← M8
│   │   ├── LeaveRequestForm.vue
│   │   ├── LeaveStatusBadge.vue
│   │   ├── LeaveBalanceCard.vue
│   │   └── LeaveApprovalActions.vue
│   │
│   ├── regulations/              ← M9
│   │   ├── RegulationCard.vue
│   │   └── RegulationReadStatus.vue
│   │
│   ├── letters/                  ← M10
│   │   ├── LetterComposer.vue    ← rich text editor + placeholder toolbar
│   │   ├── LetterTemplateSelector.vue
│   │   ├── LetterStatusBadge.vue
│   │   ├── LetterApprovalFlow.vue
│   │   └── LetterNumberBadge.vue
│   │
│   ├── presales/                 ← M11
│   │   ├── ProspectKanbanBoard.vue
│   │   ├── ProspectKanbanCard.vue
│   │   ├── ProspectTimelineView.vue
│   │   ├── FollowUpLogForm.vue
│   │   ├── FollowUpLogItem.vue
│   │   ├── PipelineStageBadge.vue
│   │   └── MonthlyPlanCard.vue
│   │
│   ├── aftersales/               ← M13
│   │   ├── AftersalesFollowUpForm.vue
│   │   ├── AftersalesFollowUpItem.vue
│   │   └── MonthlyContactStatus.vue
│   │
│   ├── products/                 ← M15-M16
│   │   ├── ProductSpecsForm.vue
│   │   ├── ProductHppCalculator.vue
│   │   ├── ProductRetailPricingForm.vue
│   │   ├── ProductBundleForm.vue
│   │   ├── ProductChangeLogItem.vue
│   │   └── ProductPhotoGallery.vue
│   │
│   ├── inventory/                ← M17
│   │   ├── InventoryStockBadge.vue   ← AMAN/KRITIS/HABIS dengan warna
│   │   ├── InventoryMovementForm.vue
│   │   ├── InventoryMovementLog.vue
│   │   └── SerialNumberManager.vue
│   │
│   ├── dashboard/                ← M18
│   │   ├── DashboardWidget.vue
│   │   ├── ProspectTargetChart.vue
│   │   ├── PipelineStageChart.vue
│   │   └── StockStatusWidget.vue
│   │
│   ├── reports/                  ← M19
│   │   ├── ReportTypeSelector.vue
│   │   └── ReportJobStatus.vue
│   │
│   ├── audit/                    ← M20
│   │   ├── AuditLogTable.vue
│   │   └── AuditLogFilter.vue
│   │
│   └── notifications/            ← M21
│       ├── NotificationItem.vue
│       └── NotificationBadge.vue
│
└── pages/
    ├── index.vue                 ← redirect ke /dashboard
    ├── login.vue                 ← definePageMeta({ middleware: 'guest' })
    │
    ├── dashboard/
    │   └── index.vue             ← M18: widget per role
    │
    ├── entity/                   ← M1
    │   ├── index.vue             ← list semua entitas
    │   └── [id]/
    │       ├── index.vue         ← detail entitas
    │       └── edit.vue
    │
    ├── divisions/                ← M2
    │   ├── index.vue
    │   └── [id].vue
    │
    ├── users/                    ← M3
    │   ├── index.vue
    │   ├── [id]/
    │   │   ├── index.vue
    │   │   └── edit.vue
    │   └── permissions.vue       ← permission management menu
    │
    ├── clients/                  ← M4
    │   ├── index.vue
    │   └── [id]/
    │       ├── index.vue
    │       └── edit.vue
    │
    ├── suppliers/                ← M5
    │   ├── index.vue
    │   └── [id]/
    │       ├── index.vue
    │       └── edit.vue
    │
    ├── documents/                ← M6
    │   ├── index.vue             ← root folder tree
    │   └── [folderId].vue        ← isi folder
    │
    ├── vault/                    ← M7
    │   └── index.vue
    │
    ├── leave/                    ← M8
    │   ├── index.vue             ← list + saldo
    │   ├── new.vue
    │   └── [id].vue
    │
    ├── regulations/              ← M9
    │   ├── index.vue
    │   └── [id].vue
    │
    ├── letters/                  ← M10
    │   ├── index.vue
    │   ├── new.vue               ← composer
    │   ├── [id]/
    │   │   ├── index.vue
    │   │   └── edit.vue
    │   └── templates/
    │       ├── index.vue
    │       ├── new.vue
    │       └── [id]/
    │           └── edit.vue
    │
    ├── presales/                 ← M11
    │   ├── index.vue             ← Kanban view (default)
    │   ├── timeline.vue          ← Timeline/Schedule view
    │   ├── plans/
    │   │   ├── index.vue         ← list rencana bulanan
    │   │   └── [year]-[month].vue ← detail plan bulan tertentu
    │   └── prospects/
    │       └── [id].vue          ← detail prospek + follow-up log
    │
    ├── aftersales/               ← M13
    │   ├── index.vue             ← list klien + status kontak bulanan
    │   └── [clientId].vue        ← detail + follow-up log
    │
    ├── products/                 ← M15-M16
    │   ├── index.vue
    │   ├── new.vue
    │   ├── [id]/
    │   │   ├── index.vue         ← 4 tabs: Spesifikasi, HPP, Retail, Bundling
    │   │   └── edit.vue
    │   └── catalog.vue           ← M16: generate catalog
    │
    ├── inventory/                ← M17
    │   ├── index.vue             ← list item + status warna
    │   ├── [id].vue              ← detail item + movement log
    │   └── movements.vue         ← global movement log
    │
    ├── reports/                  ← M19
    │   └── index.vue
    │
    ├── audit/                    ← M20
    │   └── index.vue
    │
    ├── notifications/            ← M21
    │   └── index.vue
    │
    └── settings/                 ← System Settings
        ├── index.vue             ← global parameters (kurs, tariff, dll)
        └── permissions.vue       ← role permission matrix
```

---

## server/ — Backend [FASE BACKEND]

```
server/
├── api/
│   ├── auth/
│   │   ├── login.post.ts
│   │   ├── logout.post.ts
│   │   ├── refresh.post.ts
│   │   └── me.get.ts
│   │
│   ├── files/
│   │   └── [...key].get.ts       ← private file proxy (auth + stream GCS)
│   │
│   ├── entities/
│   │   ├── index.get.ts
│   │   ├── index.post.ts
│   │   ├── [id].get.ts
│   │   ├── [id].patch.ts
│   │   ├── [id]/
│   │   │   ├── legal-docs.get.ts
│   │   │   ├── legal-docs.post.ts
│   │   │   └── letter-config.patch.ts
│   │
│   ├── divisions/
│   ├── users/
│   ├── permissions/
│   ├── clients/
│   ├── suppliers/
│   ├── documents/
│   ├── vault/
│   ├── leave/
│   ├── regulations/
│   ├── letters/
│   ├── presales/
│   ├── aftersales/
│   ├── products/
│   ├── inventory/
│   ├── dashboard/
│   ├── reports/
│   ├── audit/
│   ├── notifications/
│   └── settings/
│
├── services/
│   ├── auth.service.ts
│   ├── entity.service.ts
│   ├── letter-number.service.ts  ← S1: Document Number Engine (atomic counter)
│   ├── permission-gate.service.ts ← S3: Permission Gate
│   ├── audit.service.ts          ← S4: Change History Engine
│   ├── hpp-calculator.service.ts ← HPP calculation dari system_settings
│   ├── pdf.service.ts            ← Puppeteer PDF generation
│   ├── gcs.service.ts            ← Google Cloud Storage wrapper
│   ├── email.service.ts          ← Nodemailer
│   ├── notification.service.ts
│   └── [module].service.ts       ← satu file per modul
│
├── repositories/
│   ├── audit.repository.ts       ← HANYA expose create() — tidak ada update/delete
│   └── [module].repository.ts    ← satu file per modul
│
├── middleware/
│   ├── auth.ts                   ← verifikasi JWT, attach user ke event.context
│   ├── csrf.ts                   ← validasi X-CSRF-Token
│   ├── rate-limit.ts             ← in-process Map, per IP
│   └── security-headers.ts       ← X-Frame-Options, CSP, HSTS, dll
│
├── utils/
│   ├── db.ts                     ← Prisma singleton
│   ├── token.ts                  ← JWT sign/verify, generateRefreshToken
│   ├── logger.ts                 ← pino singleton (JSON Lines, daily rotation)
│   ├── response.ts               ← ok(), okList()
│   ├── env.ts                    ← startup env validation (crash jika missing)
│   ├── password.ts               ← bcrypt hash/verify
│   ├── encryption.ts             ← AES-256 (untuk Account Vault)
│   └── file-validation.ts        ← magic bytes check, MIME, size limit
│
├── validators/                   ← Zod schemas — DIPAKAI frontend dan backend (DRY)
│   ├── auth.ts
│   ├── entity.ts
│   ├── client.ts
│   ├── supplier.ts
│   ├── letter.ts
│   ├── presales.ts
│   ├── product.ts
│   ├── inventory.ts
│   └── [module].ts
│
├── plugins/
│   ├── error-handler.ts          ← normalize semua error ke { success: false, message }
│   └── shutdown.ts               ← SIGTERM/SIGINT → db.$disconnect()
│
└── templates/
    └── email/
        ├── leave-approved.html
        ├── leave-rejected.html
        ├── letter-approved.html
        ├── vault-expiry.html
        └── report-ready.html
```

---

## prisma/ — Database [FASE BACKEND]

```
prisma/
├── schema.prisma       ← ditulis SETELAH UI approved
├── seed.ts             ← 1 akun Direktur + sample data per entitas
└── migrations/         ← auto-generated, TIDAK diedit manual
```

---

## .plan/ — Planning Artifacts

```
.plan/
├── rules/
│   ├── shared.md         ← project config, naming, TypeScript, code quality
│   ├── auth.md           ← auth contract 14 rules
│   ├── frontend.md       ← CSS, UI, form, file display + design brief MyPartner
│   └── backend.md        ← server architecture, security, API docs
├── skills/
│   ├── auth.md           ← implementasi konkret auth
│   ├── frontend.md       ← pola Nuxt 4, shadcn-vue, vee-validate
│   └── backend.md        ← route handlers, Prisma, Zod, logging
├── PROGRESS.md           ← tracking semua phase + current state
│
├── 01-project-setup.md
├── 02-design-system.md
├── 03-auth-frontend.md   ← auth UI + mock, belum backend
├── 04-frontend-[modul].md  ← satu file per modul
├── ...
├── NN-auth-backend.md    ← SETELAH UI approved
├── NN-database-schema.md
├── NN-backend-[modul].md
├── NN-wiring.md          ← frontend ↔ backend
├── NN-security.md
├── NN-testing.md
└── NN-production.md
```

---

## Urutan Pembuatan Folder (Frontend First)

### Fase 1 — Project Setup (Executor buat ini dulu)

```
MyPartner_app/
├── app/
│   ├── assets/css/globals.css    ← design tokens
│   ├── layouts/
│   ├── middleware/
│   ├── plugins/
│   ├── composables/useAuth.ts
│   ├── types/api.ts
│   └── components/ui/            ← shadcn-vue install
├── public/
├── nuxt.config.ts
├── package.json
├── .env.example
├── eslint.config.mjs
├── .prettierrc
├── .gitignore
├── .nvmrc
├── CLAUDE.md
├── GEMINI.md
└── .plan/
```

### Fase 2 — Module UI (bertahap per modul)

Tambah folder `app/pages/[modul]/`, `app/components/[modul]/`, `app/composables/use[Modul].ts` sesuai urutan prioritas modul.

### Fase 3 — Backend (setelah UI approved)

Buat `server/`, `prisma/`, `docker-compose.yml`.

---

## Catatan Kritis

1. **`globals.css` wajib terdaftar di `nuxt.config.ts`** sebelum Executor menulis satu komponen pun: `css: ['~/assets/css/globals.css']`.

2. **Tidak ada komponen shadcn-vue yang dibangun ulang.** Semua dari `app/components/ui/` — customisasi hanya dengan edit file di sana.

3. **Mock data selama Frontend Phase** — gunakan static TypeScript objects atau `composables/use[Modul].ts` yang return hardcoded data. Tidak perlu MSW.

4. **`server/validators/` adalah sumber kebenaran tunggal untuk Zod schemas.** Frontend import dari sana. Tidak boleh ada schema yang didefinisikan ulang di frontend.

5. **Setiap page menggunakan layout `admin`** kecuali `login.vue`. Layout admin yang meng-apply `middleware: 'auth'` — tidak per-page.

6. **Semua private file** (dari GCS) diakses via `GET /api/files/[...key]` — tidak pernah expose URL GCS langsung ke client.
