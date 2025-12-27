import { pgTable, serial, varchar, text, timestamp, integer, pgEnum, boolean } from "drizzle-orm/pg-core";

/**
 * Schema PostgreSQL para Supabase
 * 
 * Este arquivo contém o schema otimizado para PostgreSQL/Supabase.
 * Use este schema ao fazer deploy na Supabase.
 * 
 * IMPORTANTE: Este é um schema de referência. Você precisará adaptar
 * conforme suas necessidades específicas.
 */

// Definir enums PostgreSQL
export const roleEnum = pgEnum('role', ['user', 'admin']);
export const statusFestaEnum = pgEnum('status_festa', ['agendada', 'realizada', 'cancelada']);
export const statusVisitaEnum = pgEnum('status_visita', ['agendada', 'realizada', 'cancelada', 'noshow']);

/**
 * Tabela de usuários
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default('user').notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de clientes
 */
export const clientes = pgTable("clientes", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  endereco: text("endereco"),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = typeof clientes.$inferInsert;

/**
 * Tabela de festas
 */
export const festas = pgTable("festas", {
  id: serial("id").primaryKey(),
  codigo: varchar("codigo", { length: 20 }).notNull().unique(),
  clienteId: integer("clienteId").notNull().references(() => clientes.id),
  dataFechamento: timestamp("dataFechamento", { withTimezone: true }).notNull(),
  dataFesta: timestamp("dataFesta", { withTimezone: true }).notNull(),
  valorTotal: integer("valorTotal").notNull(), // em centavos
  valorPago: integer("valorPago").default(0).notNull(), // em centavos
  numeroConvidados: integer("numeroConvidados").notNull(),
  tema: varchar("tema", { length: 255 }),
  horario: varchar("horario", { length: 50 }),
  status: statusFestaEnum("status").default('agendada').notNull(),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export type Festa = typeof festas.$inferSelect;
export type InsertFesta = typeof festas.$inferInsert;

/**
 * Tabela de pagamentos
 */
export const pagamentos = pgTable("pagamentos", {
  id: serial("id").primaryKey(),
  festaId: integer("festaId").notNull().references(() => festas.id),
  valor: integer("valor").notNull(), // em centavos
  dataPagamento: timestamp("dataPagamento", { withTimezone: true }).notNull(),
  metodoPagamento: varchar("metodoPagamento", { length: 50 }),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
});

export type Pagamento = typeof pagamentos.$inferSelect;
export type InsertPagamento = typeof pagamentos.$inferInsert;

/**
 * Tabela de custos variáveis (por festa)
 */
export const custosVariaveis = pgTable("custosVariaveis", {
  id: serial("id").primaryKey(),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  valor: integer("valor").notNull(), // em centavos
  percentual: integer("percentual").default(0), // percentual do valor da festa (0-100)
  ativo: boolean("ativo").default(true).notNull(),
  ordem: integer("ordem").default(0).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export type CustoVariavel = typeof custosVariaveis.$inferSelect;
export type InsertCustoVariavel = typeof custosVariaveis.$inferInsert;

/**
 * Tabela de custos fixos mensais
 */
export const custosFixos = pgTable("custosFixos", {
  id: serial("id").primaryKey(),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  valor: integer("valor").notNull(), // em centavos
  mesReferencia: timestamp("mesReferencia", { withTimezone: true }).notNull(), // mês de referência do custo
  ativo: boolean("ativo").default(true).notNull(),
  ordem: integer("ordem").default(0).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export type CustoFixo = typeof custosFixos.$inferSelect;
export type InsertCustoFixo = typeof custosFixos.$inferInsert;

/**
 * Tabela de agendamento de visitas
 */
export const visitas = pgTable("visitas", {
  id: serial("id").primaryKey(),
  clienteNome: varchar("clienteNome", { length: 255 }).notNull(),
  clienteTelefone: varchar("clienteTelefone", { length: 20 }).notNull(),
  dataAgendamento: timestamp("dataAgendamento", { withTimezone: true }).notNull(),
  tipoEvento: varchar("tipoEvento", { length: 100 }), // Ex: Aniversário 1 ano, Casamento
  status: statusVisitaEnum("status").default('agendada').notNull(),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export type Visita = typeof visitas.$inferSelect;
export type InsertVisita = typeof visitas.$inferInsert;
