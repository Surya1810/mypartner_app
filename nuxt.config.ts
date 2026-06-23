import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  css: [
    "@fontsource/inter/400.css",
    "@fontsource/inter/500.css",
    "@fontsource/inter/600.css",
    "@fontsource/inter/700.css",
    "~/assets/css/globals.css",
  ],

  modules: ["@nuxt/image", "@vueuse/nuxt", "@sentry/nuxt/module"],

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
