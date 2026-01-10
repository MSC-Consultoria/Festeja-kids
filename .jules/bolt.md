## 2024-05-23 - Fetch All Anti-Pattern in Agenda
**Learning:** The `Agenda.tsx` component was using `trpc.festas.list.useQuery()` which calls `getAllFestas()`. This fetches the entire database table of parties every time the agenda loads, which is a massive scalability bottleneck.
**Action:** Always check `useQuery` calls in list/calendar views to ensure they are paginated or filtered by date range. Replaced with `byDateRange` query.

## 2024-05-23 - Drizzle ORM Type Union Issues
**Learning:** `server/db.ts` exports a `getDb` function that returns a union of different Drizzle adapter types (MySQL, SQLite, Postgres). This causes widespread TypeScript errors (`This expression is not callable`) when using `db.select()` because the method signatures don't perfectly overlap in the union.
**Action:** Be aware that type checking in `server/db.ts` is currently compromised. Trust the runtime behavior and existing patterns (like `getAllFestas`) over the strict type checker in this file until the union type is properly handled or discouraged.
