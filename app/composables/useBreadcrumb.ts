import { computed } from "vue";
import { useRoute } from "vue-router";

export function useBreadcrumb() {
  const route = useRoute();

  const breadcrumbs = computed(() => {
    const path = route.path;
    if (path === "/" || path === "/dashboard") {
      return [{ label: "Dashboard" }];
    }

    const segments = path.split("/").filter(Boolean);
    const items = [];

    let currentPath = "";
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (!segment) continue;
      currentPath += `/${segment}`;

      let label = segment;
      if (segment === "clients") label = "Klien";
      else if (segment === "new") label = "Tambah Baru";
      else if (segment === "users") label = "Pengguna";
      else if (segment === "divisions") label = "Divisi";
      else if (segment === "entities") label = "Entitas";
      else if (segment === "suppliers") label = "Supplier";
      else if (segment === "documents") label = "Manajemen Dokumen";
      else if (segment === "ui-preview") label = "UI Preview";
      else label = segment.charAt(0).toUpperCase() + segment.slice(1);

      items.push({
        label,
        href: i === segments.length - 1 ? undefined : currentPath,
      });
    }

    return items;
  });

  return { breadcrumbs };
}
