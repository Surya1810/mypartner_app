<script setup lang="ts">
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from "lucide-vue-next";
import { ref } from "vue";
import { useToast } from "@/composables/useToast";

const { addToast } = useToast();

function triggerToast(tone: "success" | "danger" | "warning" | "info") {
  if (tone === "success")
    addToast("Sukses", "Tindakan berhasil dilakukan.", "success");
  if (tone === "danger")
    addToast("Error", "Tindakan gagal dilakukan.", "danger");
  if (tone === "warning")
    addToast("Peringatan", "Periksa kembali tindakan Anda.", "warning");
  if (tone === "info") addToast("Info", "Informasi baru tersedia.", "info");
}

const alertItems = [
  {
    type: "success",
    icon: CheckCircle,
    title: "Pesanan Disetujui",
    body: "PO-2026-04817 disetujui oleh Budi Santoso.",
  },
  {
    type: "warning",
    icon: AlertTriangle,
    title: "Anggaran Mendekati Batas",
    body: "Pengeluaran logistik sudah 86% dari anggaran kuartal.",
  },
  {
    type: "danger",
    icon: AlertCircle,
    title: "Kontrak Hampir Berakhir",
    body: "Perjanjian Vertex Logistik berakhir dalam 7 hari.",
  },
  {
    type: "info",
    icon: Info,
    title: "Sinkronisasi Baru",
    body: "12 invoice diimpor dari sistem ERP pagi ini.",
  },
];

const showModal = ref(false);
</script>

<template>
  <div class="space-y-16">
    <!-- C7 — Section: Alerts & Badges -->
    <section id="alerts">
      <div class="mb-5">
        <h2
          class="text-2xl font-bold tracking-tight text-ink dark:text-neutral-100 font-display"
        >
          Alert & Badge
        </h2>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Banner status dan status pill
        </p>
      </div>
      <div class="space-y-5">
        <!-- Alert banners -->
        <div class="grid gap-3">
          <div
            v-for="alert in alertItems"
            :key="alert.type"
            class="flex items-center gap-3 p-4 rounded-lg border border-solid"
            :class="[
              alert.type === 'success'
                ? 'bg-success-50 dark:bg-success-900 border-success-600 dark:border-success-300'
                : alert.type === 'warning'
                  ? 'bg-warning-50 dark:bg-warning-900 border-warning-600 dark:border-warning-300'
                  : alert.type === 'danger'
                    ? 'bg-danger-50 dark:bg-danger-900 border-danger-600 dark:border-danger-300'
                    : 'bg-brand-50 dark:bg-brand-900 border-brand-600 dark:border-brand-300',
            ]"
          >
            <component
              :is="alert.icon"
              class="w-5 h-5 shrink-0"
              :class="[
                alert.type === 'success'
                  ? 'text-success-600 dark:text-success-300'
                  : alert.type === 'warning'
                    ? 'text-warning-600 dark:text-warning-300'
                    : alert.type === 'danger'
                      ? 'text-danger-600 dark:text-danger-300'
                      : 'text-brand-600 dark:text-brand-300',
              ]"
            />
            <div class="min-w-0">
              <div
                class="text-sm font-bold"
                :class="[
                  alert.type === 'success'
                    ? 'text-success-600 dark:text-success-300'
                    : alert.type === 'warning'
                      ? 'text-warning-600 dark:text-warning-300'
                      : alert.type === 'danger'
                        ? 'text-danger-600 dark:text-danger-300'
                        : 'text-brand-600 dark:text-brand-300',
                ]"
              >
                {{ alert.title }}
              </div>
              <div
                class="text-sm opacity-90 mt-0.5"
                :class="[
                  alert.type === 'success'
                    ? 'text-success-600 dark:text-success-300'
                    : alert.type === 'warning'
                      ? 'text-warning-600 dark:text-warning-300'
                      : alert.type === 'danger'
                        ? 'text-danger-600 dark:text-danger-300'
                        : 'text-brand-600 dark:text-brand-300',
                ]"
              >
                {{ alert.body }}
              </div>
            </div>
            <button
              class="ml-auto text-neutral-400 hover:text-neutral-600 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>
        <!-- Status pills -->
        <div
          class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft p-7"
        >
          <div
            class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-4"
          >
            Status Pill
          </div>
          <div class="flex flex-wrap gap-2.5">
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-success-50 text-success-700 dark:bg-success-500/20 dark:text-success-300 border border-transparent dark:border-success-500/30"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-success-500" /> Disetujui
            </span>
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-warning-50 text-warning-700 dark:bg-warning-500/20 dark:text-warning-300 border border-transparent dark:border-warning-500/30"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-warning-500" /> Menunggu
            </span>
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-danger-50 text-danger-700 dark:bg-danger-500/20 dark:text-danger-300 border border-transparent dark:border-danger-500/30"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-danger-500" /> Ditolak
            </span>
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 border border-transparent dark:border-brand-500/30"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-brand-500" /> Dalam
              Review
            </span>
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
            >
              Draft
            </span>
            <span
              class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-brand-500 text-white"
              >BARU</span
            >
            <span
              class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-ink dark:bg-neutral-700 text-white"
              >PRO</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- C8 — Section: Info Box -->
    <section id="infobox">
      <div class="mb-5">
        <h2
          class="text-2xl font-bold tracking-tight text-ink dark:text-neutral-100 font-display"
        >
          Info Box
        </h2>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Komponen notifikasi inline untuk pesan kontekstual
        </p>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <div
          class="flex items-center gap-3 p-4 rounded-lg border border-solid border-l-4 border-brand-600 dark:border-brand-300 border-l-brand-600 bg-brand-50 dark:bg-brand-900"
        >
          <Info
            class="w-5 h-5 flex-shrink-0 text-brand-600 dark:text-brand-300"
          />
          <div>
            <p class="text-sm font-bold text-brand-600 dark:text-brand-300">
              Info Box
            </p>
            <p
              class="text-sm text-brand-600 dark:text-brand-300 opacity-90 mt-0.5"
            >
              Pesan deskriptif untuk memberikan konteks kepada pengguna.
            </p>
          </div>
        </div>
        <div
          class="flex items-center gap-3 p-4 rounded-lg border border-solid border-l-4 border-success-600 dark:border-success-300 border-l-success-600 bg-success-50 dark:bg-success-900"
        >
          <CheckCircle
            class="w-5 h-5 flex-shrink-0 text-success-600 dark:text-success-300"
          />
          <div>
            <p class="text-sm font-bold text-success-600 dark:text-success-300">
              Success Box
            </p>
            <p
              class="text-sm text-success-600 dark:text-success-300 opacity-90 mt-0.5"
            >
              Tindakan telah berhasil diselesaikan.
            </p>
          </div>
        </div>
        <div
          class="flex items-center gap-3 p-4 rounded-lg border border-solid border-l-4 border-warning-600 dark:border-warning-300 border-l-warning-600 bg-warning-50 dark:bg-warning-900"
        >
          <AlertTriangle
            class="w-5 h-5 flex-shrink-0 text-warning-600 dark:text-warning-300"
          />
          <div>
            <p class="text-sm font-bold text-warning-600 dark:text-warning-300">
              Warning Box
            </p>
            <p
              class="text-sm text-warning-600 dark:text-warning-300 opacity-90 mt-0.5"
            >
              Peringatan tentang potensi masalah yang perlu diperhatikan.
            </p>
          </div>
        </div>
        <div
          class="flex items-center gap-3 p-4 rounded-lg border border-solid border-l-4 border-danger-600 dark:border-danger-300 border-l-danger-600 bg-danger-50 dark:bg-danger-900"
        >
          <AlertCircle
            class="w-5 h-5 flex-shrink-0 text-danger-600 dark:text-danger-300"
          />
          <div>
            <p class="text-sm font-bold text-danger-600 dark:text-danger-300">
              Danger Box
            </p>
            <p
              class="text-sm text-danger-600 dark:text-danger-300 opacity-90 mt-0.5"
            >
              Pesan error penting yang memerlukan tindakan segera.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- C12 — Section: Overlays -->
    <section id="overlays">
      <div class="mb-5">
        <h2
          class="text-2xl font-bold tracking-tight text-ink dark:text-neutral-100 font-display"
        >
          Overlay
        </h2>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Modal dialog, tooltip & toast
        </p>
      </div>
      <div
        class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft p-7 flex flex-wrap items-center gap-4"
      >
        <button
          class="h-10 px-4 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          @click="showModal = true"
        >
          Buka Dialog
        </button>
        <div class="relative group">
          <button
            class="h-10 px-4 rounded-md bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-ink dark:text-neutral-200 text-sm font-semibold flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Info class="w-4 h-4" /> Hover untuk tooltip
          </button>
          <div
            class="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div
              class="bg-ink dark:bg-neutral-700 text-white text-xs font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-lift"
            >
              Persetujuan diarahkan ke manajer Anda
            </div>
            <div
              class="w-2 h-2 bg-ink dark:bg-neutral-700 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"
            />
          </div>
        </div>
        <button
          class="h-10 px-4 rounded-md bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-ink dark:text-neutral-200 text-sm font-semibold hover:border-brand-500 hover:text-brand-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          @click="triggerToast('success')"
        >
          Toast Sukses
        </button>
        <button
          class="h-10 px-4 rounded-md bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-ink dark:text-neutral-200 text-sm font-semibold hover:border-brand-500 hover:text-brand-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          @click="triggerToast('danger')"
        >
          Toast Error
        </button>
        <button
          class="h-10 px-4 rounded-md bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-ink dark:text-neutral-200 text-sm font-semibold hover:border-brand-500 hover:text-brand-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          @click="triggerToast('warning')"
        >
          Toast Warning
        </button>
      </div>

      <Teleport to="body">
        <Transition name="fade">
          <div
            v-if="showModal"
            class="fixed inset-0 z-50 grid place-items-center p-4"
            @click.self="showModal = false"
          >
            <div class="absolute inset-0 bg-ink-near/60 dark:bg-black/70" />
            <Transition name="pop" appear>
              <div
                v-if="showModal"
                class="relative w-full max-w-md bg-white dark:bg-neutral-800 rounded-xl shadow-xl overflow-hidden border border-neutral-100 dark:border-neutral-700"
              >
                <div class="p-6">
                  <div class="flex items-start gap-4">
                    <div
                      class="grid place-items-center w-11 h-11 rounded-lg bg-danger-50 text-danger-500 flex-shrink-0"
                    >
                      <AlertTriangle class="w-5 h-5" />
                    </div>
                    <div>
                      <h3
                        class="text-lg font-bold text-ink dark:text-neutral-100 font-display"
                      >
                        Batalkan permintaan ini?
                      </h3>
                      <p
                        class="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400"
                      >
                        PO-2026-04817 akan ditarik dari proses persetujuan.
                        Tindakan ini tidak bisa dibatalkan.
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  class="flex items-center justify-end gap-3 px-6 py-4 bg-neutral-50 dark:bg-neutral-850 border-t border-neutral-200 dark:border-neutral-700"
                >
                  <button
                    class="h-10 px-4 rounded-md bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 text-ink dark:text-neutral-200 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    @click="showModal = false"
                  >
                    Batalkan
                  </button>
                  <button
                    class="h-10 px-4 rounded-md bg-danger-500 hover:bg-danger-600 text-white text-sm font-semibold shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    @click="showModal = false"
                  >
                    Ya, Batalkan PO
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </Teleport>
    </section>
  </div>
</template>
