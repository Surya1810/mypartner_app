<script setup lang="ts">
import { BookOpen, Rocket } from "lucide-vue-next";

const brandScale = {
  50: "#EEF3FF",
  100: "#D9E4FF",
  200: "#B3C9FF",
  300: "#80A4FF",
  400: "#4D7EFF",
  500: "#0055FF",
  600: "#0047D6",
  700: "#0039AD",
  800: "#002C85",
  900: "#001F5C",
};
const neutralScale = {
  0: "#FFFFFF",
  50: "#F7F8FA",
  100: "#F1F2F5",
  200: "#E5E7EC",
  300: "#D3D7DF",
  400: "#9AA0AD",
  500: "#6B7280",
  600: "#4B5260",
  700: "#353B47",
  950: "#0D1017",
};
const statusColors = {
  success: { label: "Sukses", color: "#15A05A" },
  warning: { label: "Peringatan", color: "#E8920C" },
  danger: { label: "Bahaya", color: "#E11900" },
};
</script>

<template>
  <div class="space-y-16">
    <!-- C1 — Section: Overview -->
    <section id="overview">
      <div class="mb-5">
        <h2
          class="text-2xl font-bold tracking-tight text-ink dark:text-neutral-100 font-display"
        >
          Overview
        </h2>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Fondasi desain sistem MyPartner
        </p>
      </div>
      <div
        class="relative overflow-hidden rounded-2xl text-white p-8 sm:p-12 shadow-xl"
        style="background-color: #111111"
      >
        <!-- Stripe overlay -->
        <div
          class="absolute inset-0 opacity-[0.06]"
          style="
            background-image: repeating-linear-gradient(
              115deg,
              #fff 0 14px,
              transparent 14px 40px
            );
          "
        />
        <div class="relative">
          <!-- Badge -->
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-semibold tracking-wide mb-5"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-brand-400" />
            DESIGN SYSTEM · v2.0
          </div>
          <!-- Title -->
          <h1
            class="text-4xl sm:text-5xl font-bold text-white max-w-2xl leading-[1.1] font-display"
          >
            MyPartner · V2.0
          </h1>
          <!-- Subtitle -->
          <p class="mt-4 text-neutral-300 text-lg max-w-xl font-normal">
            Setiap komponen untuk platform operasional Partnership — typography,
            warna, form, data, dan overlay, dibangun di atas satu fondasi yang
            elegan dan modern.
          </p>
          <!-- Buttons -->
          <div class="mt-7 flex flex-wrap gap-3">
            <button
              class="h-11 px-5 rounded-md bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-brand transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Rocket class="w-4 h-4" /> Mulai Eksplorasi
            </button>
            <button
              class="h-11 px-5 rounded-md bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <BookOpen class="w-4 h-4" /> Panduan
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- C2 — Section: Typography -->
    <section id="typography">
      <div class="mb-5">
        <h2
          class="text-2xl font-bold tracking-tight text-ink dark:text-neutral-100 font-display"
        >
          Typography
        </h2>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Montserrat UI · Kanit display · JetBrains Mono
        </p>
      </div>
      <div class="grid gap-5 lg:grid-cols-3">
        <!-- Headings card -->
        <div
          class="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft dark:shadow-card-dark p-7 space-y-4"
        >
          <div class="flex items-baseline gap-3">
            <span class="w-12 text-xs text-neutral-400 font-mono shrink-0"
              >H1</span
            >
            <h1
              class="text-4xl font-bold text-ink dark:text-neutral-100 tracking-tight font-display"
            >
              Kelola dengan percaya diri
            </h1>
          </div>
          <div class="flex items-baseline gap-3">
            <span class="w-12 text-xs text-neutral-400 font-mono shrink-0"
              >H2</span
            >
            <h2
              class="text-3xl font-semibold text-ink dark:text-neutral-100 tracking-tight font-display"
            >
              Manajemen Vendor
            </h2>
          </div>
          <div class="flex items-baseline gap-3">
            <span class="w-12 text-xs text-neutral-400 font-mono shrink-0"
              >H3</span
            >
            <h3
              class="text-2xl font-semibold text-ink dark:text-neutral-100 font-display"
            >
              Permintaan Pembelian
            </h3>
          </div>
          <div class="flex items-baseline gap-3">
            <span class="w-12 text-xs text-neutral-400 font-mono shrink-0"
              >H4</span
            >
            <h4 class="text-xl font-bold text-ink dark:text-neutral-100">
              Alur Persetujuan
            </h4>
          </div>
          <div class="flex items-baseline gap-3">
            <span class="w-12 text-xs text-neutral-400 font-mono shrink-0"
              >H5</span
            >
            <h5 class="text-[17px] font-bold text-ink dark:text-neutral-100">
              Kategori Pengeluaran
            </h5>
          </div>
          <div class="flex items-baseline gap-3">
            <span class="w-12 text-xs text-neutral-400 font-mono shrink-0"
              >H6</span
            >
            <h6
              class="text-[15px] font-semibold text-ink dark:text-neutral-100"
            >
              Detail Baris Item
            </h6>
          </div>
        </div>
        <!-- Body/Mono card -->
        <div
          class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft p-7 space-y-4"
        >
          <p
            class="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed"
          >
            Body — Pusatkan permintaan, otomatisasi persetujuan, dan kelola
            semua hubungan vendor dalam satu ruang kerja terpercaya.
          </p>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            Muted small — Terakhir disinkronkan 4 menit lalu.
          </p>
          <p class="text-base text-neutral-700 dark:text-neutral-300">
            Sebuah
            <a
              href="#"
              class="text-brand-600 dark:text-brand-400 font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >tautan teks</a
            >
            memandu pengguna, dan
            <strong class="text-ink dark:text-neutral-100 font-bold"
              >tebal</strong
            >
            menarik perhatian.
          </p>
          <p
            class="font-mono text-sm text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-750 rounded px-3 py-2"
          >
            PO-2026-04817 · Rp 48.200.000
          </p>
        </div>
      </div>
    </section>

    <!-- C3 — Section: Colors -->
    <section id="colors">
      <div class="mb-5">
        <h2
          class="text-2xl font-bold tracking-tight text-ink dark:text-neutral-100 font-display"
        >
          Warna & Branding
        </h2>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Skala warna dari logo Partnership — primary, neutral & status
        </p>
      </div>
      <div class="space-y-5">
        <!-- Brand scale -->
        <div
          class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft p-6"
        >
          <div
            class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-4"
          >
            Primary — Brand Blue
          </div>
          <div class="grid grid-cols-5 sm:grid-cols-10 gap-2">
            <div v-for="(color, key) in brandScale" :key="key">
              <div
                class="h-14 rounded-md shadow-xs"
                :style="{ background: color }"
              />
              <div class="mt-1.5 text-[10px] font-mono text-neutral-500">
                {{ key }}
              </div>
            </div>
          </div>
        </div>

        <!-- Neutral + Status row -->
        <div class="grid gap-5 md:grid-cols-2">
          <!-- Neutral scale -->
          <div
            class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft p-6"
          >
            <div
              class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-4"
            >
              Neutral / Ink
            </div>
            <div class="grid grid-cols-6 gap-2">
              <div v-for="(color, key) in neutralScale" :key="key">
                <div
                  class="h-12 rounded-md shadow-xs border border-neutral-100 dark:border-neutral-700"
                  :style="{ background: color }"
                />
                <div class="mt-1.5 text-[10px] font-mono text-neutral-500">
                  {{ key }}
                </div>
              </div>
            </div>
          </div>
          <!-- Status scale -->
          <div
            class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft p-6"
          >
            <div
              class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-4"
            >
              Status
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div v-for="(item, key) in statusColors" :key="key">
                <div
                  class="h-12 rounded-md shadow-xs"
                  :style="{ background: item.color }"
                />
                <div
                  class="mt-1.5 text-[11px] font-semibold capitalize text-ink dark:text-neutral-200"
                >
                  {{ item.label }}
                </div>
                <div class="text-[10px] font-mono text-neutral-400">
                  {{ item.color }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
