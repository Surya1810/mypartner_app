const required = [
  "NUXT_JWT_SECRET",
  "NUXT_JWT_REFRESH_SECRET",
  "NUXT_DATABASE_URL",
  "NUXT_REDIS_URL",
];

export function validateEnv() {
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}
