import { computed, onMounted, onUnmounted, ref } from "vue";

export function useDateTime() {
  const now = ref(new Date());
  let interval: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    interval = setInterval(() => {
      now.value = new Date();
    }, 1000);
  });

  onUnmounted(() => {
    if (interval !== null) clearInterval(interval);
  });

  const dayFull = computed(() =>
    now.value.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  );
  const timeStr = computed(() =>
    now.value
      .toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/\./g, ":"),
  );

  return { dayFull, timeStr };
}
