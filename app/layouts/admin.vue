<script setup lang="ts">
import type { Component } from "vue";
import {
  AlertCircle,
  ArrowLeftRight,
  BarChart2,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  CalendarOff,
  CheckCircle,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  FileSpreadsheet,
  FolderOpen,
  HeartHandshake,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Moon,
  Network,
  Package,
  Settings,
  Sun,
  Target,
  TrendingDown,
  TrendingUp,
  Truck,
  UserCheck,
  UserCog,
  Users,
  Wallet,
  Warehouse,
} from "lucide-vue-next";
import { useRoute } from "vue-router";

import { useBreadcrumb } from "@/composables/useBreadcrumb";
import { useDateTime } from "@/composables/useDateTime";
import { useLocale } from "@/composables/useLocale";
import { useSidebar } from "@/composables/useSidebar";
import { useTheme } from "@/composables/useTheme";
import { useToast } from "@/composables/useToast";

const route = useRoute();
const { isCollapsed, toggle: toggleSidebar } = useSidebar();
const { isDark, toggle: toggleTheme } = useTheme();
const { breadcrumbs } = useBreadcrumb();
const { locale, setLocale } = useLocale();
const { addToast } = useToast();
const dateTime = useDateTime();

function toggleLocale() {
  setLocale(locale.value === "id" ? "en" : "id");
}

const userName = ref("Budi Santoso");
const userRole = ref("Manager");
const userInitials = computed(() => {
  return userName.value
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
});

function logout() {
  navigateTo("/login");
}

const breadcrumbParent = computed(() =>
  breadcrumbs.value.length > 1
    ? (breadcrumbs.value[breadcrumbs.value.length - 2]?.label ?? "Dashboard")
    : "Dashboard",
);
const breadcrumbCurrent = computed(() =>
  breadcrumbs.value.length > 0
    ? (breadcrumbs.value[breadcrumbs.value.length - 1]?.label ?? "")
    : "",
);

interface NavItem {
  id: string;
  label: string;
  icon: Component;
  disabled?: boolean;
  badge?: string;
  subItems?: { id: string; label: string; icon: Component }[];
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "reports", label: "Laporan", icon: BarChart2 },
      { id: "audit-log", label: "Audit Log", icon: ClipboardList },
    ],
  },
  {
    label: "Operasional",
    items: [
      {
        id: "finance",
        label: "Keuangan",
        icon: Wallet,
        disabled: true,
        badge: "Segera",
        subItems: [
          { id: "finance/income", label: "Pemasukan", icon: TrendingUp },
          { id: "finance/expense", label: "Pengeluaran", icon: TrendingDown },
          {
            id: "finance/report",
            label: "Lap.Keuangan",
            icon: FileSpreadsheet,
          },
        ],
      },
      { id: "documents", label: "Dokumen", icon: FolderOpen },
      {
        id: "tasks",
        label: "Tugas",
        icon: CheckSquare,
        disabled: true,
        badge: "Segera",
      },
      { id: "leave", label: "Cuti & Izin", icon: CalendarOff },
      { id: "employees", label: "Karyawan", icon: UserCog },
      { id: "announcements", label: "Pengumuman", icon: Megaphone },
      {
        id: "learning",
        label: "Pembelajaran",
        icon: BookOpen,
        disabled: true,
        badge: "Segera",
      },
    ],
  },
  {
    label: "Sales",
    items: [
      { id: "presales", label: "Pre-Sales / CRM", icon: Target },
      { id: "aftersales", label: "After-Sales", icon: HeartHandshake },
      {
        id: "projects",
        label: "Project",
        icon: Briefcase,
        disabled: true,
        badge: "Segera",
      },
      {
        id: "transactions",
        label: "Transaksi",
        icon: ArrowLeftRight,
        disabled: true,
        badge: "Segera",
      },
    ],
  },
  {
    label: "Produk & Inventaris",
    items: [
      { id: "products", label: "Katalog Produk", icon: Package },
      { id: "inventory", label: "Inventaris & Stok", icon: Warehouse },
      {
        id: "stock-opname",
        label: "Stock Opname",
        icon: ClipboardCheck,
        disabled: true,
        badge: "Segera",
      },
    ],
  },
  {
    label: "Master Data",
    items: [
      { id: "entity", label: "Entitas", icon: Building2 },
      { id: "division", label: "Divisi", icon: Network },
      { id: "users", label: "Pengguna", icon: Users },
      { id: "clients", label: "Klien", icon: UserCheck },
      { id: "suppliers", label: "Vendor", icon: Truck },
      { id: "vault", label: "Akun", icon: KeyRound },
    ],
  },
];

const isKeuanganOpen = ref(false);

function isActive(href: string) {
  return route.path === href || route.path.startsWith(`${href}/`);
}

function navItemClass(path: string, disabled: boolean = false) {
  if (disabled) return "";
  const active = isActive(path);
  if (active) {
    return "bg-brand-500 text-white shadow-brand";
  } else {
    return isDark.value
      ? "text-neutral-400 hover:bg-white/5 hover:text-white"
      : "text-neutral-600 hover:bg-neutral-100 hover:text-ink";
  }
}
</script>

<template>
  <div class="flex min-h-screen font-sans bg-neutral-50 dark:bg-neutral-850">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 flex flex-col z-40 transition-all duration-200 border-r bg-white dark:bg-neutral-950 border-neutral-200 dark:border-white/10"
      :class="isCollapsed ? 'w-16' : 'w-[260px]'"
    >
      <!-- A1: Logo area header -->
      <div
        class="flex items-center h-16 border-b flex-shrink-0"
        :class="[
          isDark ? 'border-white/10' : 'border-neutral-200',
          isCollapsed ? 'justify-center px-0' : 'px-5 gap-2.5',
        ]"
      >
        <!-- Klik area → /settings -->
        <NuxtLink
          to="/settings"
          class="flex items-center min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950 rounded"
          :class="isCollapsed ? 'justify-center w-full' : 'gap-2.5'"
        >
          <div
            class="grid place-items-center w-9 h-9 rounded-lg bg-brand-500 shadow-brand flex-shrink-0"
          >
            <!-- Logo SVG Partnership mark -->
            <img
              src="/images/logo-pps-symbol.png"
              class="w-5 h-5 object-contain"
              alt="PPS"
            />
          </div>
          <div v-if="!isCollapsed" class="leading-tight min-w-0">
            <div
              class="font-bold text-xl truncate font-display"
              :class="isDark ? 'text-white' : 'text-ink'"
            >
              MyPartner
            </div>
            <span
              class="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400"
            >
              V2.0
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav
        class="flex-1 px-3 py-4 space-y-6 overflow-y-auto mp-scroll flex flex-col min-h-0"
      >
        <template v-for="(group, idx) in navigation" :key="idx">
          <div>
            <!-- Group label -->
            <p
              v-if="group.label && !isCollapsed"
              class="px-3 mb-2 text-[10px] uppercase tracking-[.14em] font-semibold text-neutral-400 dark:text-neutral-500"
            >
              {{ group.label }}
            </p>
            <div class="space-y-1">
              <template v-for="item in group.items" :key="item.id">
                <!-- SubItems (Finance) -->
                <div v-if="item.subItems">
                  <!-- Parent Item -->
                  <div
                    v-if="!isCollapsed"
                    class="group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950"
                    :class="[
                      navItemClass(`/${item.id}`, item.disabled),
                      item.disabled
                        ? 'pointer-events-none opacity-50 text-neutral-600 dark:text-neutral-400'
                        : '',
                    ]"
                    @click="
                      !item.disabled ? (isKeuanganOpen = !isKeuanganOpen) : null
                    "
                  >
                    <component
                      :is="item.icon"
                      class="w-[18px] h-[18px] flex-shrink-0"
                    />
                    <span class="flex-1 truncate">{{ item.label }}</span>
                    <span
                      v-if="item.badge"
                      class="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-50 text-brand-600"
                    >
                      {{ item.badge }}
                    </span>
                    <ChevronDown
                      v-if="!item.disabled"
                      class="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                      :class="isKeuanganOpen ? 'rotate-180' : ''"
                    />
                  </div>
                  <div
                    v-else
                    class="flex items-center justify-center w-10 h-10 rounded-md mx-auto transition-colors"
                    :class="item.disabled ? 'opacity-50 text-neutral-400' : ''"
                  >
                    <component
                      :is="item.icon"
                      class="w-[18px] h-[18px] flex-shrink-0"
                    />
                  </div>

                  <!-- Sub Items -->
                  <div
                    class="overflow-hidden transition-all duration-200 space-y-1 mt-1"
                    :style="{
                      maxHeight:
                        !isCollapsed && isKeuanganOpen ? '200px' : '0px',
                    }"
                  >
                    <NuxtLink
                      v-for="sub in item.subItems"
                      :key="sub.id"
                      :to="`/${sub.id}`"
                      class="group flex items-center gap-3 pl-8 pr-3 py-2.5 rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950"
                      :class="[
                        navItemClass(`/${sub.id}`),
                        item.disabled
                          ? 'pointer-events-none opacity-50 text-neutral-600 dark:text-neutral-400'
                          : '',
                      ]"
                    >
                      <component
                        :is="sub.icon"
                        class="w-[16px] h-[16px] flex-shrink-0"
                      />
                      <span class="flex-1 truncate">{{ sub.label }}</span>
                    </NuxtLink>
                  </div>
                </div>

                <!-- Normal / Disabled -->
                <NuxtLink
                  v-else
                  :to="`/${item.id}`"
                  class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950"
                  :class="[
                    !isCollapsed
                      ? 'group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors'
                      : 'flex items-center justify-center w-10 h-10 rounded-md mx-auto transition-colors',
                    navItemClass(`/${item.id}`, !!item.disabled),
                    item.disabled
                      ? 'pointer-events-none opacity-50 text-neutral-600 dark:text-neutral-400'
                      : '',
                  ]"
                >
                  <div class="relative flex items-center">
                    <component
                      :is="item.icon"
                      class="w-[18px] h-[18px] flex-shrink-0"
                    />
                  </div>
                  <span v-if="!isCollapsed" class="flex-1 truncate">{{
                    item.label
                  }}</span>

                  <template v-if="!isCollapsed && item.badge">
                    <!-- Normal badge for disabled items -->
                    <span
                      class="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-50 text-brand-600"
                    >
                      {{ item.badge }}
                    </span>
                  </template>
                </NuxtLink>
              </template>
            </div>
          </div>
        </template>
      </nav>

      <!-- Sidebar footer (Profile) -->
      <div
        class="flex-shrink-0 border-t border-neutral-200 dark:border-white/10"
        style="box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.06)"
      >
        <!-- Profile & Logout Row -->
        <div class="flex items-center gap-2 px-3 py-3">
          <!-- Profile Link -->
          <NuxtLink
            to="/profile"
            class="flex items-center gap-3 flex-1 min-w-0 p-1 rounded-lg transition-colors hover:bg-neutral-100 dark:hover:bg-white/5"
            :class="isCollapsed ? 'justify-center p-0' : ''"
          >
            <!-- Avatar -->
            <div
              class="w-9 h-9 rounded-full grid place-items-center font-bold text-sm flex-shrink-0 bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300"
            >
              {{ userInitials }}
            </div>

            <!-- Nama & Role (jika expanded) -->
            <div v-if="!isCollapsed" class="leading-tight min-w-0 flex-1 pr-1">
              <div
                class="text-sm font-semibold truncate text-ink dark:text-neutral-100"
              >
                {{ userName }}
              </div>
              <div
                class="text-xs truncate text-neutral-500 dark:text-neutral-400"
              >
                {{ userRole }}
              </div>
            </div>
          </NuxtLink>

          <!-- Logout Button (jika expanded) -->
          <button
            v-if="!isCollapsed"
            class="flex items-center justify-center w-9 h-9 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-danger-600 dark:hover:text-danger-400 hover:border-danger-200 dark:hover:border-danger-800/50 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-all shadow-sm flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            title="Keluar"
            @click="logout"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>

        <!-- Logout icon solo saat collapsed -->
        <button
          v-if="isCollapsed"
          class="w-full flex justify-center py-2 text-neutral-400 hover:text-danger-500 transition-colors focus-visible:outline-none"
          title="Keluar"
          @click="logout"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </aside>

    <!-- Collapse toggle button — overlap di tepi kanan sidebar -->
    <button
      class="fixed z-40 flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-soft text-neutral-500 dark:text-neutral-400 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-600 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      :style="{
        top: '32px',
        left: isCollapsed ? '52px' : '248px',
        transform: 'translateY(-50%)',
      }"
      :title="isCollapsed ? 'Buka sidebar' : 'Tutup sidebar'"
      @click="isCollapsed = !isCollapsed"
    >
      <ChevronLeft
        class="w-3.5 h-3.5 transition-transform duration-200"
        :class="isCollapsed ? 'rotate-180' : ''"
      />
    </button>

    <!-- Main area -->
    <div
      class="flex-1 flex flex-col transition-all duration-200"
      :style="{ marginLeft: isCollapsed ? '64px' : '260px' }"
    >
      <!-- Navbar (A5) -->
      <header
        class="sticky top-0 z-20 h-16 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3 px-5 sm:px-8 transition-colors"
      >
        <!-- Breadcrumb kiri -->
        <div class="flex flex-col justify-center mr-auto gap-1">
          <div
            class="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 font-medium"
          >
            <span>{{ breadcrumbParent }}</span>
            <ChevronRight
              class="w-4 h-4 text-neutral-300 dark:text-neutral-600"
            />
            <span class="text-ink dark:text-neutral-100 font-semibold">{{
              breadcrumbCurrent
            }}</span>
          </div>
        </div>

        <!-- DateTime — kanan navbar, sebelum bell -->
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <span
            class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap"
          >
            {{ dateTime.dayFull }}
          </span>
          <span
            class="text-neutral-300 dark:text-neutral-600 select-none mx-1.5"
            >|</span
          >
          <span
            class="font-mono text-xs px-2 py-0.5 rounded-md tabular-nums bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300"
          >
            {{ dateTime.timeStr }}
          </span>
        </div>

        <!-- Notification Popover -->
        <Popover>
          <PopoverTrigger as-child>
            <button
              class="relative grid place-items-center w-10 h-10 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Bell class="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <span
                class="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-white dark:ring-neutral-900"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            class="w-80 p-0 z-50 bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700"
            side="bottom"
            align="end"
          >
            <div
              class="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-700"
            >
              <span
                class="text-sm font-semibold text-neutral-700 dark:text-neutral-200"
                >Notifikasi</span
              >
              <button class="text-xs text-brand-500 hover:underline">
                Tandai semua dibaca
              </button>
            </div>
            <div class="max-h-[300px] overflow-y-auto">
              <!-- Item 1 -->
              <div
                class="flex items-start gap-3 px-4 py-3 border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer"
              >
                <div
                  class="w-8 h-8 rounded-full grid place-items-center bg-brand-50 dark:bg-brand-500/20 text-brand-500 dark:text-brand-300 flex-shrink-0 self-center"
                >
                  <Bell class="w-4 h-4" />
                </div>
                <div class="flex-1 min-w-0">
                  <div
                    class="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate"
                  >
                    Permintaan baru
                  </div>
                  <div
                    class="text-xs text-neutral-500 dark:text-neutral-400 truncate"
                  >
                    Pre-Sales dari PT Maju Bersama
                  </div>
                  <div
                    class="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5"
                  >
                    2 mnt lalu
                  </div>
                </div>
                <div
                  class="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1.5"
                />
              </div>
              <!-- Item 2 -->
              <div
                class="flex items-start gap-3 px-4 py-3 border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer"
              >
                <div
                  class="w-8 h-8 rounded-full grid place-items-center bg-success-50 dark:bg-success-900/20 text-success-500 flex-shrink-0 self-center"
                >
                  <CheckCircle class="w-4 h-4" />
                </div>
                <div class="flex-1 min-w-0">
                  <div
                    class="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate"
                  >
                    Dokumen disetujui
                  </div>
                  <div
                    class="text-xs text-neutral-500 dark:text-neutral-400 truncate"
                  >
                    SK-2026-0023 telah disetujui
                  </div>
                  <div
                    class="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5"
                  >
                    1 jam lalu
                  </div>
                </div>
                <div
                  class="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1.5"
                />
              </div>
              <!-- Item 3 -->
              <div
                class="flex items-start gap-3 px-4 py-3 border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer"
              >
                <div
                  class="w-8 h-8 rounded-full grid place-items-center bg-warning-50 dark:bg-warning-900/20 text-warning-500 flex-shrink-0 self-center"
                >
                  <AlertCircle class="w-4 h-4" />
                </div>
                <div class="flex-1 min-w-0">
                  <div
                    class="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate"
                  >
                    Stok kritis
                  </div>
                  <div
                    class="text-xs text-neutral-500 dark:text-neutral-400 truncate"
                  >
                    HP ProBook 450 tersisa 2 unit
                  </div>
                  <div
                    class="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5"
                  >
                    3 jam lalu
                  </div>
                </div>
              </div>
            </div>
            <div
              class="px-4 py-3 text-center border-t border-neutral-100 dark:border-neutral-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-b-md transition-colors"
            >
              <NuxtLink
                to="/notifications"
                class="text-sm text-brand-600 dark:text-brand-400 font-medium block"
              >
                Lihat Semua Notifikasi
              </NuxtLink>
            </div>
          </PopoverContent>
        </Popover>

        <!-- Settings button -->
        <button
          class="grid place-items-center w-10 h-10 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          @click="
            addToast('Coming Soon', 'Halaman pengaturan segera hadir.', 'info')
          "
        >
          <Settings class="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </button>

        <!-- Theme toggle -->
        <button
          class="grid place-items-center w-10 h-10 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          @click="toggleTheme"
        >
          <Sun
            v-if="isDark"
            class="w-5 h-5 text-neutral-600 dark:text-neutral-400"
          />
          <Moon v-else class="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </button>

        <!-- Language switcher -->
        <button
          class="h-8 px-2.5 rounded-md border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:border-brand-500 hover:text-brand-600 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          @click="toggleLocale"
        >
          {{ locale === "id" ? "ID" : "EN" }}
        </button>
      </header>

      <main class="flex-1 px-8 py-6">
        <slot />
      </main>
    </div>
  </div>
</template>
