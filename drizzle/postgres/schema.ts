import { pgTable, serial, text, integer, timestamp, varchar, boolean, pgEnum } from "drizzle-orm/pg-core";

// Enums precisam ser declarados no Postgres se quiser usar tipos nativos,
// ou pode-se usar text com check constraints. Aqui usaremos pgEnum para fidelidade.
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const festaStatusEnum = pgEnum("festa_status", ["agendada", "realizada", "cancelada"]);
export const visitaStatusEnum = pgEnum("visita_status", ["agendada", "realizada", "cancelada", "noshow"]);

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(), // onUpdateNow não existe nativamente no pg-core da mesma forma, gerido via trigger ou app
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de clientes
 */
export const clientes = pgTable("clientes", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  dataNascimento: timestamp("dataNascimento"),
  endereco: text("endereco"),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = typeof clientes.$inferInsert;

/**
 * Tabela de festas
 */
export const festas = pgTable("festas", {
  id: serial("id").primaryKey(),
  codigo: varchar("codigo", { length: 20 }).notNull().unique(),
  clienteId: integer("clienteId").notNull(),
  dataFechamento: timestamp("dataFechamento").notNull(),
  dataFesta: timestamp("dataFesta").notNull(),
  valorTotal: integer("valorTotal").notNull(), // em centavos
  valorPago: integer("valorPago").default(0).notNull(), // em centavos
  numeroConvidados: integer("numeroConvidados").notNull(),
  tema: varchar("tema", { length: 255 }),
  horario: varchar("horario", { length: 50 }),
  status: festaStatusEnum("status").default("agendada").notNull(),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Festa = typeof festas.$inferSelect;
export type InsertFesta = typeof festas.$inferInsert;

/**
 * Tabela de pagamentos
 */
export const pagamentos = pgTable("pagamentos", {
  id: serial("id").primaryKey(),
  festaId: integer("festaId").notNull(),
  valor: integer("valor").notNull(), // em centavos
  dataPagamento: timestamp("dataPagamento").notNull(),
  metodoPagamento: varchar("metodoPagamento", { length: 50 }),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
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
  ativo: integer("ativo").default(1).notNull(), // Mantendo integer para compatibilidade ou usar boolean
  ordem: integer("ordem").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
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
  mesReferencia: timestamp("mesReferencia").notNull(), // mês de referência do custo
  ativo: integer("ativo").default(1).notNull(),
  ordem: integer("ordem").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
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
  dataAgendamento: timestamp("dataAgendamento").notNull(),
  tipoEvento: varchar("tipoEvento", { length: 100 }),
  status: visitaStatusEnum("status").default("agendada").notNull(),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Visita = typeof visitas.$inferSelect;
export type InsertVisita = typeof visitas.$inferInsert;
