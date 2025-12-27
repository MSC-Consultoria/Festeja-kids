# 📘 Guia de Migração: MySQL → PostgreSQL (Supabase)

Este documento detalha o processo de migração do schema MySQL atual para PostgreSQL compatível com Supabase.

## 🔍 Diferenças Principais

### Tipos de Dados

| MySQL | PostgreSQL | Observação |
|-------|------------|------------|
| `int` | `integer` ou `serial` | `serial` para auto-increment |
| `varchar(n)` | `varchar(n)` | Mesmo comportamento |
| `text` | `text` | Mesmo comportamento |
| `timestamp` | `timestamp` | Adicionar `withTimezone: true` |
| `mysqlEnum` | `pgEnum` | Definir enum separadamente |
| `int(1)` (boolean) | `boolean` | Tipo nativo no PostgreSQL |

### Auto-increment

**MySQL:**
```typescript
id: int("id").autoincrement().primaryKey()
```

**PostgreSQL:**
```typescript
id: serial("id").primaryKey()
```

### Enums

**MySQL:**
```typescript
status: mysqlEnum("status", ["agendada", "realizada", "cancelada"])
```

**PostgreSQL:**
```typescript
// Primeiro, definir o enum
export const statusFestaEnum = pgEnum('status_festa', ['agendada', 'realizada', 'cancelada']);

// Depois, usar na tabela
status: statusFestaEnum("status").default('agendada')
```

### Boolean

**MySQL:**
```typescript
ativo: int("ativo").default(1).notNull() // 0 ou 1
```

**PostgreSQL:**
```typescript
ativo: boolean("ativo").default(true).notNull()
```

### Timestamps

**MySQL:**
```typescript
createdAt: timestamp("createdAt").defaultNow().notNull(),
updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
```

**PostgreSQL:**
```typescript
createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull()
```

> ⚠️ **Nota:** PostgreSQL não tem `.onUpdateNow()`. Use triggers ou gerencie via aplicação.

### Foreign Keys

**MySQL:**
```typescript
clienteId: int("clienteId").notNull()
```

**PostgreSQL:**
```typescript
clienteId: integer("clienteId").notNull().references(() => clientes.id)
```

## 🛠️ Processo de Migração

### Opção 1: Migração Automática (Recomendada)

1. **Backup do banco atual:**
```bash
# MySQL
mysqldump -u root -p festeja_kids > backup_mysql.sql

# SQLite
sqlite3 festeja_kids.db .dump > backup_sqlite.sql
```

2. **Atualizar drizzle.config.ts:**
```typescript
export default defineConfig({
  schema: "./drizzle/schema-postgres.ts", // Usar schema PostgreSQL
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL // Connection string Supabase
  },
});
```

3. **Atualizar imports no código:**

Em todos os arquivos que importam de `schema.ts`, atualize para `schema-postgres.ts`:

```typescript
// Antes
import { users, festas } from "../drizzle/schema";

// Depois
import { users, festas } from "../drizzle/schema-postgres";
```

4. **Gerar e aplicar migrações:**
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### Opção 2: Migração Manual

1. **Copiar schema-postgres.ts como schema.ts:**
```bash
cp drizzle/schema-postgres.ts drizzle/schema.ts
```

2. **Revisar e ajustar tipos manualmente**

3. **Aplicar migrações**

### Opção 3: SQL Direto no Supabase

Execute o SQL diretamente no SQL Editor do Supabase:

```sql
-- Criar enums
CREATE TYPE role AS ENUM ('user', 'admin');
CREATE TYPE status_festa AS ENUM ('agendada', 'realizada', 'cancelada');
CREATE TYPE status_visita AS ENUM ('agendada', 'realizada', 'cancelada', 'noshow');

-- Criar tabela users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  "openId" VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  "loginMethod" VARCHAR(64),
  role role DEFAULT 'user' NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "lastSignedIn" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Criar tabela clientes
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(320),
  endereco TEXT,
  observacoes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Criar tabela festas
CREATE TABLE festas (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  "clienteId" INTEGER NOT NULL REFERENCES clientes(id),
  "dataFechamento" TIMESTAMP WITH TIME ZONE NOT NULL,
  "dataFesta" TIMESTAMP WITH TIME ZONE NOT NULL,
  "valorTotal" INTEGER NOT NULL,
  "valorPago" INTEGER DEFAULT 0 NOT NULL,
  "numeroConvidados" INTEGER NOT NULL,
  tema VARCHAR(255),
  horario VARCHAR(50),
  status status_festa DEFAULT 'agendada' NOT NULL,
  observacoes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Criar tabela pagamentos
CREATE TABLE pagamentos (
  id SERIAL PRIMARY KEY,
  "festaId" INTEGER NOT NULL REFERENCES festas(id),
  valor INTEGER NOT NULL,
  "dataPagamento" TIMESTAMP WITH TIME ZONE NOT NULL,
  "metodoPagamento" VARCHAR(50),
  observacoes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Criar tabela custosVariaveis
CREATE TABLE "custosVariaveis" (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  valor INTEGER NOT NULL,
  percentual INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE NOT NULL,
  ordem INTEGER DEFAULT 0 NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Criar tabela custosFixos
CREATE TABLE "custosFixos" (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  valor INTEGER NOT NULL,
  "mesReferencia" TIMESTAMP WITH TIME ZONE NOT NULL,
  ativo BOOLEAN DEFAULT TRUE NOT NULL,
  ordem INTEGER DEFAULT 0 NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Criar tabela visitas
CREATE TABLE visitas (
  id SERIAL PRIMARY KEY,
  "clienteNome" VARCHAR(255) NOT NULL,
  "clienteTelefone" VARCHAR(20) NOT NULL,
  "dataAgendamento" TIMESTAMP WITH TIME ZONE NOT NULL,
  "tipoEvento" VARCHAR(100),
  status status_visita DEFAULT 'agendada' NOT NULL,
  observacoes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Criar índices para performance
CREATE INDEX idx_festas_cliente ON festas("clienteId");
CREATE INDEX idx_festas_data ON festas("dataFesta");
CREATE INDEX idx_festas_status ON festas(status);
CREATE INDEX idx_pagamentos_festa ON pagamentos("festaId");

-- Trigger para updatedAt automático (substitui onUpdateNow)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_festas_updated_at BEFORE UPDATE ON festas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custosVariaveis_updated_at BEFORE UPDATE ON "custosVariaveis"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custosFixos_updated_at BEFORE UPDATE ON "custosFixos"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visitas_updated_at BEFORE UPDATE ON visitas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 📊 Migração de Dados

### Exportar do MySQL

```bash
# Exportar apenas dados (sem estrutura)
mysqldump -u root -p --no-create-info --skip-triggers festeja_kids > data_only.sql

# Ou usar JSON via script
node scripts/export-data.mjs
```

### Importar para PostgreSQL

```bash
# Se tiver dump SQL (ajustar sintaxe antes)
psql $DATABASE_URL < data_adjusted.sql

# Ou usar script de importação
node scripts/import-complete.mjs
```

## 🔍 Validação Pós-Migração

Execute o script de validação:

```bash
node scripts/validate-supabase.mjs
```

Verifique:
- ✅ Todas as tabelas criadas
- ✅ Contagem de registros bate
- ✅ Foreign keys funcionando
- ✅ Índices criados
- ✅ Triggers de updatedAt funcionando

## 🐛 Problemas Comuns

### Erro: "column does not exist"

**Causa:** CamelCase não preservado

**Solução:** Use aspas duplas em SQL:
```sql
SELECT "clienteId" FROM festas; -- Correto
SELECT clienteId FROM festas;   -- Erro (converte para clienteid)
```

### Erro: "type does not exist"

**Causa:** Enum não criado

**Solução:** Criar enum antes:
```sql
CREATE TYPE status_festa AS ENUM ('agendada', 'realizada', 'cancelada');
```

### Erro: "foreign key constraint"

**Causa:** Dados órfãos (sem referência)

**Solução:** Limpar dados órfãos antes:
```sql
DELETE FROM festas WHERE "clienteId" NOT IN (SELECT id FROM clientes);
```

## 📚 Recursos

- [Drizzle PostgreSQL Docs](https://orm.drizzle.team/docs/get-started-postgresql)
- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)

---

**Boa sorte com a migração! 🚀**
