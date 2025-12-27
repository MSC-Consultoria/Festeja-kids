import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

// Detectar o tipo de banco de dados
const isSQLite = connectionString.startsWith('file:');
const isPostgres = connectionString.startsWith('postgres://') || connectionString.startsWith('postgresql://');

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: isSQLite ? "sqlite" : isPostgres ? "postgresql" : "mysql",
  dbCredentials: isSQLite
    ? { url: connectionString.replace('file:', '') }
    : { url: connectionString },
});
