import path from "path";
import fs from "fs/promises";
import { PrismaClient, Prisma } from "@prisma/client";
import { registerUser } from "./modules/auth/auth.service";

const prisma = new PrismaClient();

const dataDir = path.resolve(__dirname, "../data");

async function loadJson<T>(fileName: string): Promise<T> {
  const filePath = path.join(dataDir, fileName);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

async function seedAuthors() {
  const authors = await loadJson<Prisma.authorsCreateManyInput[]>("authors.json");
  console.log(`Seeding authors (${authors.length})...`);
  try {
    await prisma.authors.createMany({ data: authors });
  } catch (err) {
    console.log("Authors seeding skipped due to existing records or unique constraints.");
  }
  console.log("Authors seeded.");
}

async function seedPublishers() {
  const publishers = await loadJson<Prisma.publishersCreateManyInput[]>("publishers.json");
  console.log(`Seeding publishers (${publishers.length})...`);
  try {
    await prisma.publishers.createMany({ data: publishers });
  } catch (err) {
    console.log("Publishers seeding skipped due to existing records or unique constraints.");
  }
  console.log("Publishers seeded.");
}

async function seedBooks() {
  const books = await loadJson<Prisma.booksCreateManyInput[]>("books.json");
  console.log(`Seeding books (${books.length})...`);
  try {
    await prisma.books.createMany({ data: books });
  } catch (err) {
    console.log("Books seeding skipped due to existing records or unique constraints.");
  }
  console.log("Books seeded.");
}

async function seedAdminUser() {
  const adminEmail = process.env.ADMIN_EMAILS?.split(",")[0]?.trim();
  if (!adminEmail) {
    console.log("Skipping admin user seeding (ADMIN_EMAILS not set).");
    return;
  }

  const password = process.env.ADMIN_PASSWORD || "password";
  const existing = await prisma.users.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log(`Admin user already exists: ${adminEmail}`);
    return;
  }

  console.log(`Creating admin user: ${adminEmail}`);
  await registerUser({ email: adminEmail, password });
  console.log("Admin user created.");
}

async function main() {
  console.log("Starting seed...");
  // Ensure the database schema is ready (recommended to run `prisma db push` first)
  await seedAuthors();
  await seedPublishers();
  await seedBooks();
  await seedAdminUser();
  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
