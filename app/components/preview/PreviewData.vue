<script setup lang="ts">
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreHorizontal,
  Plus,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-vue-next";
import { computed, ref } from "vue";

const statCards = [
  {
    label: "Total Klien",
    value: "147",
    delta: "+12%",
    up: true,
    icon: Users,
    iconBg: "var(--color-brand-50)",
    iconColor: "var(--color-brand-600)",
  },
  {
    label: "Prospek Aktif",
    value: "23",
    delta: "+4%",
    up: true,
    icon: TrendingUp,
    iconBg: "var(--color-success-50)",
    iconColor: "var(--color-success-600)",
  },
  {
    label: "Stok Kritis",
    value: "5",
    delta: "-2",
    up: false,
    icon: AlertTriangle,
    iconBg: "var(--color-warning-50)",
    iconColor: "var(--color-warning-600)",
  },
];

const tableRows = [
  {
    id: "PO-001",
    vendor: "PT Sumber Makmur",
    amount: "Rp 45.000.000",
    status: "Disetujui",
  },
  {
    id: "PO-002",
    vendor: "CV Abadi Jaya",
    amount: "Rp 12.500.000",
    status: "Pending",
  },
  {
    id: "PO-003",
    vendor: "PT Teknologi Indo",
    amount: "Rp 88.000.000",
    status: "Ditolak",
  },
];
const tablePage = ref(1);
const tablePerPage = 5;
const totalTablePages = Math.ceil(tableRows.length / tablePerPage);
const pagedRows = computed(() => {
  const start = (tablePage.value - 1) * tablePerPage;
  return tableRows.slice(start, start + tablePerPage);
});
const statusBg: Record<string, string> = {
  Disetujui: "#E8F8EF",
  Pending: "#FEF4E5",
  Ditolak: "#FDECEC",
};
const statusText: Record<string, string> = {
  Disetujui: "#15A05A",
  Pending: "#E8920C",
  Ditolak: "#E11900",
};
const statusDot: Record<string, string> = {
  Disetujui: "#15A05A",
  Pending: "#E8920C",
  Ditolak: "#E11900",
};
</script>

<template>
  <div class="space-y-16">
    <!-- C9 — Section: Cards -->
    <section id="cards">
      <div class="mb-5">
        <h2
          class="text-2xl font-bold tracking-tight text-ink dark:text-neutral-100 font-display"
        >
          Card & Container
        </h2>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Template dashboard dengan shadow halus
        </p>
      </div>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(stat, i) in statCards"
          :key="i"
          class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-shadow p-6 shadow-card hover:shadow-lift dark:shadow-card-dark dark:hover:shadow-lift-dark"
        >
          <div class="flex items-center justify-between">
            <div
              class="grid place-items-center w-10 h-10 rounded-md"
              :style="{ background: stat.iconBg, color: stat.iconColor }"
            >
              <component :is="stat.icon" class="w-5 h-5" />
            </div>
            <span
              class="inline-flex items-center gap-0.5 text-xs font-semibold"
              :class="
                stat.up
                  ? 'text-success-600 dark:text-success-500'
                  : 'text-danger-600 dark:text-danger-500'
              "
            >
              <component
                :is="stat.up ? TrendingUp : TrendingDown"
                class="w-3.5 h-3.5"
              />
              {{ stat.delta }}
            </span>
          </div>
          <div
            class="mt-4 text-3xl font-bold text-ink dark:text-neutral-100 tracking-tight font-display"
          >
            {{ stat.value }}
          </div>
          <div class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {{ stat.label }}
          </div>
        </div>
        <!-- Featured card -->
        <div
          class="sm:col-span-2 lg:col-span-3 rounded-lg overflow-hidden shadow-lift text-white flex flex-col sm:flex-row items-stretch"
          style="background-color: #111111"
        >
          <div class="p-7 flex-1">
            <div
              class="text-brand-300 text-xs font-semibold uppercase tracking-[.12em] mb-2"
            >
              Featured
            </div>
            <h3 class="text-xl font-semibold text-white font-display">
              Review Kinerja Q2
            </h3>
            <p class="mt-2 text-neutral-300 text-sm max-w-md">
              12 kontrak akan diperpanjang. Tinjau scorecard sebelum rapat
              komite.
            </p>
            <button
              class="mt-5 h-10 px-4 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-brand transition-colors flex items-center gap-2 w-max focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Buka Review <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- C10 — Section: Card Highlight -->
    <section id="card-highlight">
      <div class="mb-5">
        <h2
          class="text-2xl font-bold tracking-tight text-ink dark:text-neutral-100 font-display"
        >
          Card Highlight
        </h2>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Card dengan background gradasi untuk metric utama
        </p>
      </div>
      <div class="max-w-xs">
        <div
          class="relative overflow-hidden rounded-xl p-5 flex flex-col gap-2 cursor-default transition-all duration-300 bg-gradient-to-br from-brand-600 to-brand-900 hover:from-brand-500 hover:to-brand-800"
        >
          <!-- Stripe dekorasi subtle -->
          <div
            class="absolute inset-0 opacity-[0.04]"
            style="
              background-image: repeating-linear-gradient(
                115deg,
                #fff 0 14px,
                transparent 14px 40px
              );
            "
          />
          <div class="relative flex flex-col gap-2">
            <p
              class="text-[10px] uppercase tracking-widest font-semibold text-white/50"
            >
              RINGKASAN BULAN INI
            </p>
            <div
              class="text-2xl font-bold text-white leading-none font-display"
            >
              Rp 48,2JT
            </div>
            <p class="text-xs text-white/70 leading-snug">
              Total nilai kontrak aktif Partnership
            </p>
            <p class="text-[10px] text-white/40">Rp 48.200.000 verified</p>
          </div>
        </div>
      </div>
    </section>

    <!-- C11 — Section: Data Table -->
    <section id="table">
      <div class="mb-5">
        <h2
          class="text-2xl font-bold tracking-tight text-ink dark:text-neutral-100 font-display"
        >
          Tabel Data
        </h2>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Tabel bersih dengan border halus & pagination
        </p>
      </div>
      <div
        class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft overflow-hidden"
      >
        <div
          class="flex items-center gap-3 px-5 py-4 border-b border-neutral-200 dark:border-neutral-700"
        >
          <h3 class="text-base font-bold text-ink dark:text-neutral-100">
            Permintaan Pembelian
          </h3>
          <span
            class="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
            >{{ tableRows.length }}</span
          >
          <button
            class="ml-auto h-9 px-3 rounded-md bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 hover:border-brand-500 hover:text-brand-600 text-sm font-semibold text-ink dark:text-neutral-300 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Filter class="w-4 h-4" /> Filter
          </button>
          <button
            class="h-9 px-3 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-brand transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Plus class="w-4 h-4" /> Baru
          </button>
        </div>
        <div class="overflow-x-auto mp-scroll">
          <table class="w-full text-sm">
            <thead>
              <tr
                class="text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-850"
              >
                <th class="px-5 py-3 font-semibold">No. Order</th>
                <th class="px-5 py-3 font-semibold">Vendor</th>
                <th class="px-5 py-3 font-semibold">Jumlah</th>
                <th class="px-5 py-3 font-semibold">Status</th>
                <th class="px-5 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 dark:divide-neutral-700">
              <tr
                v-for="row in pagedRows"
                :key="row.id"
                class="hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors"
              >
                <td
                  class="px-5 py-3.5 font-mono text-xs text-neutral-600 dark:text-neutral-400"
                >
                  {{ row.id }}
                </td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-2.5">
                    <div
                      class="grid place-items-center w-7 h-7 rounded-full text-[11px] font-bold bg-brand-50 text-brand-600"
                    >
                      {{ row.vendor.slice(0, 2).toUpperCase() }}
                    </div>
                    <span class="font-medium text-ink dark:text-neutral-200">{{
                      row.vendor
                    }}</span>
                  </div>
                </td>
                <td
                  class="px-5 py-3.5 font-semibold text-ink dark:text-neutral-200"
                >
                  {{ row.amount }}
                </td>
                <td class="px-5 py-3.5">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    :style="{
                      background: statusBg[row.status],
                      color: statusText[row.status],
                    }"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :style="{ background: statusDot[row.status] }"
                    />
                    {{ row.status }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-right">
                  <button
                    class="grid place-items-center w-8 h-8 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 ml-auto transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    <MoreHorizontal class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="flex items-center gap-3 px-5 py-3.5 border-t border-neutral-200 dark:border-neutral-700"
        >
          <span class="text-xs text-neutral-500 dark:text-neutral-400">
            Menampilkan {{ (tablePage - 1) * tablePerPage + 1 }}–{{
              Math.min(tablePage * tablePerPage, tableRows.length)
            }}
            dari {{ tableRows.length }}
          </span>
          <div class="ml-auto flex items-center gap-1">
            <button
              :disabled="tablePage === 1"
              class="grid place-items-center w-8 h-8 rounded-md border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-brand-500 hover:text-brand-600 disabled:opacity-40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              @click="tablePage = Math.max(1, tablePage - 1)"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            <button
              v-for="p in totalTablePages"
              :key="p"
              class="grid place-items-center w-8 h-8 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              :class="
                p === tablePage
                  ? 'bg-brand-500 text-white shadow-brand'
                  : 'border border-neutral-300 dark:border-neutral-600 text-neutral-600 hover:border-brand-500 hover:text-brand-600'
              "
              @click="tablePage = p"
            >
              {{ p }}
            </button>
            <button
              :disabled="tablePage === totalTablePages"
              class="grid place-items-center w-8 h-8 rounded-md border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-brand-500 hover:text-brand-600 disabled:opacity-40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              @click="tablePage = Math.min(totalTablePages, tablePage + 1)"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
