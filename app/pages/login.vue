<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { Eye, EyeOff } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { loginSchema } from "~~/server/validators/auth";

definePageMeta({
  layout: false,
  middleware: "guest",
});

useHead({
  title: "Masuk",
});

const showPassword = ref(false);

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: {
    email: "",
    password: "",
    rememberMe: false,
  },
});

const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const [rememberMe] = defineField("rememberMe");

const onSubmit = handleSubmit(async () => {
  try {
    await navigateTo("/dashboard", { replace: true });
  } catch (error) {
    // Handle error if navigateTo fails (should not fail)
  }
});
</script>

<template>
  <div
    class="min-h-screen flex flex-col md:flex-row bg-white dark:bg-neutral-900"
  >
    <!-- Left panel — branding (hidden on mobile, shown on md and up) -->
    <div
      class="hidden md:flex md:w-1/2 flex-col justify-between p-12 text-white relative bg-gradient-to-br from-neutral-950 via-brand-900 to-brand-600"
    >
      <!-- Logo top-left -->
      <div>
        <img
          src="/images/logo-pps-dark.png"
          class="h-10 object-contain object-left"
          alt="Partnership Logo"
        />
      </div>

      <!-- Bottom text -->
      <div>
        <h1
          class="font-display text-4xl font-bold text-white mb-2 leading-tight"
        >
          MyPartner
        </h1>
        <p class="text-white/85 text-lg font-medium mb-1">
          Sistem Manajemen Internal
        </p>
        <p class="text-white/60 text-sm whitespace-nowrap">
          PT Partnership Procurement Solution
        </p>
      </div>

      <!-- Footer copyright -->
      <p class="text-white/40 text-xs font-medium">
        © 2026 PT Partnership Procurement Solution
      </p>
    </div>

    <!-- Right panel — form -->
    <div
      class="flex-1 flex items-center justify-center p-6 md:p-12 bg-neutral-50 dark:bg-neutral-900"
      style="
        background-image: url(&quot;/images/backgrounds/bg-login-light.jpg&quot;);
        background-size: cover;
        background-position: center;
      "
    >
      <div class="w-full max-w-[420px] relative z-10">
        <form
          class="bg-white rounded-xl shadow-lift border border-neutral-100 p-8 md:p-10"
          @submit="onSubmit"
        >
          <!-- Logo (mobile only) -->
          <div class="flex items-center gap-3 mb-6 md:hidden">
            <div
              class="w-9 h-9 rounded-lg bg-brand-500 grid place-items-center"
            >
              <img
                src="/images/logo-pps-symbol.png"
                class="w-5 h-5 object-contain"
                alt="PPS Symbol"
              />
            </div>
            <span class="font-display font-bold text-ink text-lg"
              >MyPartner</span
            >
          </div>

          <!-- Symbol/Icon PPS on Login Card (Top Centered) -->
          <div class="flex flex-col items-center mb-6">
            <div
              class="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shadow-sm mb-3"
            >
              <img
                src="/images/logo-pps-symbol.png"
                class="w-8 h-8 object-contain"
                alt="PPS Symbol"
              />
            </div>
            <h2 class="font-display text-2xl font-bold text-ink">
              Selamat Datang
            </h2>
            <p class="text-xs text-neutral-500 mt-1 text-center">
              Masuk ke akun MyPartner Anda
            </p>
          </div>

          <!-- Form fields: email + password + remember me -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-ink mb-1.5"
                >Email</label
              >
              <input
                v-model="email"
                v-bind="emailAttrs"
                type="email"
                placeholder="contoh@partnership.co.id"
                class="w-full h-11 px-3.5 rounded-md bg-white border text-sm text-ink placeholder:text-neutral-400 outline-none transition"
                :class="
                  errors.email
                    ? 'border-danger-500 focus:border-danger-500 focus:ring-4 focus:ring-danger-500/15'
                    : 'border-neutral-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15'
                "
              />
              <span
                v-if="errors.email"
                class="text-xs text-danger-500 mt-1 block font-medium"
              >
                {{ errors.email }}
              </span>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-sm font-medium text-ink"
                  >Password</label
                >
                <a
                  href="#"
                  class="text-xs font-medium text-brand-600 hover:text-brand-700"
                  >Lupa password?</a
                >
              </div>
              <div class="relative">
                <input
                  v-model="password"
                  v-bind="passwordAttrs"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full h-11 pl-3.5 pr-10 rounded-md bg-white border text-sm text-ink placeholder:text-neutral-400 outline-none transition"
                  :class="
                    errors.password
                      ? 'border-danger-500 focus:border-danger-500 focus:ring-4 focus:ring-danger-500/15'
                      : 'border-neutral-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15'
                  "
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
                  @click="showPassword = !showPassword"
                >
                  <Eye v-if="!showPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
              <span
                v-if="errors.password"
                class="text-xs text-danger-500 mt-1 block font-medium"
              >
                {{ errors.password }}
              </span>
            </div>

            <div class="flex items-center gap-2 pt-1 pb-2">
              <input
                id="remember"
                v-model="rememberMe"
                type="checkbox"
                class="rounded border-neutral-300 text-brand-500 focus:ring-brand-500/20"
              />
              <label
                for="remember"
                class="text-sm text-neutral-600 select-none cursor-pointer"
                >Ingat saya</label
              >
            </div>

            <!-- CTA: full-width bg-brand-500 h-11 rounded-md font-semibold -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full h-11 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-brand transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>Masuk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
