import * as mysqlSchema from "../drizzle/schema";
import * as pgSchema from "../drizzle/schema-postgres";

const connectionString = process.env.DATABASE_URL ?? "";

export const isSQLite = connectionString.startsWith("file:");
export const isPostgres =
  connectionString.startsWith("postgres://") ||
  connectionString.startsWith("postgresql://");
export const isMySQL = !isSQLite && !isPostgres;

const schema = isPostgres ? pgSchema : mysqlSchema;

export const users = schema.users;
export const clientes = schema.clientes;
export const festas = schema.festas;
export const pagamentos = schema.pagamentos;
export const custosVariaveis = schema.custosVariaveis;
export const custosFixos = schema.custosFixos;
export const visitas = schema.visitas;

export type InsertUser = mysqlSchema.InsertUser | pgSchema.InsertUser;
export type InsertCliente = mysqlSchema.InsertCliente | pgSchema.InsertCliente;
export type InsertFesta = mysqlSchema.InsertFesta | pgSchema.InsertFesta;
export type InsertPagamento = mysqlSchema.InsertPagamento | pgSchema.InsertPagamento;
export type InsertCustoVariavel =
  | mysqlSchema.InsertCustoVariavel
  | pgSchema.InsertCustoVariavel;
export type InsertCustoFixo = mysqlSchema.InsertCustoFixo | pgSchema.InsertCustoFixo;
