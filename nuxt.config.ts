import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  css: [
    // Montserrat — body font
    "@fontsource/montserrat/400.css",
    "@fontsource/montserrat/500.css",
    "@fontsource/montserrat/600.css",
    "@fontsource/montserrat/700.css",
    // Kanit — display/heading font
    "@fontsource/kanit/400.css",
    "@fontsource/kanit/600.css",
    "@fontsource/kanit/700.css",
    // JetBrains Mono — code/mono font
    "@fontsource/jetbrains-mono/400.css",
    "@fontsource/jetbrains-mono/500.css",
    // Global styles
    "~/assets/css/globals.css",
  ],

  modules: [
    "@nuxt/image",
    "@vueuse/nuxt",
    "@sentry/nuxt/module",
    "@nuxtjs/color-mode",
  ],

  colorMode: {
    classSuffix: "",
    preference: "light",
  },

  components: [
    {
      path: "~/components/ui",
      pathPrefix: false,
      extensions: ["vue"],
    },
    {
      path: "~/components/shared",
      pathPrefix: false,
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  postcss: {
    plugins: {
      autoprefixer: false,
    },
  },

  runtimeConfig: {
    jwtSecret: "",
    jwtRefreshSecret: "",
    databaseUrl: "",
    redisUrl: "",
    gcsBucket: "",
    gcsKeyFile: "",
    encryptionKey: "",
    public: {
      appName: "MyPartner",
      appVersion: "1.0.0",
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  ssr: true,

  nitro: {
    preset: "node-server",
  },
});
