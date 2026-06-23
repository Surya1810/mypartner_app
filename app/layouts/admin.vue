<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

// Placeholder user data (replace with useAuth() in Phase 03)
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

// Navigation items — icons are Heroicons/Lucide (replace with actual icon component)
const navItems = [
  { type: "label", label: "Master Data" },
  { type: "link", href: "/entities", label: "Legal Entities", icon: "div" },
  { type: "link", href: "/divisions", label: "Divisi", icon: "div" },
  { type: "link", href: "/users", label: "Pengguna & RBAC", icon: "div" },
  { type: "link", href: "/clients", label: "Klien", icon: "div" },
  { type: "link", href: "/suppliers", label: "Supplier", icon: "div" },
  { type: "label", label: "Operasional" },
  { type: "link", href: "/documents", label: "Dokumen", icon: "div" },
  { type: "link", href: "/vault", label: "Vault Akun", icon: "div" },
  { type: "link", href: "/leave", label: "Cuti & Izin", icon: "div" },
  { type: "link", href: "/regulations", label: "Regulasi", icon: "div" },
  { type: "link", href: "/letters", label: "Surat", icon: "div" },
  { type: "label", label: "Sales" },
  { type: "link", href: "/presales", label: "Pre-Sales / CRM", icon: "div" },
  { type: "link", href: "/aftersales", label: "After-Sales", icon: "div" },
  { type: "label", label: "Produk & Inventaris" },
  { type: "link", href: "/products", label: "Katalog Produk", icon: "div" },
  { type: "link", href: "/inventory", label: "Inventaris", icon: "div" },
  { type: "label", label: "Intelligence" },
  { type: "link", href: "/dashboard", label: "Dashboard", icon: "div" },
  { type: "link", href: "/reports", label: "Laporan", icon: "div" },
  { type: "link", href: "/audit", label: "Audit Trail", icon: "div" },
];

function isActive(href: string) {
  return route.path === href || route.path.startsWith(`${href}/`);
}
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside
      class="flex-none flex-col fixed inset-y-0 left-0 z-40 flex"
      :style="{ width: 'var(--sidebar-width)' }"
      style="background: var(--color-sidebar-bg)"
    >
      <!-- Logo mark -->
      <div class="flex items-center gap-3 px-5 py-5">
        <div
          class="flex items-center justify-center w-9 h-9 rounded-lg"
          style="background: var(--color-primary)"
        >
          <!-- Replace with actual logo SVG -->
          <span class="text-white font-bold text-sm">MP</span>
        </div>
        <span class="text-white font-semibold text-sm">MyPartner</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <template v-for="item in navItems" :key="item.href">
          <!-- Group label -->
          <p
            v-if="item.type === 'label'"
            class="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider"
            style="color: var(--color-sidebar-icon-muted)"
          >
            {{ item.label }}
          </p>
          <!-- Nav item -->
          <NuxtLink
            v-else
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="isActive(item.href) ? 'text-white' : 'hover:bg-white/5'"
            :style="
              isActive(item.href)
                ? 'background: var(--color-primary); color: white;'
                : 'color: var(--color-sidebar-text-muted);'
            "
          >
            <component :is="item.icon" class="w-4 h-4 flex-none" />
            {{ item.label }}
          </NuxtLink>
        </template>
      </nav>

      <!-- User info at bottom -->
      <div
        class="px-3 py-4 border-t"
        style="border-color: var(--color-sidebar-icon-muted)"
      >
        <div class="flex items-center gap-3 px-2 py-2">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
            style="background: var(--color-primary)"
          >
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">
              {{ userName }}
            </p>
            <p
              class="text-xs truncate"
              style="color: var(--color-sidebar-text-muted)"
            >
              {{ userRole }}
            </p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main area -->
    <div
      class="flex-1 flex flex-col"
      :style="{ marginLeft: 'var(--sidebar-width)' }"
    >
      <!-- Navbar -->
      <header
        class="fixed right-0 z-30 flex items-center justify-between px-6 bg-white border-b"
        :style="{
          left: 'var(--sidebar-width)',
          height: 'var(--navbar-height)',
          borderColor: 'var(--color-border)',
        }"
      >
        <!-- Page title / breadcrumb slot -->
        <div>
          <slot name="navbar-left" />
        </div>

        <!-- Right side: search + actions + avatar -->
        <div class="flex items-center gap-3">
          <!-- Search -->
          <div
            class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm w-64"
            style="
              background: var(--color-surface-input);
              color: var(--color-text-muted);
            "
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Cari...</span>
          </div>

          <!-- Notification bell -->
          <button class="relative p-2 rounded-md hover:bg-gray-100">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          <!-- Avatar -->
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
            style="background: var(--color-primary)"
          >
            {{ userInitials }}
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main
        class="flex-1 overflow-y-auto"
        :style="{
          paddingTop: 'var(--navbar-height)',
          background: 'var(--color-background)',
          minHeight: '100vh',
        }"
      >
        <div class="p-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
