import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

// Detectar o tipo de banco de dados
const isSQLite = connectionString.startsWith('file:');
const isPostgres = connectionString.startsWith('postgres://') || connectionString.startsWith('postgresql://');
const schemaPath = isPostgres ? "./drizzle/schema-postgres.ts" : "./drizzle/schema.ts";

export default defineConfig({
  schema: schemaPath,
  out: "./drizzle",
  dialect: isSQLite ? "sqlite" : isPostgres ? "postgresql" : "mysql",
  dbCredentials: isSQLite
    ? { url: connectionString.replace('file:', '') }
    : { url: connectionString },
});
