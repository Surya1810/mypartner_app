<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster position="bottom-right" rich-colors />
  </div>
</template>
