import { PrismaClient } from "@prisma/client";

declare global {
  var cachedPrisma: PrismaClient | undefined;
}

const db = globalThis.cachedPrisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.cachedPrisma = db;
}

export { db };
