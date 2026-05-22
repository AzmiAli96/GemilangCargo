import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
// import { Pool } from "pg";

// ✅ DEBUG ENV
console.log("DATABASE_URL:", process.env.DATABASE_URL);

// ❗ pastikan tidak undefined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});


// ✅ Prisma adapter
export const prisma = new PrismaClient({ adapter });


// ✅ Test query awal (opsional tapi sangat membantu debug)
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected to database");
  } catch (error: any) {
    console.error("❌ Prisma connection error:", error.message);
  }
})();

export default prisma;