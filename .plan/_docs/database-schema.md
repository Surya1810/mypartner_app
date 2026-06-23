# Phase 3 — Database Schema MyPartner

**Status:** Draft untuk review  
**Date:** 2026-06-23  
**ORM:** Prisma | **DB:** PostgreSQL 15+

Konvensi: field Prisma = camelCase, kolom DB = snake_case via `@map`, tabel = snake_case via `@@map`, PK = `cuid()`.

---

## Enums

```prisma
enum Role {
  DIREKTUR
  MANAGER
  STAFF
  MITRA
}

enum EntityType {
  PT
  CV
}

enum ClientStatus {
  PROSPEK
  FOLLOW_UP
  ONGOING
  MAINTENANCE
  PENDING
}

enum SupplierType {
  PERUSAHAAN
  INDIVIDU
}

enum SupplierCategory {
  BARANG
  JASA
}

enum SupplierStatus {
  AKTIF
  NONAKTIF
  BLACKLIST
}

enum LeaveType {
  CUTI_TAHUNAN
  SAKIT
  IZIN_PRIBADI
  DINAS_LUAR
  TUKAR_OFF_PENUH
  TUKAR_OFF_SETENGAH
  IZIN_WAKTU        // terlambat / pulang awal — pakai start_time + end_time
}

enum HalfDayPeriod {
  PAGI
  SORE
}

enum LeaveStatus {
  PENDING
  APPROVED
  REJECTED
}

enum LetterStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  BELUM_DIKIRIM
  SUDAH_DIKIRIM
  ADA_TANDA_TERIMA
}

enum LetterApprovalAction {
  APPROVED
  REJECTED
}

enum LetterRejectionRevisionType {
  REVISE_CONTENT
  CHANGE_SIGNATORY
}

enum PipelineStage {
  RENCANA
  SURAT_AUDIENSI
  FOLLOW_UP
  QUALIFICATION
  SPH
  KEPUTUSAN
}

enum ProspectDecision {
  IMPORT_PROJECT
  PENDING
}

enum FollowUpMedia {
  TELEPON
  WHATSAPP
  EMAIL
  TATAP_MUKA
  AUDIENSI
  DEMO
}

enum InventoryItemType {
  HARDWARE
  CONSUMABLE
}

enum InventoryMovementType {
  MASUK
  KELUAR
  RUSAK
  DEV
  PENYESUAIAN
}

enum SerialNumberStatus {
  STOK
  KELUAR
  RUSAK
  DEV
}

enum ProductCurrency {
  USD
  RMB
  IDR
}

enum AccountVaultScope {
  ENTITY
  DIVISION
  COMPANY
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  APPROVE
  REJECT
  VIEW
}

enum ReportStatus {
  PENDING
  PROCESSING
  DONE
  FAILED
}
```

---

## Core — Auth & System

### `users`

Tabel auth murni. Data pribadi di `user_extensions`.

| Field        | Type                  | Notes                    |
| ------------ | --------------------- | ------------------------ |
| id           | String PK cuid        |                          |
| email        | String unique         | login identifier         |
| passwordHash | String                | bcrypt salt 12           |
| divisionId   | String FK → divisions | user hanya 1 divisi      |
| isActive     | Boolean default true  | deactivate, never delete |
| createdAt    | DateTime              |                          |
| updatedAt    | DateTime @updatedAt   |                          |

Relations: `userExtension`, `userEntityRoles[]`, `rolePermissions via role`, `userPermissions[]`, `refreshTokens[]`

---

### `user_extensions`

Data lengkap karyawan (CV-level). Diisi via popup saat user baru dibuat.

| Field          | Type                     | Notes        |
| -------------- | ------------------------ | ------------ |
| id             | String PK cuid           |              |
| userId         | String unique FK → users | 1-to-1       |
| fullName       | String                   |              |
| phone          | String?                  |              |
| photoKey       | String?                  | GCS key      |
| jabatan        | String?                  | posisi/title |
| employeeNumber | String?                  |              |
| joinDate       | DateTime?                |              |
| npwp           | String?                  |              |
| bankAccount    | String?                  |              |
| bankName       | String?                  |              |
| education      | String?                  |              |
| address        | String?                  |              |
| createdAt      | DateTime                 |              |
| updatedAt      | DateTime @updatedAt      |              |

---

### `user_entity_roles`

Junction: user × entity × role. Mendukung multi-entity per user.

| Field             | Type                 | Notes                                  |
| ----------------- | -------------------- | -------------------------------------- |
| id                | String PK cuid       |                                        |
| userId            | String FK → users    |                                        |
| entityId          | String FK → entities |                                        |
| role              | Role enum            |                                        |
| jabatanLabel      | String?              | label jabatan dalam konteks entity ini |
| signatureImageKey | String?              | GCS key — tanda tangan                 |
| isActive          | Boolean default true |                                        |
| createdAt         | DateTime             |                                        |

`@@unique([userId, entityId, role])`

---

### `refresh_tokens`

Token penyimpan sesi, dirotasi setiap refresh.

| Field     | Type                  | Notes                |
| --------- | --------------------- | -------------------- |
| id        | String PK cuid        |                      |
| userId    | String FK → users     |                      |
| token     | String unique         | opaque random 64 hex |
| expiresAt | DateTime              |                      |
| isRevoked | Boolean default false |                      |
| createdAt | DateTime              |                      |

---

### `role_permissions`

Default permission per role. Basis dari permission gate (S3).

| Field      | Type           | Notes                                              |
| ---------- | -------------- | -------------------------------------------------- |
| id         | String PK cuid |                                                    |
| role       | Role enum      |                                                    |
| moduleCode | String         | e.g. "M1", "M4", "M10"                             |
| permission | String         | e.g. "view", "create", "edit", "delete", "approve" |

`@@unique([role, moduleCode, permission])`

---

### `user_permissions`

Override per user — bisa grant atau revoke dari default role_permissions.

| Field      | Type              | Notes                                          |
| ---------- | ----------------- | ---------------------------------------------- |
| id         | String PK cuid    |                                                |
| userId     | String FK → users |                                                |
| moduleCode | String            |                                                |
| permission | String            |                                                |
| granted    | Boolean           | true = override grant, false = override revoke |

`@@unique([userId, moduleCode, permission])`

---

### `system_settings`

Global parameters. Satu baris tunggal (singleton pattern).

| Field                 | Type                | Notes           |
| --------------------- | ------------------- | --------------- |
| id                    | String PK cuid      |                 |
| kursUsd               | Decimal             | Kurs USD ke IDR |
| kursRmb               | Decimal             | Kurs RMB ke IDR |
| tariffBeaMasuk        | Decimal             | %               |
| ppnImpor              | Decimal             | %               |
| pphImpor              | Decimal             | %               |
| marginDefault         | Decimal             | %               |
| discountResellerTier1 | Decimal             | % (1-3 unit)    |
| discountResellerTier2 | Decimal             | % (4-7 unit)    |
| discountResellerTier3 | Decimal             | % (7-10 unit)   |
| discountProject       | Decimal             | % (>10 unit)    |
| ppnPenjualan          | Decimal             | %, e.g. 11      |
| updatedByUserId       | String? FK → users  |                 |
| updatedAt             | DateTime @updatedAt |                 |

---

## M1 — Entity Management

### `entities`

| Field               | Type                | Notes                                                   |
| ------------------- | ------------------- | ------------------------------------------------------- |
| id                  | String PK cuid      |                                                         |
| name                | String              |                                                         |
| code                | String unique       | e.g. "PPS", "PTI"                                       |
| type                | EntityType enum     | PT \| CV                                                |
| npwp                | String?             |                                                         |
| nib                 | String?             |                                                         |
| address             | String              |                                                         |
| phone               | String?             |                                                         |
| email               | String?             |                                                         |
| website             | String?             |                                                         |
| logoKey             | String?             | GCS key                                                 |
| descriptionRichText | String?             |                                                         |
| companyProfileKey   | String?             | jika diupload, prioritaskan ini; jika null → auto-merge |
| createdAt           | DateTime            |                                                         |
| updatedAt           | DateTime @updatedAt |                                                         |

---

### `entity_legal_docs`

| Field       | Type                 | Notes                         |
| ----------- | -------------------- | ----------------------------- |
| id          | String PK cuid       |                               |
| entityId    | String FK → entities |                               |
| docType     | String               | e.g. "AKTA_PENDIRIAN", "SIUP" |
| fileKey     | String               | GCS key                       |
| issuedDate  | DateTime?            |                               |
| expiredDate | DateTime?            |                               |
| notes       | String?              |                               |
| createdAt   | DateTime             |                               |
| updatedAt   | DateTime @updatedAt  |                               |

---

### `entity_letter_configs`

Template format nomor surat per entity.

| Field              | Type                        | Notes                                                                  |
| ------------------ | --------------------------- | ---------------------------------------------------------------------- |
| id                 | String PK cuid              |                                                                        |
| entityId           | String unique FK → entities | 1-to-1                                                                 |
| formatTemplate     | String                      | e.g. `{counter}/{surat_type}/{entity}/{division}/{month_roman}/{year}` |
| hasDivisionSegment | Boolean default false       | PPS=true, PTI=false                                                    |
| createdAt          | DateTime                    |                                                                        |
| updatedAt          | DateTime @updatedAt         |                                                                        |

---

### `letter_types`

Master jenis surat. Dipakai oleh counter engine (S1).

| Field     | Type                 | Notes                   |
| --------- | -------------------- | ----------------------- |
| id        | String PK cuid       |                         |
| code      | String unique        | e.g. "SA", "SPH", "SPA" |
| name      | String               | e.g. "Surat Audiensi"   |
| isActive  | Boolean default true |                         |
| createdAt | DateTime             |                         |

---

### `letter_number_counters`

Counter nomor surat per (entity × letter_type × tahun). Reset 1 Jan setiap tahun.

| Field        | Type                     | Notes                            |
| ------------ | ------------------------ | -------------------------------- |
| id           | String PK cuid           |                                  |
| entityId     | String FK → entities     |                                  |
| letterTypeId | String FK → letter_types |                                  |
| year         | Int                      | e.g. 2026                        |
| counter      | Int default 0            | auto-increment via atomic update |

`@@unique([entityId, letterTypeId, year])`

---

## M2 — Division Management

### `divisions`

| Field       | Type                      | Notes                                         |
| ----------- | ------------------------- | --------------------------------------------- |
| id          | String PK cuid            |                                               |
| name        | String                    |                                               |
| code        | String? unique            | kode divisi — untuk PPS letter numbering saja |
| logoKey     | String?                   | GCS key                                       |
| description | String?                   |                                               |
| headUserId  | String? unique FK → users | 1 kepala divisi                               |
| isActive    | Boolean default true      |                                               |
| createdAt   | DateTime                  |                                               |
| updatedAt   | DateTime @updatedAt       |                                               |

---

## M4 — Client Master

### `clients`

| Field              | Type                              | Notes                           |
| ------------------ | --------------------------------- | ------------------------------- |
| id                 | String PK cuid                    |                                 |
| institutionName    | String                            |                                 |
| address            | String?                           |                                 |
| phone              | String?                           |                                 |
| website            | String?                           |                                 |
| status             | ClientStatus enum default PROSPEK |                                 |
| qualificationScore | Decimal?                          | 0-100, Technology division only |
| notes              | String?                           |                                 |
| createdAt          | DateTime                          |                                 |
| updatedAt          | DateTime @updatedAt               |                                 |

---

### `client_pics`

Multiple PIC per client.

| Field     | Type                  | Notes |
| --------- | --------------------- | ----- |
| id        | String PK cuid        |       |
| clientId  | String FK → clients   |       |
| name      | String                |       |
| position  | String?               |       |
| phone     | String?               |       |
| email     | String?               |       |
| isPrimary | Boolean default false |       |
| createdAt | DateTime              |       |

---

### `client_status_logs`

Append-only. Setiap perubahan status client terekam beserta trigger-nya.

| Field           | Type                | Notes                        |
| --------------- | ------------------- | ---------------------------- |
| id              | String PK cuid      |                              |
| clientId        | String FK → clients |                              |
| fromStatus      | ClientStatus?       | null jika pertama kali       |
| toStatus        | ClientStatus        |                              |
| triggerModule   | String              | "M11", "M13", "MANUAL", etc. |
| triggerRecordId | String?             | ID record yang memicu        |
| notes           | String?             |                              |
| changedByUserId | String FK → users   |                              |
| createdAt       | DateTime            |                              |

`@@index([clientId])`

---

## M5 — Supplier Master

### `suppliers`

| Field       | Type                              | Notes                  |
| ----------- | --------------------------------- | ---------------------- |
| id          | String PK cuid                    |                        |
| name        | String                            |                        |
| type        | SupplierType enum                 | PERUSAHAAN \| INDIVIDU |
| category    | SupplierCategory enum             | BARANG \| JASA         |
| status      | SupplierStatus enum default AKTIF |                        |
| npwp        | String?                           |                        |
| bankAccount | String?                           |                        |
| bankName    | String?                           |                        |
| address     | String?                           |                        |
| email       | String?                           |                        |
| website     | String?                           |                        |
| notes       | String?                           |                        |
| createdAt   | DateTime                          |                        |
| updatedAt   | DateTime @updatedAt               |                        |

---

### `supplier_tags`

| Field      | Type                  | Notes           |
| ---------- | --------------------- | --------------- |
| id         | String PK cuid        |                 |
| supplierId | String FK → suppliers |                 |
| tag        | String                | free-form input |

`@@index([supplierId])`

---

### `supplier_pics`

| Field      | Type                  | Notes                |
| ---------- | --------------------- | -------------------- |
| id         | String PK cuid        |                      |
| supplierId | String FK → suppliers |                      |
| name       | String                |                      |
| phone      | String                |                      |
| whatsapp   | String?               | bisa beda dari phone |
| position   | String?               |                      |
| isPrimary  | Boolean default false |                      |
| createdAt  | DateTime              |                      |

---

## M6 — Document Management

### `document_folders`

Hanya sistem folder (ISO 9001). Tidak ada user-created folder.

| Field      | Type                          | Notes                                    |
| ---------- | ----------------------------- | ---------------------------------------- |
| id         | String PK cuid                |                                          |
| name       | String                        |                                          |
| parentId   | String? FK → document_folders | self-referential, null = root            |
| isoPath    | String?                       | e.g. "4.2.1" — ISO 9001 reference        |
| moduleCode | String?                       | modul yang auto-save ke sini, e.g. "M10" |
| createdAt  | DateTime                      |                                          |

---

### `folder_permissions`

| Field       | Type                         | Notes |
| ----------- | ---------------------------- | ----- |
| id          | String PK cuid               |       |
| folderId    | String FK → document_folders |       |
| role        | Role enum                    |       |
| canView     | Boolean default false        |       |
| canUpload   | Boolean default false        |       |
| canDownload | Boolean default false        |       |

`@@unique([folderId, role])`

---

### `document_files`

Setiap upload = record baru. Version increment per (folder, originalName).

| Field            | Type                         | Notes                                       |
| ---------------- | ---------------------------- | ------------------------------------------- |
| id               | String PK cuid               |                                             |
| folderId         | String FK → document_folders |                                             |
| originalName     | String                       | nama file tanpa suffix versi                |
| fileKey          | String                       | GCS key — unik (include versi di key)       |
| version          | Int default 1                | increment per nama file di folder yang sama |
| mimeType         | String                       |                                             |
| fileSizeBytes    | Int                          |                                             |
| moduleCode       | String?                      | modul yang generate file ini                |
| moduleRecordId   | String?                      | ID record terkait                           |
| uploadedByUserId | String FK → users            |                                             |
| createdAt        | DateTime                     |                                             |

`@@index([folderId, originalName])`  
`@@index([moduleCode, moduleRecordId])`

---

### `folder_password_access`

Audit setiap akses dengan password (user tanpa permission reguler).

| Field      | Type                         | Notes |
| ---------- | ---------------------------- | ----- |
| id         | String PK cuid               |       |
| folderId   | String FK → document_folders |       |
| userId     | String FK → users            |       |
| ipAddress  | String?                      |       |
| accessedAt | DateTime default now()       |       |

---

## M7 — Account Vault

### `account_vault_entries`

| Field             | Type                   | Notes                                        |
| ----------------- | ---------------------- | -------------------------------------------- |
| id                | String PK cuid         |                                              |
| name              | String                 | nama akun                                    |
| accountType       | String                 | free-form (e.g. "Email", "Server", "Domain") |
| username          | String                 |                                              |
| encryptedPassword | String                 | AES-256                                      |
| url               | String?                |                                              |
| expiredAt         | DateTime?              |                                              |
| scope             | AccountVaultScope enum | ENTITY \| DIVISION \| COMPANY                |
| entityId          | String? FK → entities  | null jika bukan ENTITY scope                 |
| divisionId        | String? FK → divisions | null jika bukan DIVISION scope               |
| notes             | String?                |                                              |
| createdByUserId   | String FK → users      |                                              |
| createdAt         | DateTime               |                                              |
| updatedAt         | DateTime @updatedAt    |                                              |

---

### `account_vault_access_logs`

Append-only. Setiap reveal password dicatat.

| Field        | Type                              | Notes                           |
| ------------ | --------------------------------- | ------------------------------- |
| id           | String PK cuid                    |                                 |
| vaultEntryId | String FK → account_vault_entries |                                 |
| userId       | String FK → users                 |                                 |
| action       | String                            | "VIEW_PASSWORD" \| "VIEW_ENTRY" |
| ipAddress    | String?                           |                                 |
| createdAt    | DateTime                          |                                 |

`@@index([vaultEntryId])`

---

## M8 — HR Leave & Approval

### `leave_requests`

| Field            | Type                             | Notes                           |
| ---------------- | -------------------------------- | ------------------------------- |
| id               | String PK cuid                   |                                 |
| userId           | String FK → users                | pemohon                         |
| leaveType        | LeaveType enum                   |                                 |
| startDate        | DateTime?                        | null untuk IZIN_WAKTU           |
| endDate          | DateTime?                        | null untuk IZIN_WAKTU           |
| startTime        | DateTime?                        | untuk IZIN_WAKTU                |
| endTime          | DateTime?                        | untuk IZIN_WAKTU                |
| halfDayPeriod    | HalfDayPeriod?                   | PAGI \| SORE jika setengah hari |
| durationDays     | Decimal                          | auto-calculated, stored         |
| reason           | String                           |                                 |
| attachmentKey    | String?                          | GCS key — wajib untuk SAKIT     |
| status           | LeaveStatus enum default PENDING |                                 |
| approvedByUserId | String? FK → users               |                                 |
| approvedAt       | DateTime?                        |                                 |
| rejectionReason  | String?                          |                                 |
| createdAt        | DateTime                         |                                 |
| updatedAt        | DateTime @updatedAt              |                                 |

---

### `leave_balances`

Saldo cuti per user per tahun.

| Field            | Type                | Notes                         |
| ---------------- | ------------------- | ----------------------------- |
| id               | String PK cuid      |                               |
| userId           | String FK → users   |                               |
| year             | Int                 |                               |
| annualLeaveTotal | Int default 12      |                               |
| annualLeaveUsed  | Decimal default 0   |                               |
| swapLeaveBalance | Decimal default 0   | saldo tukar off (dari lembur) |
| createdAt        | DateTime            |                               |
| updatedAt        | DateTime @updatedAt |                               |

`@@unique([userId, year])`

---

## M9 — Company Regulations

### `regulations`

| Field            | Type                   | Notes                       |
| ---------------- | ---------------------- | --------------------------- |
| id               | String PK cuid         |                             |
| title            | String                 |                             |
| contentRichText  | String?                |                             |
| category         | String                 | free-form, configurable     |
| divisionId       | String? FK → divisions | null = berlaku semua divisi |
| isPinned         | Boolean default false  | wajib baca, tampil di atas  |
| fileKey          | String?                | GCS key — optional PDF/doc  |
| uploadedByUserId | String FK → users      |                             |
| createdAt        | DateTime               |                             |
| updatedAt        | DateTime @updatedAt    |                             |

---

### `regulation_read_status`

Read tracking per user.

| Field        | Type                    | Notes |
| ------------ | ----------------------- | ----- |
| id           | String PK cuid          |       |
| regulationId | String FK → regulations |       |
| userId       | String FK → users       |       |
| readAt       | DateTime                |       |

`@@unique([regulationId, userId])`

---

## M10 — Letter Generator

### `letter_templates`

| Field           | Type                 | Notes                                             |
| --------------- | -------------------- | ------------------------------------------------- |
| id              | String PK cuid       |                                                   |
| title           | String               |                                                   |
| contentRichText | String               | with placeholders: {{client_name}}, {{date}}, dst |
| divisionTags    | String[]             | filter saja, bukan ownership                      |
| isActive        | Boolean default true |                                                   |
| createdByUserId | String FK → users    | Manager+                                          |
| createdAt       | DateTime             |                                                   |
| updatedAt       | DateTime @updatedAt  |                                                   |

---

### `letters`

| Field                     | Type                            | Notes                                        |
| ------------------------- | ------------------------------- | -------------------------------------------- |
| id                        | String PK cuid                  |                                              |
| templateId                | String? FK → letter_templates   | nullable jika template dihapus               |
| entityId                  | String FK → entities            | entitas pengirim surat                       |
| clientId                  | String? FK → clients            | penerima                                     |
| subject                   | String                          |                                              |
| contentRichText           | String                          | konten final setelah diedit                  |
| signatoryUserEntityRoleId | String FK → user_entity_roles   | yang menandatangani                          |
| letterTypeId              | String? FK → letter_types       |                                              |
| letterNumber              | String?                         | NULL hingga APPROVED — assigned saat approve |
| status                    | LetterStatus enum default DRAFT |                                              |
| pdfFileKey                | String?                         | GCS key — hanya setelah APPROVED             |
| sentAt                    | DateTime?                       |                                              |
| receiptFileKey            | String?                         | GCS key — tanda terima                       |
| createdByUserId           | String FK → users               |                                              |
| createdAt                 | DateTime                        |                                              |
| updatedAt                 | DateTime @updatedAt             |                                              |

---

### `letter_approvals`

Log setiap tindakan approval/rejection.

| Field           | Type                         | Notes                              |
| --------------- | ---------------------------- | ---------------------------------- |
| id              | String PK cuid               |                                    |
| letterId        | String FK → letters          |                                    |
| action          | LetterApprovalAction enum    |                                    |
| actionByUserId  | String FK → users            |                                    |
| rejectionReason | String?                      |                                    |
| revisionType    | LetterRejectionRevisionType? | REVISE_CONTENT \| CHANGE_SIGNATORY |
| createdAt       | DateTime                     |                                    |

`@@index([letterId])`

---

## M11 — Pre-Sales / CRM

### `presales_monthly_plans`

Rencana bulanan per marketing. Wajib disubmit sebelum bulan berjalan.

| Field       | Type                | Notes                       |
| ----------- | ------------------- | --------------------------- |
| id          | String PK cuid      |                             |
| userId      | String FK → users   | marketing yang bersangkutan |
| month       | Int                 | 1-12                        |
| year        | Int                 |                             |
| submittedAt | DateTime?           | null = belum submit         |
| createdAt   | DateTime            |                             |
| updatedAt   | DateTime @updatedAt |                             |

`@@unique([userId, month, year])`

---

### `presales_prospects`

Satu prospek per entri pipeline. Bergerak melalui stage.

| Field              | Type                               | Notes                                   |
| ------------------ | ---------------------------------- | --------------------------------------- |
| id                 | String PK cuid                     |                                         |
| monthlyPlanId      | String FK → presales_monthly_plans |                                         |
| clientId           | String? FK → clients               | diisi setelah klien diregistrasi di M4  |
| prospectName       | String                             | nama sebelum diregistrasi sebagai klien |
| currentStage       | PipelineStage enum default RENCANA |                                         |
| decision           | ProspectDecision?                  | diisi saat pipeline berakhir            |
| ownershipUserId    | String FK → users                  | marketing pemegang prospek              |
| qualificationScore | Decimal?                           | dari form qualification                 |
| dealValueEstimate  | Decimal?                           |                                         |
| audienceLetterId   | String? FK → letters               | surat audiensi terkait                  |
| sphLetterId        | String? FK → letters               | SPH terkait                             |
| notes              | String?                            |                                         |
| createdAt          | DateTime                           |                                         |
| updatedAt          | DateTime @updatedAt                |                                         |

`@@index([ownershipUserId])`  
`@@index([clientId])`

---

### `presales_followup_logs`

Append-only. Tidak boleh diedit setelah dibuat.

| Field          | Type                           | Notes                  |
| -------------- | ------------------------------ | ---------------------- |
| id             | String PK cuid                 |                        |
| prospectId     | String FK → presales_prospects |                        |
| followupDate   | DateTime                       |                        |
| media          | FollowUpMedia enum             |                        |
| summary        | String                         | hasil/ringkasan        |
| obstacles      | String?                        | kendala                |
| solution       | String?                        | solusi                 |
| nextAction     | String?                        | drives next scheduling |
| nextActionDate | DateTime?                      |                        |
| loggedByUserId | String FK → users              |                        |
| createdAt      | DateTime                       |                        |

`@@index([prospectId])`

---

## M13 — After-Sales

### `aftersales_records`

Satu record per klien (ongoing relationship).

| Field            | Type                       | Notes                     |
| ---------------- | -------------------------- | ------------------------- |
| id               | String PK cuid             |                           |
| clientId         | String unique FK → clients |                           |
| projectReference | String?                    | referensi ke M12 (future) |
| isActive         | Boolean default true       |                           |
| createdAt        | DateTime                   |                           |
| updatedAt        | DateTime @updatedAt        |                           |

---

### `aftersales_followup_logs`

Append-only. Screenshot wajib ada.

| Field              | Type                           | Notes             |
| ------------------ | ------------------------------ | ----------------- |
| id                 | String PK cuid                 |                   |
| aftersalesRecordId | String FK → aftersales_records |                   |
| followupDate       | DateTime                       |                   |
| media              | String                         |                   |
| summary            | String                         | hasil             |
| obstacles          | String?                        |                   |
| solution           | String?                        |                   |
| nextAction         | String?                        |                   |
| nextActionDate     | DateTime?                      |                   |
| deviceCondition    | String?                        | kondisi alat RFID |
| rfidTagStockNote   | String?                        |                   |
| screenshotKey      | String                         | GCS key — WAJIB   |
| loggedByUserId     | String FK → users              |                   |
| createdAt          | DateTime                       |                   |

`@@index([aftersalesRecordId])`

---

## M15 — Product Catalog

### `products`

| Field           | Type                 | Notes        |
| --------------- | -------------------- | ------------ |
| id              | String PK cuid       |              |
| name            | String               |              |
| code            | String unique        |              |
| category        | String               | configurable |
| vendor          | String               |              |
| countryOfOrigin | String?              |              |
| isActive        | Boolean default true |              |
| createdByUserId | String FK → users    |              |
| createdAt       | DateTime             |              |
| updatedAt       | DateTime @updatedAt  |              |

---

### `product_photos`

| Field     | Type                 | Notes   |
| --------- | -------------------- | ------- |
| id        | String PK cuid       |         |
| productId | String FK → products |         |
| fileKey   | String               | GCS key |
| sortOrder | Int default 0        |         |
| createdAt | DateTime             |         |

---

### `product_specs`

Free-form spec fields (Tab 1).

| Field      | Type                 | Notes            |
| ---------- | -------------------- | ---------------- |
| id         | String PK cuid       |                  |
| productId  | String FK → products |                  |
| fieldTitle | String               | e.g. "Frekuensi" |
| fieldValue | String               | e.g. "915 MHz"   |
| sortOrder  | Int default 0        |                  |
| createdAt  | DateTime             |                  |
| updatedAt  | DateTime @updatedAt  |                  |

---

### `product_hpp`

HPP calculation data (Tab 2). Satu record per produk.

| Field            | Type                        | Notes                                              |
| ---------------- | --------------------------- | -------------------------------------------------- |
| id               | String PK cuid              |                                                    |
| productId        | String unique FK → products |                                                    |
| currency         | ProductCurrency enum        | USD \| RMB \| IDR                                  |
| factoryPrice     | Decimal                     | harga pabrik                                       |
| shippingCost     | Decimal default 0           |                                                    |
| handlingCost     | Decimal default 0           |                                                    |
| localCosts       | Decimal default 0           |                                                    |
| tariffOverride   | Decimal?                    | null = pakai System Settings                       |
| ppnImporOverride | Decimal?                    |                                                    |
| pphImporOverride | Decimal?                    |                                                    |
| hppCalculated    | Decimal                     | stored result — recalculate saat parameter berubah |
| calculatedAt     | DateTime                    | kapan terakhir dihitung                            |
| createdAt        | DateTime                    |                                                    |
| updatedAt        | DateTime @updatedAt         |                                                    |

---

### `product_retail_pricing`

Pricing tiers (Tab 3). Satu record per produk.

| Field              | Type                        | Notes     |
| ------------------ | --------------------------- | --------- |
| id                 | String PK cuid              |           |
| productId          | String unique FK → products |           |
| msrp               | Decimal                     |           |
| priceResellerTier1 | Decimal                     | 1-3 unit  |
| priceResellerTier2 | Decimal                     | 4-7 unit  |
| priceResellerTier3 | Decimal                     | 7-10 unit |
| priceProject       | Decimal                     | >10 unit  |
| priceSp2d          | Decimal                     |           |
| pphRate            | Decimal default 1.5         | %         |
| ppnRate            | Decimal default 11          | %         |
| createdAt          | DateTime                    |           |
| updatedAt          | DateTime @updatedAt         |           |

---

### `competitor_prices`

Referensi harga kompetitor (Tab 3).

| Field           | Type                 | Notes |
| --------------- | -------------------- | ----- |
| id              | String PK cuid       |       |
| productId       | String FK → products |       |
| competitorName  | String               |       |
| competitorPrice | Decimal              |       |
| currency        | String default "IDR" |       |
| notedAt         | DateTime             |       |
| notes           | String?              |       |
| createdAt       | DateTime             |       |

---

### `product_bundles`

Bundling hardware + software (Tab 4).

| Field               | Type                 | Notes                     |
| ------------------- | -------------------- | ------------------------- |
| id                  | String PK cuid       |                           |
| productId           | String FK → products | hardware utama            |
| bundleName          | String               | e.g. "AMS + C72 Reader"   |
| softwareName        | String               | e.g. "AMS"                |
| softwareDescription | String?              |                           |
| softwareFeatures    | String?              | rich text / JSON          |
| softwareModules     | String?              |                           |
| softwarePlatform    | String?              |                           |
| softwareCapacity    | String?              |                           |
| bundlePrice         | Decimal              | set manual oleh Manager+  |
| commissionMktEks    | Decimal              | auto-calc dari SP2D × 20% |
| commissionSubAgen   | Decimal              | SP2D × 30%                |
| commissionAgen      | Decimal              | SP2D × 40%                |
| isActive            | Boolean default true |                           |
| createdByUserId     | String FK → users    |                           |
| createdAt           | DateTime             |                           |
| updatedAt           | DateTime @updatedAt  |                           |

---

### `product_change_logs`

Append-only. Semua perubahan produk terekam.

| Field           | Type                 | Notes                                   |
| --------------- | -------------------- | --------------------------------------- |
| id              | String PK cuid       |                                         |
| productId       | String FK → products |                                         |
| tab             | String               | "HPP" \| "RETAIL" \| "BUNDLE" \| "SPEC" |
| fieldName       | String               | nama field yang berubah                 |
| oldValue        | String?              |                                         |
| newValue        | String               |                                         |
| changeSummary   | String               | e.g. "HPP naik 8.9%"                    |
| changedByUserId | String FK → users    |                                         |
| createdAt       | DateTime             |                                         |

`@@index([productId])`

---

## M17 — Inventory & Stock

### `inventory_items`

| Field     | Type                   | Notes                            |
| --------- | ---------------------- | -------------------------------- |
| id        | String PK cuid         |                                  |
| name      | String                 |                                  |
| itemType  | InventoryItemType enum | HARDWARE \| CONSUMABLE           |
| unit      | String                 | "unit", "pcs", "roll", dll       |
| productId | String? FK → products  | null = standalone item           |
| minStock  | Int default 0          | batas minimum untuk warna status |
| isActive  | Boolean default true   |                                  |
| notes     | String?                |                                  |
| createdAt | DateTime               |                                  |
| updatedAt | DateTime @updatedAt    |                                  |

---

### `inventory_movements`

Append-only. Semua transaksi stok.

| Field                | Type                        | Notes                                   |
| -------------------- | --------------------------- | --------------------------------------- |
| id                   | String PK cuid              |                                         |
| itemId               | String FK → inventory_items |                                         |
| movementType         | InventoryMovementType enum  |                                         |
| quantity             | Int                         | positif = masuk, negatif = keluar/rusak |
| supplierId           | String? FK → suppliers      | untuk MASUK                             |
| movementDate         | DateTime                    |                                         |
| purchasePriceForeign | Decimal?                    | harga beli mata uang asal               |
| purchaseCurrency     | String?                     | "USD" \| "RMB" \| "IDR"                 |
| purchasePriceIdr     | Decimal?                    | konversi ke IDR                         |
| destination          | String?                     | untuk KELUAR: proyek/penerima           |
| reason               | String?                     | untuk RUSAK, DEV, PENYESUAIAN           |
| referenceDoc         | String?                     | nomor PO / delivery note                |
| loggedByUserId       | String FK → users           |                                         |
| createdAt            | DateTime                    |                                         |

`@@index([itemId])`  
`@@index([movementDate])`

---

### `inventory_serial_numbers`

Satu record per unit hardware. Status berubah sesuai movement.

| Field          | Type                                 | Notes                              |
| -------------- | ------------------------------------ | ---------------------------------- |
| id             | String PK cuid                       |                                    |
| itemId         | String FK → inventory_items          |                                    |
| serialNumber   | String unique                        |                                    |
| status         | SerialNumberStatus enum default STOK |                                    |
| lastMovementId | String? FK → inventory_movements     | movement yang terakhir ubah status |
| createdAt      | DateTime                             |                                    |
| updatedAt      | DateTime @updatedAt                  |                                    |

`@@index([itemId])`

---

## M18-M21 — Intelligence Layer

### `notifications`

In-app notifications (M21).

| Field          | Type                  | Notes                                                    |
| -------------- | --------------------- | -------------------------------------------------------- |
| id             | String PK cuid        |                                                          |
| userId         | String FK → users     | penerima                                                 |
| type           | String                | e.g. "LEAVE_APPROVED", "LETTER_REJECTED", "VAULT_EXPIRY" |
| title          | String                |                                                          |
| body           | String                |                                                          |
| moduleCode     | String?               |                                                          |
| moduleRecordId | String?               |                                                          |
| isRead         | Boolean default false |                                                          |
| readAt         | DateTime?             |                                                          |
| createdAt      | DateTime              |                                                          |

`@@index([userId, isRead])`

---

### `notification_preferences`

Konfigurasi per user × trigger type (M21).

| Field        | Type                 | Notes |
| ------------ | -------------------- | ----- |
| id           | String PK cuid       |       |
| userId       | String FK → users    |       |
| triggerType  | String               |       |
| inAppEnabled | Boolean default true |       |
| emailEnabled | Boolean default true |       |

`@@unique([userId, triggerType])`

---

### `report_jobs`

Tracking scheduled dan on-demand report generation (M19).

| Field             | Type                              | Notes                                    |
| ----------------- | --------------------------------- | ---------------------------------------- |
| id                | String PK cuid                    |                                          |
| reportType        | String                            | system-defined template name             |
| periodStart       | DateTime                          |                                          |
| periodEnd         | DateTime                          |                                          |
| generatedByUserId | String? FK → users                | null = auto-scheduled                    |
| fileKey           | String?                           | GCS key — diisi setelah generate selesai |
| status            | ReportStatus enum default PENDING |                                          |
| errorMessage      | String?                           | jika FAILED                              |
| createdAt         | DateTime                          |                                          |
| updatedAt         | DateTime @updatedAt               |                                          |

---

### `audit_logs`

Global append-only audit trail (M20 / S4).

| Field      | Type               | Notes                                                   |
| ---------- | ------------------ | ------------------------------------------------------- |
| id         | String PK cuid     |                                                         |
| userId     | String? FK → users | null = system action                                    |
| moduleCode | String             | "M1", "M4", "M10", dll                                  |
| recordId   | String             | ID dari record yang dipengaruhi                         |
| action     | AuditAction enum   | CREATE \| UPDATE \| DELETE \| APPROVE \| REJECT \| VIEW |
| fieldName  | String?            | untuk UPDATE: field yang berubah                        |
| oldValue   | String?            |                                                         |
| newValue   | String?            |                                                         |
| ipAddress  | String?            |                                                         |
| createdAt  | DateTime           |                                                         |

`@@index([moduleCode, recordId])`  
`@@index([userId])`  
`@@index([createdAt])`

---

## Relasi Antar Modul — Diagram Singkat

```
users ──────────────── user_extensions (1:1)
  │                  └─ user_entity_roles (M:N ↔ entities)
  │                  └─ divisions (N:1)
  │
entities ──────────── entity_legal_docs
  │                └─ entity_letter_configs (1:1)
  │                └─ letter_number_counters (via letter_types)
  │
clients ────────────── client_pics
  │                └─ client_status_logs [append-only]
  │                └─ presales_prospects (M11)
  │                └─ aftersales_records (M13)
  │
products ───────────── product_specs / product_photos
  │                └─ product_hpp (1:1)
  │                └─ product_retail_pricing (1:1)
  │                └─ product_bundles
  │                └─ product_change_logs [append-only]
  │                └─ inventory_items (optional FK)
  │
inventory_items ────── inventory_movements [append-only]
                   └─ inventory_serial_numbers

letters ────────────── letter_approvals [append-only]
  │                └─ entity_letter_configs (number format)
  │                └─ letter_number_counters (number assign on approve)

audit_logs ─────────── GLOBAL: semua modul feed ke sini [append-only]
```

---

## Catatan Desain

1. **Append-only tables** (TIDAK BOLEH UPDATE/DELETE): `audit_logs`, `client_status_logs`, `presales_followup_logs`, `aftersales_followup_logs`, `inventory_movements`, `letter_approvals`, `product_change_logs`, `account_vault_access_logs`. Repository-nya hanya expose `create()`, tidak ada `update()` atau `delete()`.

2. **Nomor surat** di-assign secara atomik via `UPDATE ... SET counter = counter + 1 RETURNING counter` dalam satu transaksi saat status letter berubah ke APPROVED. Tidak pernah di-assign sebelumnya.

3. **HPP recalculation** dipicu oleh: (a) perubahan data di `product_hpp`, atau (b) perubahan `system_settings`. Disimpan sebagai stored value (`hppCalculated`) untuk performa — tidak dihitung real-time di setiap request.

4. **Stock level** tidak disimpan sebagai kolom statis. Dihitung dari `SUM(quantity) FROM inventory_movements WHERE itemId = ?`. Untuk performa di tabel besar, tambahkan materialized view atau triggered counter di masa depan.

5. **Permission check order**: cek `user_permissions` terlebih dahulu (override). Jika tidak ada record → fallback ke `role_permissions` berdasarkan role user di entity yang relevan (via `user_entity_roles`).

6. **GCS private files**: semua `*Key` fields menyimpan relative key (bukan full URL). Akses melalui proxy `GET /api/files/[key]` yang verifikasi auth + permission sebelum stream.

7. **Soft delete pattern**: tidak ada hard delete untuk `users`, `clients`, `suppliers`, `products`. Gunakan `isActive = false`. Record tetap ada untuk referential integrity dan audit history.
