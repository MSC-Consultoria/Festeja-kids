# Review da Base de Dados e Plano de Migração para Supabase

## Visão Geral

Atualmente, o projeto utiliza `drizzle-orm` com suporte para MySQL (`mysql-core`). O arquivo de esquema (`drizzle/schema.ts`) define as tabelas usando tipos específicos do MySQL. O objetivo é migrar para o Supabase, que utiliza PostgreSQL.

## Análise do Esquema Atual

O esquema atual (`drizzle/schema.ts`) contém as seguintes tabelas:

1.  **users**: Autenticação e usuários.
2.  **festas**: Principal entidade, armazenando detalhes da festa.
3.  **pagamentos**: Pagamentos vinculados a festas.
4.  **custosVariaveis**: Custos variáveis.
    *   *Ponto de Atenção*: Esta tabela parece ser um catálogo de tipos de custos (tem `percentual` mas não tem `festaId`). Se a intenção é registrar custos incorridos em uma festa específica, falta uma tabela de relacionamento (ex: `festa_custos`) ou uma coluna `festaId` nesta tabela.
5.  **custosFixos**: Custos fixos mensais.
6.  **visitas**: Agendamento de visitas de clientes.

## Plano de Migração para Supabase

### 1. Mudança de Banco de Dados (MySQL -> PostgreSQL)

O Supabase é construído sobre PostgreSQL. A migração exigirá:

*   **Driver**: Substituir `mysql2` por `postgres` (ou `pg`).
*   **ORM**: Substituir `drizzle-orm/mysql-core` por `drizzle-orm/pg-core`.
*   **Tipos de Dados**: Converter os tipos do MySQL para PostgreSQL.

| MySQL (Drizzle) | PostgreSQL (Drizzle) | Notas |
| :--- | :--- | :--- |
| `mysqlTable` | `pgTable` | |
| `int` | `integer` | Para PKs usar `serial` ou `integer().generatedAlwaysAsIdentity()` |
| `varchar` | `varchar` ou `text` | PostgreSQL lida muito bem com `text` |
| `mysqlEnum` | `pgEnum` | `pgEnum` requer criar o tipo enum no banco antes, ou usar check constraints. |
| `timestamp` | `timestamp` | |

### 2. Autenticação

O esquema atual possui uma tabela `users` customizada com `openId` (Manus).
Ao migrar para Supabase, recomenda-se avaliar o uso do **Supabase Auth**.
*   **Opção A (Integrada)**: Usar a tabela `auth.users` do Supabase para login. Criar uma tabela `public.profiles` que referencia `auth.users` para armazenar dados adicionais (como `role`, `name`).
*   **Opção B (Mantida)**: Manter a tabela `users` atual no esquema `public` e gerenciar a autenticação manualmente ou via Manus, apenas trocando o banco subjacente.

### 3. Passos para Migração (Código)

Foi gerado um arquivo `drizzle/schema.postgres.ts` com o esquema convertido para PostgreSQL.

**Para aplicar a migração:**

1.  Instale as dependências: `npm install postgres drizzle-orm` (já incluído no `drizzle-orm` geralmente, mas precisa do driver `postgres` ou `pg`).
2.  Atualize `drizzle.config.ts` para usar o dialeto `postgresql`.
3.  Atualize as importações no seu código para usar o novo esquema.
4.  Execute `drizzle-kit generate` e `drizzle-kit migrate`.

## Pull Request Analysis

Verifiquei os Pull Requests pendentes e não encontrei nenhum comentário ou PR aberto neste ambiente.
Recomendo focar em testes E2E e na validação da migração de dados.

---

### Arquivo de Esquema Sugerido (PostgreSQL)

O arquivo `drizzle/schema.postgres.ts` foi criado no projeto para facilitar a transição.
