## 2024-05-23 - Database Adapter Union Types
**Learning:** The `getDb` function returns a union of Drizzle adapter types (MySQL, SQLite, Postgres). This causes TypeScript errors like "This expression is not callable" when invoking `db.select()` because the signatures don't perfectly overlap in a way TS likes.
**Action:** When performing complex queries or using `db` in a way that triggers this, cast `db` to `any` (e.g., `(db as any).select(...)`) to bypass the strict signature check, but ensure to explicitly type the return or rely on inference if safe.
