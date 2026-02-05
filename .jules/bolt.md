## 2024-05-24 - Database Aggregation for Stats
**Learning:** Application-side aggregation (fetching all rows + reduce) scales poorly (O(n)). Drizzle ORM's `sql` tag allows powerful DB-side aggregation (O(1) app side) even with multi-driver setups, provided you cast results and handle nulls carefully.
**Action:** Always prefer DB-side aggregation for statistics endpoints. Use `sql<number>` and `coalesce` (or `|| 0`) to ensure type safety across MySQL/SQLite/Postgres.
