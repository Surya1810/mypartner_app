# skills/backend.md — Backend Implementation Patterns

> Auth-related server patterns are in `skills/auth.md`.
> Security rules and rate limiting rules are in `rules/backend.md`.

---

## Response Helpers

All responses must go through these helpers. Never return a raw object from a route handler.

```ts
// server/utils/response.ts

export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function ok<T>(data: T) {
  return { success: true as const, data };
}

export function okList<T>(data: T[], meta: ApiMeta) {
  return { success: true as const, data, meta };
}
```

Errors are thrown with `createError()` and normalized by `server/plugins/error-handler.ts`.
Field-level validation errors go in `createError({ data: { errors: [...] } })`.

```ts
// server/plugins/error-handler.ts
export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook("error", (error, { event }) => {
    if (!event) return;

    const statusCode = error.statusCode ?? 500;
    const message =
      error.statusMessage ?? error.message ?? "Terjadi kesalahan.";
    const errors = (
      error.data as { errors?: { field: string; message: string }[] }
    )?.errors;

    setResponseStatus(event, statusCode);
    setResponseHeader(event, "content-type", "application/json");
    return send(
      event,
      JSON.stringify({
        success: false,
        message,
        ...(errors?.length ? { errors } : {}),
      }),
    );
  });
});
```

---

## Nuxt 4 Server Route Pattern

```ts
// server/api/articles/index.get.ts
/**
 * GET /api/articles
 * Returns paginated list of articles.
 *
 * Auth: requires auth
 * Query: page (number, default 1), limit (number, default 10, max 100)
 * Response 200: { success: true, data: Article[], meta: { total, page, limit, totalPages } }
 * Response 401: { success: false, message: string }
 */
export default defineEventHandler(async (event) => {
  const user = event.context.user; // attached by server/middleware/auth.ts
  const query = getQuery(event);

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));

  const { data, total } = await articleService.listArticles({
    page,
    limit,
    userId: user.id,
  });

  return okList(data, {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});
```

```ts
// server/api/articles/index.post.ts
/**
 * POST /api/articles
 * Creates a new article.
 *
 * Auth: requires auth
 * Body: CreateArticleInput (see server/validators/article.ts)
 * Response 201: { success: true, data: Article }
 * Response 400: { success: false, message: string, errors: [{ field, message }] }
 */
export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);

  const result = createArticleSchema.safeParse(body);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      data: {
        errors: result.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
    });
  }

  const article = await articleService.createArticle(result.data, user.id);
  setResponseStatus(event, 201);
  return ok(article);
});
```

Use `safeParse` (not `schema.parse`) when you need field-level errors in the response.
Use `readValidatedBody(event, schema.parse)` only for simple cases where a generic 400 is acceptable.

---

## ORM / Database

### Prisma

```ts
// prisma/schema.prisma
model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String    @map("password_hash")
  name         String
  role         Role      @default(USER)
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  refreshTokens RefreshToken[]

  @@map("users")
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String   @map("user_id")
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
}

enum Role {
  USER
  ADMIN
}
```

```ts
// server/utils/db.ts — singleton client
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

Migrations:

```bash
npx prisma migrate dev --name add-refresh-tokens
npx prisma db seed
npx prisma studio
```

### Drizzle

```ts
// server/db/schema/users.ts
import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: roleEnum("role").notNull().default("USER"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});
```

Migrations:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
npx drizzle-kit studio
```

### Repository Pattern

```ts
// server/repositories/user.repository.ts
import { db } from "~/server/utils/db";

export const userRepository = {
  async findByEmail(email: string) {
    return db.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return db.user.findUnique({ where: { id } });
  },

  async create(data: { email: string; passwordHash: string; name: string }) {
    return db.user.create({ data });
  },
};
```

Never call `db` directly in services or route handlers - always through a repository.

---

## Zod Validation in Server

```ts
// server/validators/article.ts
import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(10),
  categoryId: z.string().cuid(),
  published: z.boolean().default(false),
});

export const updateArticleSchema = createArticleSchema.partial();

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
```

Validation errors use `safeParse` and throw `createError` with field-level `data.errors`.
The global error handler in `server/plugins/error-handler.ts` normalizes the output to
`{ success: false, message, errors }`. See the POST route handler pattern above for the full idiom.

---

## Security Headers Middleware

```ts
// server/middleware/security-headers.ts
export default defineEventHandler((event) => {
  setHeader(event, "X-Content-Type-Options", "nosniff");
  setHeader(event, "X-Frame-Options", "DENY");
  setHeader(event, "Referrer-Policy", "strict-origin-when-cross-origin");
  setHeader(event, "X-XSS-Protection", "0"); // disabled; rely on CSP instead

  if (process.env.NODE_ENV === "production") {
    setHeader(
      event,
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  // Set CSP per project based on fonts, CDNs, and assets in use
  // setHeader(event, 'Content-Security-Policy', "default-src 'self'; ...")
});
```

---

## File Serving Proxy (Private Files)

```ts
// server/api/files/[key].get.ts
import { createReadStream, existsSync } from "node:fs";
import { extname } from "node:path";
import { lookup } from "mime-types";

/**
 * GET /api/files/:key
 * Streams a private file. Requires authentication.
 *
 * Auth: requires auth
 * Param: key - the file key stored in DB (e.g. "uploads/2024/01/image.jpg")
 * Response 200: file binary stream
 * Response 401: unauthorized
 * Response 404: file not found
 */
export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) throw createError({ statusCode: 401 });

  const key = getRouterParam(event, "key");
  if (!key) throw createError({ statusCode: 400 });

  // Prevent path traversal
  const sanitizedKey = key.replace(/\.\./g, "").replace(/^\//, "");
  const filePath = `./storage/${sanitizedKey}`;

  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, message: "File not found" });
  }

  // Optionally verify file belongs to user (query DB for ownership)

  const mimeType = lookup(extname(filePath)) || "application/octet-stream";
  setHeader(event, "Content-Type", mimeType);
  setHeader(event, "Cache-Control", "private, max-age=3600");

  return sendStream(event, createReadStream(filePath));
});
```

---

## File Upload Validation

```ts
// server/utils/file-validation.ts
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function validateUploadedFile(file: {
  data: Buffer;
  type: string;
  size: number;
}) {
  if (file.size > MAX_SIZE_BYTES) {
    throw createError({
      statusCode: 400,
      message: "File terlalu besar. Maksimal 5MB.",
    });
  }

  // Check magic bytes (not just Content-Type header)
  const magicBytes = file.data.slice(0, 4);
  const detectedMime = detectMimeFromBytes(magicBytes);

  if (!ALLOWED_MIME_TYPES.includes(detectedMime)) {
    throw createError({
      statusCode: 400,
      message: "Tipe file tidak diizinkan.",
    });
  }

  return detectedMime;
}

function detectMimeFromBytes(bytes: Buffer): string {
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return "image/jpeg";
  // PNG: 89 50 4E 47
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  )
    return "image/png";
  // WebP: 52 49 46 46 (RIFF)
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46
  )
    return "image/webp";
  // GIF: 47 49 46 38
  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  )
    return "image/gif";
  return "application/octet-stream";
}
```

---

## Logging — pino

```ts
// server/utils/logger.ts
import pino from "pino";
import { join } from "node:path";

const today = new Date().toISOString().split("T")[0];

export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? "info",
  },
  pino.destination({
    dest: join(process.cwd(), "logs", `app-${today}.log`),
    sync: false,
  }),
);
```

Usage:

```ts
import { logger } from "~/server/utils/logger";

logger.info({
  event: "auth.login.success",
  ip: getRequestHeader(event, "x-forwarded-for") ?? "unknown",
  method: "POST",
  path: "/api/auth/login",
  userId: user.id,
  details: {},
});

logger.warn({
  event: "auth.login.failed",
  ip: "...",
  method: "POST",
  path: "/api/auth/login",
  userId: null,
  details: { email },
});
```

---

## Token Utils

```ts
// server/utils/token.ts
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRY = "15m";

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function generateRefreshToken(): string {
  return randomBytes(64).toString("hex");
}
```

---

## Password Hashing

```ts
// server/utils/password.ts
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

---

## Seed Script Pattern

```ts
// prisma/seed.ts or server/db/seed.ts
import { hashPassword } from "../server/utils/password";
import { faker } from "@faker-js/faker/locale/id_ID";

async function main() {
  // Admin user - idempotent
  const existing = await db.user.findUnique({
    where: { email: "admin@example.com" },
  });
  if (!existing) {
    await db.user.create({
      data: {
        email: "admin@example.com",
        passwordHash: await hashPassword("Admin123!"),
        name: "Administrator",
        role: "ADMIN",
      },
    });
  }

  // Bulk fake data - only if table is empty
  const count = await db.article.count();
  if (count === 0) {
    await db.article.createMany({
      data: Array.from({ length: 30 }, () => ({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(4),
        published: faker.datatype.boolean(),
      })),
    });
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
```

---

## RBAC — Role-Based Access Control

```ts
// server/middleware/require-role.ts
export function requireRole(...roles: string[]) {
  return defineEventHandler((event) => {
    const user = event.context.user;
    if (!user) throw createError({ statusCode: 401 });
    if (!roles.includes(user.role))
      throw createError({ statusCode: 403, message: "Forbidden" });
  });
}

// Usage in route handler:
export default defineEventHandler([
  requireRole("ADMIN"),
  async (event) => {
    // only ADMIN reaches here
  },
]);
```

Frontend visibility (defense in depth - server check is primary):

```ts
const { user } = useAuth();
const isAdmin = computed(() => user.value?.role === "ADMIN");
```

---

## Optional: Email — Resend

```ts
// server/utils/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    html,
  });
}
```

Email templates in `server/templates/email/` as HTML strings with placeholder interpolation.

---

## Optional: File Storage — Google Cloud Storage

```ts
// server/utils/gcs.ts
import { Storage } from "@google-cloud/storage";

const storage = new Storage({ keyFilename: process.env.GCS_KEY_FILE });
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

export async function uploadToGCS(
  buffer: Buffer,
  key: string,
  mimeType: string,
) {
  const file = bucket.file(key);
  await file.save(buffer, { contentType: mimeType, resumable: false });
  return key; // return the key, not a public URL; serve via proxy
}

export async function deleteFromGCS(key: string) {
  await bucket.file(key).delete({ ignoreNotFound: true });
}

export async function streamFromGCS(key: string) {
  return bucket.file(key).createReadStream();
}
```

Always proxy downloads through `server/api/files/[key].get.ts` - never expose raw GCS URLs.
Delete from GCS when the associated DB record is removed.

---

## Optional: PDF Generation — Puppeteer

```ts
// server/services/pdf.service.ts
import puppeteer from "puppeteer";

export async function generatePdf(url: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome-stable",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
    headless: "new",
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    return await page.pdf({ format: "A4", printBackground: true });
  } finally {
    await browser.close();
  }
}
```
