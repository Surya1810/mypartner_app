# Phase 3 — API & State Management Guidelines

**Framework:** Nuxt.js 4  
**Approach:** Frontend First — bagian API naming adalah kontrak untuk wiring nanti  
**Date:** 2026-06-23

---

## 1. API Naming Conventions

Semua endpoint mengikuti REST + kebab-case. Executor wajib konsisten dengan konvensi ini agar wiring frontend ↔ backend menjadi mekanis, bukan manual.

### Pola Dasar

| Method | Path                          | Tindakan                                                        |
| ------ | ----------------------------- | --------------------------------------------------------------- |
| GET    | `/api/[module]`               | Paginated list                                                  |
| GET    | `/api/[module]/[id]`          | Single resource                                                 |
| POST   | `/api/[module]`               | Create                                                          |
| PATCH  | `/api/[module]/[id]`          | Partial update                                                  |
| DELETE | `/api/[module]/[id]`          | Soft delete (set `isActive = false`) — tidak pernah hard delete |
| POST   | `/api/[module]/[id]/[action]` | State transition (approve, reject, send, reveal)                |

### Contoh Penerapan Per Modul

```
M1  GET    /api/entities
    POST   /api/entities
    GET    /api/entities/:id
    PATCH  /api/entities/:id
    GET    /api/entities/:id/legal-docs
    POST   /api/entities/:id/legal-docs
    PATCH  /api/entities/:id/letter-config

M4  GET    /api/clients
    POST   /api/clients
    GET    /api/clients/:id
    PATCH  /api/clients/:id
    GET    /api/clients/:id/status-logs       ← append-only, GET only
    GET    /api/clients/:id/pics
    POST   /api/clients/:id/pics

M8  GET    /api/leave
    POST   /api/leave
    GET    /api/leave/:id
    POST   /api/leave/:id/approve             ← state transition
    POST   /api/leave/:id/reject
    GET    /api/leave/balance                 ← saldo saya

M10 GET    /api/letters
    POST   /api/letters
    GET    /api/letters/:id
    PATCH  /api/letters/:id
    POST   /api/letters/:id/approve           ← assign nomor surat + generate PDF
    POST   /api/letters/:id/reject
    POST   /api/letters/:id/send
    GET    /api/letters/templates
    POST   /api/letters/templates
    GET    /api/letters/templates/:id
    PATCH  /api/letters/templates/:id

M11 GET    /api/presales/plans
    POST   /api/presales/plans
    GET    /api/presales/prospects
    POST   /api/presales/prospects
    GET    /api/presales/prospects/:id
    PATCH  /api/presales/prospects/:id
    POST   /api/presales/prospects/:id/follow-up    ← append log
    POST   /api/presales/prospects/:id/decide       ← import-project | pending
    POST   /api/presales/prospects/:id/transfer     ← transfer ownership

M7  POST   /api/vault/:id/reveal              ← log access + return decrypted password

M17 GET    /api/inventory/items
    POST   /api/inventory/items
    GET    /api/inventory/items/:id
    GET    /api/inventory/movements
    POST   /api/inventory/movements            ← semua 5 tipe movement
    GET    /api/inventory/serial-numbers/:sn  ← history per serial number

SYSTEM
    GET    /api/settings                       ← global parameters
    PATCH  /api/settings
    GET    /api/audit                          ← M20, filter via query params
    GET    /api/notifications                  ← M21
    POST   /api/notifications/:id/read
    GET    /api/notifications/preferences
    PATCH  /api/notifications/preferences
    GET    /api/reports
    POST   /api/reports/generate
    GET    /api/dashboard/stats
```

### Query Params Standard (semua list endpoint)

```
GET /api/clients?page=1&limit=10&search=partnership&status=ONGOING&sort=createdAt&order=desc
```

| Param     | Default     | Notes                                                            |
| --------- | ----------- | ---------------------------------------------------------------- |
| `page`    | 1           |                                                                  |
| `limit`   | 10          | max 100, di-clamp bukan ditolak                                  |
| `search`  | —           | full-text search di field utama                                  |
| `sort`    | `createdAt` | field name untuk sorting                                         |
| `order`   | `desc`      | `asc` \| `desc`                                                  |
| `[field]` | —           | filter spesifik per modul, e.g. `status=AKTIF`, `divisionId=xxx` |

### Response Envelope (sudah di backend rules, dicantumkan ulang untuk referensi)

```ts
// Single resource
{ success: true, data: { id, ... } }

// Paginated list
{ success: true, data: [...], meta: { total, page, limit, totalPages } }

// Error
{ success: false, message: "Pesan dalam Bahasa Indonesia.", errors: [{ field, message }] }
```

---

## 2. State Management

MyPartner **tidak menggunakan Pinia atau Vuex**. Nuxt 4's `useState` + composables sudah cukup untuk semua kebutuhan.

### Tiga Jenis State

```
Auth State          → useState('auth-user') via useAuth.ts
                      Diisi oleh plugins/auth.server.ts (SSR), direset saat logout
                      Shared across seluruh app, SSR-safe

Server State        → useFetch / useAsyncData (di dalam composables atau pages)
                      Auto-cache per key, re-fetch saat reactive deps berubah
                      Tidak perlu disimpan di reactive variable terpisah

Local UI State      → ref() / computed() di dalam composable atau component
                      Contoh: isModalOpen, selectedTab, selectedIds
                      Tidak perlu global, tidak perlu di useState
```

### Aturan Sederhana

| Pertanyaan                            | Jawaban                                       |
| ------------------------------------- | --------------------------------------------- |
| State perlu di-share antar component? | `useState(key, () => defaultValue)`           |
| State hanya untuk 1 component?        | `ref()` / `computed()` biasa                  |
| Data dari server untuk halaman?       | `useFetch()` di composable atau page          |
| Mutation dari user action?            | `$fetch()` di event handler                   |
| Auth/permission state?                | Selalu via `useAuth()` dan `usePermissions()` |

### Contoh Composable (pola standar semua modul)

```ts
// app/composables/useClients.ts
export function useClients() {
  // Server state — re-fetch saat page/limit berubah
  const page = ref(1);
  const limit = ref(10);
  const search = ref("");
  const statusFilter = ref<ClientStatus | "">("");

  const {
    data: response,
    refresh,
    pending,
  } = useFetch<ApiList<Client>>("/api/clients", {
    query: { page, limit, search, status: statusFilter },
    watch: [page, limit, search, statusFilter],
  });

  const clients = computed(() => response.value?.data ?? []);
  const meta = computed(() => response.value?.meta);

  // Mutation
  async function createClient(payload: CreateClientInput) {
    const res = await $fetch<ApiSuccess<Client>>("/api/clients", {
      method: "POST",
      body: payload,
    });
    await refresh();
    return res.data;
  }

  async function updateClientStatus(id: string, status: ClientStatus) {
    await $fetch(`/api/clients/${id}`, {
      method: "PATCH",
      body: { status },
    });
    await refresh();
  }

  return {
    clients,
    meta,
    page,
    limit,
    search,
    statusFilter,
    pending,
    refresh,
    createClient,
    updateClientStatus,
  };
}
```

### Composable di Page

```ts
// app/pages/clients/index.vue
<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { clients, meta, page, limit, search, pending } = useClients()
// Tidak ada $fetch langsung di page — semua lewat composable
</script>
```

---

## 3. Data Fetching Pattern

### Kapan `useFetch` vs `$fetch`

```
useFetch / useAsyncData
  → Data yang perlu di-render saat halaman load (SSR)
  → Data yang auto-refresh saat filter/page berubah
  → Selalu di dalam composable, bukan langsung di page

$fetch
  → Form submission (POST, PATCH)
  → Button action (approve, reject, upload)
  → Selalu di dalam try/catch
  → Selalu di dalam composable atau event handler, bukan di template
```

### Error Handling Pattern (`$fetch`)

```ts
// Di dalam composable, bukan di page
async function approveLeave(id: string) {
  try {
    await $fetch(`/api/leave/${id}/approve`, { method: "POST" });
    toast.success("Cuti berhasil disetujui.");
    await refresh();
  } catch (err) {
    const error = err as FetchError<ApiError>;
    toast.error(error.data?.message ?? "Terjadi kesalahan.");
  }
}
```

### Field-Level Error (form + backend validation)

```ts
// Saat backend return { errors: [{ field, message }] }
// Map kembali ke vee-validate form fields

const { handleSubmit, setFieldError } = useForm({ ... })

const onSubmit = handleSubmit(async (values) => {
  try {
    await $fetch('/api/clients', { method: 'POST', body: values })
    toast.success('Klien berhasil ditambahkan.')
    navigateTo('/clients')
  } catch (err) {
    const error = err as FetchError<ApiError>
    if (error.data?.errors?.length) {
      error.data.errors.forEach(e => setFieldError(e.field, e.message))
    } else {
      toast.error(error.data?.message ?? 'Terjadi kesalahan.')
    }
  }
})
```

---

## 4. Permission Gate di Frontend

Permission check di frontend adalah **defense in depth** — bukan keamanan utama (itu di server). Tujuannya hanya UX: menyembunyikan tombol/menu yang tidak relevan.

```ts
// app/composables/usePermissions.ts
export function usePermissions() {
  const { user } = useAuth();

  function can(module: string, action: string): boolean {
    if (!user.value) return false;
    // Cek dari user.value.permissions (dikirim oleh /api/auth/me)
    return user.value.permissions?.[module]?.includes(action) ?? false;
  }

  const isDirectur = computed(() => user.value?.role === "DIREKTUR");
  const isManager = computed(
    () => user.value?.role === "MANAGER" || isDirectur.value,
  );
  const isInternal = computed(() =>
    ["DIREKTUR", "MANAGER", "STAFF"].includes(user.value?.role ?? ""),
  );
  const isMitra = computed(() => user.value?.role === "MITRA");

  return { can, isDirectur, isManager, isInternal, isMitra };
}
```

```vue
<!-- Penggunaan di component -->
<template>
  <Button v-if="can('M8', 'approve')" @click="approve"> Setujui </Button>
</template>
```

---

## 5. Mock Data Strategy (Selama Frontend Phase)

Tidak perlu MSW atau library khusus. Cukup **TypeScript interfaces + static fixtures** di dalam composable.

```ts
// app/composables/useClients.ts — versi mock (selama frontend phase)
import type { Client } from "~/types/modules/client";

const MOCK_CLIENTS: Client[] = [
  {
    id: "cld_001",
    institutionName: "Rumah Sakit Umum Daerah X",
    status: "FOLLOW_UP",
    phone: "0812-0000-0001",
    pics: [{ name: "Budi Santoso", position: "Kepala IT", phone: "0812-..." }],
  },
  // ...
];

export function useClients() {
  const clients = ref<Client[]>(MOCK_CLIENTS);
  const pending = ref(false);
  // Simulasi pagination
  const page = ref(1);
  const limit = ref(10);
  const meta = computed(() => ({
    total: MOCK_CLIENTS.length,
    page: page.value,
    limit: limit.value,
    totalPages: 1,
  }));

  return { clients, meta, page, limit, pending };
}
```

Saat wiring nanti, versi mock diganti dengan `useFetch` asli — interface Type tidak berubah, jadi component tidak perlu diedit.

---

## Ringkasan: Foundation Checklist Phase 3

| #   | Item                              | Status     |
| --- | --------------------------------- | ---------- |
| 1   | Database Schema (draft referensi) | ✅ Selesai |
| 2   | Folder Structure (Nuxt 4 + modul) | ✅ Selesai |
| 3   | API Naming Conventions            | ✅ Selesai |
| 4   | State Management Pattern          | ✅ Selesai |
| 5   | Data Fetching Guidelines          | ✅ Selesai |
| 6   | Permission Gate Pattern           | ✅ Selesai |
| 7   | Mock Data Strategy                | ✅ Selesai |

**Phase 3 Architecture Design — COMPLETE.**  
Siap lanjut ke Phase 4: UI Prototyping.
