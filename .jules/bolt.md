## 2024-05-23 - [Optimize Stats Aggregation]
**Learning:** Fetching all records to calculate statistics in memory (N+1 payload) is a major bottleneck. Drizzle's `sql` tag allows powerful in-database aggregation even with adapter unions, but requires explicit casting and careful handling of driver-specific return types (e.g., strings vs numbers for counts).
**Action:** Always prefer `db.select({ count: sql<number>\`count(*)\` }).from(...)` over `db.select().from(...)` followed by `.length`. Use `(db as any)` with explicit return type casting when Drizzle's adapter union prevents TS inference.
