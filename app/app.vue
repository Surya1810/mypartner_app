<script setup lang="ts">
import type { CSSProperties } from "vue";
import { ref } from "vue";
import { useHead } from "#imports";
import { useToast } from "@/composables/useToast";

useHead({
  titleTemplate: (title) =>
    title ? `${title} | MyPartner by Partnership` : "MyPartner by Partnership",
});

const { toasts } = useToast();
const isToastExpanded = ref(false);

const toastClass: Record<string, string> = {
  success:
    "bg-success-50  border-success-300 dark:bg-success-900 dark:border-success-600",
  danger:
    "bg-danger-50   border-danger-300  dark:bg-danger-900  dark:border-danger-600",
  warning:
    "bg-warning-50  border-warning-300 dark:bg-warning-900 dark:border-warning-600",
  info: "bg-brand-50    border-brand-300   dark:bg-brand-900   dark:border-brand-600",
};

const toastTextColor: Record<string, string> = {
  success: "text-success-600 dark:text-success-300",
  danger: "text-danger-600  dark:text-danger-300",
  warning: "text-warning-600 dark:text-warning-300",
  info: "text-brand-600   dark:text-brand-300",
};

const toastIconColor: Record<string, string> = {
  success: "text-success-600 dark:text-success-300",
  danger: "text-danger-600  dark:text-danger-300",
  warning: "text-warning-600 dark:text-warning-300",
  info: "text-brand-600   dark:text-brand-300",
};

function getToastStyle(i: number): CSSProperties {
  const reversedIndex = toasts.value.length - 1 - i;

  if (isToastExpanded.value || toasts.value.length === 1) {
    return {
      position: "absolute",
      top: "0px",
      width: "100%",
      transform: `translateY(${reversedIndex * 74}px) scale(1)`,
      transformOrigin: "top center",
      opacity: 1,
      zIndex: 50 - reversedIndex,
    };
  }

  // Stacked state
  const isVisible = reversedIndex < 3;
  const scale = 1 - Math.min(reversedIndex, 3) * 0.05;
  const yOffset = Math.min(reversedIndex, 3) * 14;

  return {
    position: "absolute",
    top: "0px",
    width: "100%",
    transform: `translateY(${yOffset}px) scale(${scale})`,
    transformOrigin: "top center",
    opacity: isVisible ? 1 : 0,
    pointerEvents: isVisible ? "auto" : "none",
    zIndex: 50 - reversedIndex,
  };
}
</script>

<template>
  <div>
    <NuxtLayout><NuxtPage /></NuxtLayout>

    <!-- Toast container -->
    <div class="fixed top-5 right-5 z-50 w-80 pointer-events-none">
      <div
        class="relative w-full transition-all duration-300 pointer-events-auto"
        :style="{
          height: `${isToastExpanded || toasts.length <= 1 ? toasts.length * 74 : 74}px`,
        }"
        @mouseenter="isToastExpanded = true"
        @mouseleave="isToastExpanded = false"
      >
        <TransitionGroup name="pop">
          <div
            v-for="(t, i) in toasts"
            :key="t.id"
            class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-md border transition-all duration-300 ease-out flex-shrink-0"
            :class="toastClass[t.tone]"
            :style="getToastStyle(i)"
          >
            <component
              :is="t.icon"
              class="w-5 h-5 flex-shrink-0"
              :class="toastIconColor[t.tone]"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold" :class="toastTextColor[t.tone]">
                {{ t.title }}
              </p>
              <p
                v-if="t.body"
                class="text-sm mt-0.5 opacity-90"
                :class="toastTextColor[t.tone]"
              >
                {{ t.body }}
              </p>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>
