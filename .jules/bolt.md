## 2024-05-22 - Database Aggregation Optimization
**Learning:** Drizzle ORM's `sql` template tag is crucial for performing aggregations (COUNT, SUM) across different database adapters (MySQL, SQLite, Postgres) when a unified adapter type is not available.
**Action:** Use `sql<number>` combined with `coalesce` to safely retrieve aggregate stats directly from the DB, replacing in-memory loops.
