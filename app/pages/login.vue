<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

definePageMeta({ layout: false });
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center"
    style="background: var(--color-background)"
  >
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="flex items-center gap-3 justify-center mb-8">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center"
          style="background: var(--color-primary)"
        >
          <span class="text-white font-bold">MP</span>
        </div>
        <span class="text-xl font-semibold">MyPartner</span>
      </div>

      <!-- Form card -->
      <div
        class="bg-white rounded-2xl p-8"
        style="box-shadow: var(--shadow-modal)"
      >
        <h1 class="text-xl font-semibold mb-6">Masuk ke akun Anda</h1>

        <form class="space-y-4">
          <div>
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="anda@partnership.co.id"
              class="mt-1"
            />
          </div>
          <div>
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              class="mt-1"
            />
          </div>
          <Button class="w-full" style="background: var(--color-primary)">
            Masuk
          </Button>
        </form>
      </div>

      <p
        class="text-center text-xs mt-6"
        style="color: var(--color-text-muted)"
      >
        MyPartner v1.0 — PT Partnership Procurement Solution
      </p>
    </div>
  </div>
</template>
