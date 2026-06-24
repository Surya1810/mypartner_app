<script setup lang="ts">
import { Check, ChevronDown, Loader2 } from "lucide-vue-next";
import { computed, ref } from "vue";

const isLoading = ref(false);
function simulateLoad() {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
}

const checkboxOpts = ref([
  { label: "Opsi pertama (terpilih)", checked: true },
  { label: "Opsi kedua", checked: false },
]);
const radioOpts = ["Pilihan A", "Pilihan B"];
const radioSelected = ref("Pilihan A");
const toggleOpts = ref([
  { label: "Fitur A aktif", on: true },
  { label: "Fitur B nonaktif", on: false },
]);

const cbOpen = ref(false);
const cbQuery = ref("");
const cbSelected = ref("");
const vendors = ref([
  "PT Logistik Maju",
  "CV Sumber Abadi",
  "PT Teknologi Nusantara",
]);
const cbFiltered = computed(() => {
  if (!cbQuery.value) return vendors.value;
  return vendors.value.filter((v) =>
    v.toLowerCase().includes(cbQuery.value.toLowerCase()),
  );
});
const cbExactMatch = computed(() =>
  vendors.value.some((v) => v.toLowerCase() === cbQuery.value.toLowerCase()),
);
function cbPick(v: string) {
  cbSelected.value = v;
  cbOpen.value = false;
  cbQuery.value = "";
}
function cbCreate() {
  vendors.value.push(cbQuery.value);
  cbPick(cbQuery.value);
}
</script>

<template>
  <div class="space-y-16">
    <!-- C4 — Section: Buttons -->
    <section id="buttons">
      <div class="mb-5">
        <h2
          class="text-2xl font-bold tracking-tight text-ink dark:text-neutral-100 font-display"
        >
          Tombol
        </h2>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Solid · Outline · Ghost · Danger — semua state
        </p>
      </div>
      <div
        class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft p-7 space-y-7"
      >
        <!-- Variants row -->
        <div>
          <div
            class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-3"
          >
            Varian
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <button
              class="h-10 px-4 rounded-md bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white text-sm font-semibold shadow-brand transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Plus class="w-4 h-4" /> Solid
            </button>
            <button
              class="h-10 px-4 rounded-md bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 hover:border-brand-500 hover:text-brand-600 dark:hover:border-brand-400 dark:hover:text-brand-400 text-ink dark:text-neutral-200 text-sm font-semibold shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Outline
            </button>
            <button
              class="h-10 px-4 rounded-md text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Ghost
            </button>
            <button
              class="h-10 px-4 rounded-md bg-danger-500 hover:bg-danger-600 text-white text-sm font-semibold shadow-xs transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Trash2 class="w-4 h-4" /> Danger
            </button>
            <button
              class="h-10 px-4 rounded-md bg-ink dark:bg-neutral-700 hover:bg-neutral-900 dark:hover:bg-neutral-600 text-white text-sm font-semibold shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Secondary
            </button>
          </div>
        </div>
        <!-- States & sizes row -->
        <div>
          <div
            class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-3"
          >
            Ukuran & State
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <button
              class="h-8 px-3 rounded-md bg-brand-500 text-white text-xs font-semibold shadow-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Kecil
            </button>
            <button
              class="h-10 px-4 rounded-md bg-brand-500 text-white text-sm font-semibold shadow-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Sedang
            </button>
            <button
              class="h-12 px-6 rounded-md bg-brand-500 text-white text-base font-semibold shadow-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Besar
            </button>
            <button
              disabled
              class="h-10 px-4 rounded-md bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 text-sm font-semibold cursor-not-allowed"
            >
              Nonaktif
            </button>
            <button
              :disabled="isLoading"
              class="h-10 px-4 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-brand transition-colors flex items-center gap-2 disabled:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              @click="simulateLoad"
            >
              <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
              {{ isLoading ? "Memproses…" : "Loading state" }}
            </button>
            <button
              class="grid place-items-center w-10 h-10 rounded-md bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 hover:border-brand-500 hover:text-brand-600 dark:hover:border-brand-400 text-ink dark:text-neutral-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Download class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- C5 — Section: Forms -->
    <section id="forms">
      <div class="mb-5">
        <h2
          class="text-2xl font-bold tracking-tight text-ink dark:text-neutral-100 font-display"
        >
          Elemen Form
        </h2>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Input, select, checkbox, radio & toggle
        </p>
      </div>
      <div class="grid gap-5 lg:grid-cols-2">
        <div
          class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft p-7 space-y-5"
        >
          <div>
            <label
              class="block text-sm font-semibold text-ink dark:text-neutral-200 mb-1.5"
              >Nama Vendor</label
            >
            <input
              type="text"
              placeholder="cth. PT Sumber Makmur"
              class="w-full h-11 px-3.5 rounded-md bg-white dark:bg-neutral-750 border border-neutral-300 dark:border-neutral-600 text-sm text-ink dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 outline-none transition"
            />
          </div>
          <div>
            <label
              class="block text-sm font-semibold text-ink dark:text-neutral-200 mb-1.5"
              >Kategori</label
            >
            <div class="relative">
              <select
                class="w-full h-11 pl-3.5 pr-10 rounded-md bg-white dark:bg-neutral-750 border border-neutral-300 dark:border-neutral-600 text-sm text-ink dark:text-neutral-200 appearance-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 outline-none transition cursor-pointer"
              >
                <option>IT & Software</option>
                <option>Logistik</option>
                <option>Bahan Baku</option>
                <option>Fasilitas</option>
              </select>
              <ChevronDown
                class="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              />
            </div>
            <p class="mt-1.5 text-xs text-neutral-400 dark:text-neutral-500">
              Native select — background mengikuti tema.
            </p>
          </div>
          <div>
            <label
              class="block text-sm font-semibold text-ink dark:text-neutral-200 mb-1.5"
            >
              Catatan
              <span class="text-neutral-400 font-normal">(opsional)</span>
            </label>
            <textarea
              rows="3"
              placeholder="Tambahkan konteks untuk approver…"
              class="w-full px-3.5 py-2.5 rounded-md bg-white dark:bg-neutral-750 border border-neutral-300 dark:border-neutral-600 text-sm text-ink dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 outline-none transition resize-none"
            />
          </div>
          <div>
            <label
              class="block text-sm font-semibold text-ink dark:text-neutral-200 mb-1.5"
              >State Error</label
            >
            <input
              value="email@tidak-valid"
              class="w-full h-11 px-3.5 rounded-md bg-danger-50 dark:bg-danger-900/20 border border-danger-500 text-sm text-danger-700 dark:text-danger-400 focus:ring-4 focus:ring-danger-500/15 outline-none transition"
            />
            <p
              class="mt-1.5 text-xs text-danger-600 dark:text-danger-400 flex items-center gap-1"
            >
              <AlertCircle class="w-3.5 h-3.5" /> Masukkan alamat email yang
              valid.
            </p>
          </div>
        </div>
        <div
          class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft p-7 space-y-6"
        >
          <div>
            <div
              class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-3"
            >
              Checkbox
            </div>
            <div class="space-y-2.5">
              <label
                v-for="opt in checkboxOpts"
                :key="opt.label"
                class="flex items-center gap-3 cursor-pointer"
              >
                <span class="relative w-5 h-5 rounded flex-shrink-0">
                  <input
                    type="checkbox"
                    :checked="opt.checked"
                    class="peer sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                  />
                  <span
                    class="absolute inset-0 rounded border-2 border-neutral-300 dark:border-neutral-600 peer-checked:bg-brand-500 peer-checked:border-brand-500 transition-colors"
                  />
                  <Check
                    class="absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100"
                  />
                </span>
                <span class="text-sm text-neutral-700 dark:text-neutral-300">{{
                  opt.label
                }}</span>
              </label>
            </div>
          </div>
          <div>
            <div
              class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-3"
            >
              Radio
            </div>
            <div class="space-y-2.5">
              <label
                v-for="opt in radioOpts"
                :key="opt"
                class="flex items-center gap-3 cursor-pointer"
              >
                <span class="relative w-5 h-5 rounded-full flex-shrink-0">
                  <input
                    v-model="radioSelected"
                    type="radio"
                    name="demo"
                    :value="opt"
                    class="peer sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                  />
                  <span
                    class="absolute inset-0 rounded-full border-2 border-neutral-300 dark:border-neutral-600 peer-checked:border-brand-500 transition-colors"
                  />
                  <span
                    class="absolute inset-[4px] rounded-full bg-brand-500 opacity-0 peer-checked:opacity-100 transition-opacity"
                  />
                </span>
                <span class="text-sm text-neutral-700 dark:text-neutral-300">{{
                  opt
                }}</span>
              </label>
            </div>
          </div>
          <div>
            <div
              class="text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-500 mb-3"
            >
              Toggle
            </div>
            <div class="space-y-3">
              <label
                v-for="tog in toggleOpts"
                :key="tog.label"
                class="flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-neutral-900 rounded-md py-1"
              >
                <span class="text-sm text-neutral-700 dark:text-neutral-300">{{
                  tog.label
                }}</span>
                <button
                  role="switch"
                  :aria-checked="tog.on"
                  class="relative w-10 h-6 rounded-full transition-colors flex-shrink-0 focus-visible:outline-none"
                  :class="
                    tog.on
                      ? 'bg-brand-500'
                      : 'bg-neutral-300 dark:bg-neutral-600'
                  "
                  @click="tog.on = !tog.on"
                >
                  <span
                    class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform"
                    :class="tog.on ? 'translate-x-4' : 'translate-x-0'"
                  />
                </button>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- C6 — Section: Combobox -->
    <section id="combobox">
      <div class="mb-5">
        <h2
          class="text-2xl font-bold tracking-tight text-ink dark:text-neutral-100 font-display"
        >
          Combobox Lanjutan
        </h2>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Select dengan pencarian dan opsi 'Buat baru'
        </p>
      </div>
      <div
        class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-soft p-7"
      >
        <div class="max-w-md">
          <label
            class="block text-sm font-semibold text-ink dark:text-neutral-200 mb-1.5"
            >Pilih Vendor</label
          >
          <div class="relative">
            <!-- Trigger button -->
            <button
              class="w-full h-11 px-3.5 rounded-md bg-white dark:bg-neutral-750 border text-sm text-left flex items-center gap-2 transition outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-brand-500"
              :class="
                cbOpen
                  ? 'border-brand-500 ring-4 ring-brand-500/15'
                  : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400'
              "
              @click="cbOpen = !cbOpen"
            >
              <span
                :class="
                  cbSelected
                    ? 'text-ink dark:text-neutral-200'
                    : 'text-neutral-400 dark:text-neutral-500'
                "
              >
                {{ cbSelected || "Pilih vendor…" }}
              </span>
              <ChevronDown
                class="w-4 h-4 ml-auto text-neutral-400 transition-transform"
                :class="cbOpen ? 'rotate-180' : ''"
              />
            </button>
            <!-- Dropdown -->
            <Transition name="pop">
              <div
                v-if="cbOpen"
                class="absolute z-10 mt-2 w-full rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lift overflow-hidden"
              >
                <div
                  class="p-2 border-b border-neutral-100 dark:border-neutral-700"
                >
                  <div class="relative">
                    <Search
                      class="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      v-model="cbQuery"
                      type="text"
                      placeholder="Cari vendor…"
                      class="w-full h-9 pl-9 pr-3 rounded bg-neutral-100 dark:bg-neutral-750 text-sm text-ink dark:text-neutral-200 placeholder:text-neutral-400 outline-none focus:bg-white dark:focus:bg-neutral-700 focus:ring-2 focus:ring-brand-500/30 transition"
                    />
                  </div>
                </div>
                <ul class="max-h-56 overflow-y-auto py-1 mp-scroll">
                  <li
                    v-for="s in cbFiltered"
                    :key="s"
                    class="flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-700 dark:hover:text-brand-300 cursor-pointer"
                    @click="cbPick(s)"
                  >
                    <Building2
                      class="w-4 h-4 text-neutral-400 dark:text-neutral-500"
                    />
                    <span>{{ s }}</span>
                    <Check
                      v-if="cbSelected === s"
                      class="w-4 h-4 ml-auto text-brand-500"
                    />
                  </li>
                  <li
                    v-if="cbFiltered.length === 0"
                    class="px-3 py-3 text-sm text-neutral-400 dark:text-neutral-500 text-center"
                  >
                    Tidak ada hasil
                  </li>
                </ul>
                <button
                  v-if="cbQuery && !cbExactMatch"
                  class="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 border-t border-neutral-100 dark:border-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  @click="cbCreate"
                >
                  <span
                    class="grid place-items-center w-5 h-5 rounded bg-brand-500 text-white flex-shrink-0"
                  >
                    <Plus class="w-3.5 h-3.5" />
                  </span>
                  Buat vendor baru "{{ cbQuery }}"
                </button>
              </div>
            </Transition>
          </div>
          <p class="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            Ketik nama yang belum ada untuk melihat opsi buat baru.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
