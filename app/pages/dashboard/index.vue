<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";

definePageMeta({ layout: "admin" });

const userName = ref("Budi");
const stats = [
  { label: "Total Klien", value: "147", iconBg: "var(--color-primary-subtle)" },
  { label: "Prospek Aktif", value: "23", iconBg: "var(--color-success-bg)" },
  { label: "Stok Kritis", value: "5", iconBg: "var(--color-warning-bg)" },
];
</script>

<template>
  <div class="space-y-6">
    <!-- Hero card -->
    <div class="rounded-3xl p-8" style="background: var(--color-hero-dark)">
      <h1 class="text-white text-2xl font-bold mb-2">
        Selamat datang, {{ userName }}
      </h1>
      <p class="text-white/60 text-sm mb-6">
        Kelola operasional PT Partnership dari satu tempat.
      </p>
      <Button style="background: var(--color-primary)">
        Lihat Dashboard
      </Button>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-xl p-6"
        style="box-shadow: var(--shadow-card)"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-10 rounded-lg"
            :style="{ background: stat.iconBg }"
          />
          <div>
            <p class="text-2xl font-bold">
              {{ stat.value }}
            </p>
            <p class="text-sm" style="color: var(--color-text-secondary)">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Placeholder table -->
    <div
      class="bg-white rounded-xl overflow-hidden"
      style="box-shadow: var(--shadow-card)"
    >
      <div class="px-6 py-4 border-b" style="border-color: var(--color-border)">
        <h2 class="font-semibold">Aktivitas Terbaru</h2>
      </div>
      <div class="p-8 text-center" style="color: var(--color-text-muted)">
        Data akan tersedia setelah backend terhubung.
      </div>
    </div>
  </div>
</template>
