# Migração para Supabase

Este guia ajuda a migrar a aplicação para usar Supabase (PostgreSQL).

## Pré-requisitos

1.  Um projeto Supabase criado.
2.  A connection string do banco de dados (Settings -> Database -> Connection string).

## Passos

1.  Atualize o arquivo `.env` com a sua URL do Supabase:
    ```
    DATABASE_URL=postgresql://postgres:senha@db.supabase.co:5432/postgres
    ```

2.  Gere a migração SQL inicial:
    ```bash
    npx drizzle-kit generate --config=drizzle.postgres.config.ts
    ```

3.  Aplique a migração no Supabase:
    ```bash
    npx drizzle-kit migrate --config=drizzle.postgres.config.ts
    ```

    *Nota: Se o Supabase já tiver tabelas e você quiser forçar, verifique a documentação do Drizzle Kit.*

4.  Atualize o código da aplicação:
    *   Substitua o conteúdo de `drizzle/schema.ts` pelo conteúdo de `drizzle/postgres/schema.ts`.
    *   Substitua o conteúdo de `drizzle.config.ts` pelo conteúdo de `drizzle.postgres.config.ts`.
    *   Atualize `server/db.ts` para usar o driver `postgres` ou `pg` em vez de `mysql2`/`better-sqlite3`.

## Exemplo de alteração em `server/db.ts`

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
```
