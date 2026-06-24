import { useColorMode } from "#imports";

export function useTheme() {
  const colorMode = useColorMode();

  const isDark = computed(() => colorMode.value === "dark");

  function toggle() {
    colorMode.preference = isDark.value ? "light" : "dark";
  }

  return {
    isDark,
    toggle,
  };
}
