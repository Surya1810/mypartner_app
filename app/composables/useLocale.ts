import { useLocalStorage } from "@vueuse/core";

export function useLocale() {
  const locale = useLocalStorage<"id" | "en">("app-locale", "id");

  function setLocale(lang: "id" | "en") {
    locale.value = lang;
  }

  return {
    locale,
    setLocale,
  };
}
