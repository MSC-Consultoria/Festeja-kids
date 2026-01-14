## 2024-05-22 - [Batch Query Optimization in tRPC Procedures]
**Learning:** Found significant N+1 query patterns in `server/routers/acompanhamento.ts` where child records (pagamentos) were fetched inside a loop of parent records (festas). Drizzle ORM's `inArray` is effective for batching these.
**Action:** When working with related data in tRPC routers, always prefer fetching IDs first and using `inArray` to fetch related records in a single query, then associating them in memory using a Map. Avoid `await db.select()...` inside `map` or `for` loops.
