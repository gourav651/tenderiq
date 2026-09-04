import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined;
};

function getDirectConnectionString(): string | undefined {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) return undefined;

  if (rawUrl.startsWith("prisma+postgres://")) {
    try {
      const urlObj = new URL(rawUrl);
      const apiKey = urlObj.searchParams.get("api_key");
      if (apiKey) {
        const decoded = JSON.parse(Buffer.from(apiKey, "base64").toString("utf-8"));
        if (decoded.databaseUrl) {
          return decoded.databaseUrl;
        }
      }
    } catch (err) {
      console.warn("Failed to parse base64 api_key from prisma+postgres URL", err);
    }
  }

  return rawUrl;
}

const connectionString = getDirectConnectionString();

const pool =
  globalForPrisma.pool ??
  new pg.Pool({
    connectionString,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
