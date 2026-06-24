<script setup lang="ts">
import {
  BookOpen,
  FileText,
  PackageOpen,
  Rocket,
  TrendingUp,
  Truck,
  Users,
} from "lucide-vue-next";

definePageMeta({ layout: "admin" });

useHead({ title: "Dashboard" });

const userName = ref("Budi Santoso");

const statCards = [
  // Card Highlight — BUKAN objek biasa, flag isHighlight: true
  {
    isHighlight: true,
    title: "RINGKASAN BULAN INI",
    value: "Rp 48,2JT",
    description: "Total nilai kontrak aktif Partnership",
    sub: "Rp 48.200.000 verified",
  },
  {
    title: "TOTAL KLIEN",
    value: "147",
    description: "Dari 159 klien terdaftar",
    sub: "+12 bulan ini",
    delta: "+8%",
    up: true,
    icon: Users,
    iconBg: "var(--color-brand-50)",
    iconColor: "var(--color-brand-600)",
  },
  {
    title: "PROSPEK AKTIF",
    value: "23",
    description: "Dalam pipeline Pre-Sales",
    sub: "4 follow-up hari ini",
    delta: "+4%",
    up: true,
    icon: TrendingUp,
    iconBg: "var(--color-success-50)",
    iconColor: "var(--color-success-600)",
  },
  {
    title: "STOK KRITIS",
    value: "5",
    description: "Item perlu restok segera",
    sub: "Ambang batas 10 unit",
    delta: "-2",
    up: false,
    icon: PackageOpen,
    iconBg: "var(--color-warning-50)",
    iconColor: "var(--color-warning-600)",
  },
  {
    title: "DOKUMEN AKTIF",
    value: "18",
    description: "Surat dalam proses persetujuan",
    sub: "3 menunggu tanda tangan",
    delta: "+3",
    up: true,
    icon: FileText,
    iconBg: "var(--color-brand-50)",
    iconColor: "var(--color-brand-500)",
  },
  {
    title: "TOTAL VENDOR",
    value: "34",
    description: "Vendor aktif terdaftar",
    sub: "3 baru bulan ini",
    delta: "+3",
    up: true,
    icon: Truck,
    iconBg: "var(--color-neutral-100)",
    iconColor: "var(--color-neutral-600)",
  },
];
</script>

<template>
  <div class="space-y-8">
    <!-- Hero card -->
    <div
      class="relative overflow-hidden rounded-2xl text-white p-8 sm:p-12 shadow-xl"
      style="background-color: #111111"
    >
      <!-- Stripe: angle 115deg, putih opacity 0.06 -->
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
        <!-- Badge pill -->
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-semibold tracking-wide mb-5"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-brand-400" />
          SISTEM MANAJEMEN · v2.0
        </div>
        <!-- Title: Kanit, text-4xl sm:text-5xl, font-bold, leading-[1.1] -->
        <h1
          class="text-4xl sm:text-5xl font-bold text-white max-w-2xl leading-[1.1] font-display"
        >
          Selamat datang kembali, {{ userName }}
        </h1>
        <!-- Subtitle -->
        <p class="mt-4 text-neutral-300 text-lg max-w-xl font-normal">
          Kelola seluruh operasional Partnership dari satu tempat yang
          terpercaya.
        </p>
        <!-- Two buttons — sama persis style UI Kit -->
        <div class="mt-7 flex flex-wrap gap-3">
          <!-- Button 1: solid brand (sama seperti "Get started") -->
          <button
            class="h-11 px-5 rounded-md bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-brand transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Rocket class="w-4 h-4" /> Mulai Eksplorasi
          </button>
          <!-- Button 2: bg-white/10 (sama seperti "Guidelines") → aksi ke /regulations -->
          <NuxtLink
            to="/regulations"
            class="h-11 px-5 rounded-md bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <BookOpen class="w-4 h-4" /> Peraturan Perusahaan
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      <template v-for="(card, i) in statCards" :key="i">
        <div
          v-if="card.isHighlight"
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
              {{ card.title }}
            </p>
            <div
              class="text-2xl font-bold text-white leading-none font-display"
            >
              {{ card.value }}
            </div>
            <p class="text-xs text-white/70 leading-snug">
              {{ card.description }}
            </p>
            <p class="text-[10px] text-white/40">
              {{ card.sub }}
            </p>
          </div>
        </div>
        <div
          v-else
          class="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5 shadow-card hover:shadow-lift transition-shadow flex flex-col gap-2"
        >
          <!-- Top: icon + delta -->
          <div class="flex items-center justify-between">
            <div
              class="grid place-items-center w-8 h-8 rounded-lg"
              :style="{ background: card.iconBg, color: card.iconColor }"
            >
              <component :is="card.icon" class="w-4 h-4" />
            </div>
            <span
              class="text-xs font-semibold"
              :class="
                card.up
                  ? 'text-success-600 dark:text-success-400'
                  : 'text-danger-600 dark:text-danger-400'
              "
            >
              {{ card.delta }}
            </span>
          </div>
          <!-- Title label -->
          <p
            class="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500"
          >
            {{ card.title }}
          </p>
          <!-- Big number -->
          <div
            class="text-2xl font-bold text-ink dark:text-neutral-100 leading-none font-display"
          >
            {{ card.value }}
          </div>
          <!-- Description -->
          <p
            class="text-xs text-neutral-500 dark:text-neutral-400 leading-snug"
          >
            {{ card.description }}
          </p>
          <!-- Sub detail -->
          <p class="text-[10px] text-neutral-400 dark:text-neutral-500">
            {{ card.sub }}
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
