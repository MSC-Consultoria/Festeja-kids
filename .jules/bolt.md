# Bolt's Journal

## 2024-05-22 - [Initial Setup]
**Learning:** Initialized Bolt's journal.
**Action:** Always check this file for past learnings.

## 2024-05-22 - [Drizzle Union Type Issues]
**Learning:** `getDb()` returns a union of different adapter types, causing TypeScript to error on `db.select()` with arguments because it can't find a compatible signature for all adapters.
**Action:** Use `(db as any).select(...)` to bypass this when you are sure the method exists on all adapters, or fix the union type definition if possible (out of scope for quick fix).
