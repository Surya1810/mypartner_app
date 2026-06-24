import { useLocalStorage } from "@vueuse/core";

export function useSidebar() {
  // default false, persist ke localStorage 'sidebar-collapsed'
  const isCollapsed = useLocalStorage("sidebar-collapsed", false);

  function toggle() {
    isCollapsed.value = !isCollapsed.value;
  }

  return {
    isCollapsed,
    toggle,
  };
}
