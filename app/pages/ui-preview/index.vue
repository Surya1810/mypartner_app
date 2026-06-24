<script setup lang="ts">
import { useHead } from "#imports";
import PreviewControls from "@/components/preview/PreviewControls.vue";
import PreviewData from "@/components/preview/PreviewData.vue";
import PreviewFeedback from "@/components/preview/PreviewFeedback.vue";
import PreviewFoundation from "@/components/preview/PreviewFoundation.vue";

definePageMeta({ layout: "admin" });
useHead({ title: "UI Preview" });
</script>

<template>
  <div class="p-6 space-y-16 max-w-[1200px] mx-auto">
    <PreviewFoundation />
    <PreviewControls />
    <PreviewFeedback />
    <PreviewData />
  </div>
</template>
