import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
} else {
  if (!(global as typeof globalThis).prisma) {
    (global as typeof globalThis).prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
  prisma = (global as typeof globalThis).prisma!;
}

export default prisma;
