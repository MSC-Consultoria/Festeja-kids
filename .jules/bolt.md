## 2024-05-22 - Database Aggregation Optimization
**Learning:** Codebase uses a union type for `getDb` which breaks Drizzle type inference for `select()`, necessitating `(db as any)` casting. Existing patterns use dynamic imports for Drizzle helpers (`desc`, `like`) inside functions.
**Action:** When adding new DB queries, check existing patterns for imports and use explicit casting if strict typing fails due to the adapter union.
