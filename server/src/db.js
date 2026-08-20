import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient across hot reloads to avoid exhausting connections.
export const prisma = globalThis.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
