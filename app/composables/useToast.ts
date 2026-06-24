import type { Component } from "vue";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-vue-next";
import { useState } from "#imports";

export interface ToastItem {
  id: string;
  title: string;
  body: string;
  tone: "success" | "danger" | "warning" | "info";
  icon: Component;
}

export function useToast() {
  const toasts = useState<ToastItem[]>("custom_toasts", () => []);

  const dismissToast = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  const addToast = (
    title: string,
    body: string,
    tone: "success" | "danger" | "warning" | "info",
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const iconMap: Record<string, any> = {
      success: CheckCircle,
      danger: XCircle,
      warning: AlertTriangle,
      info: Info,
    };
    const icon = iconMap[tone] || Info;

    toasts.value.push({ id, title, body, tone, icon });

    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  return { toasts, addToast, dismissToast };
}
