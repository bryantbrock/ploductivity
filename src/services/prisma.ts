import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient({
      log: [{ emit: "event", level: "query" }],
    });
  }

  prisma = (global as any).prisma;
}

export { prisma };
