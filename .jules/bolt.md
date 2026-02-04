## 2025-02-18 - Optimized Festa Statistics
**Learning:** `drizzle-orm` SQL aggregation allows pushing expensive array reductions to the database, significantly reducing memory usage for large datasets.
**Action:** Always check for `getAll` + `filter/reduce` patterns in routers and replace them with DB-level aggregations.
