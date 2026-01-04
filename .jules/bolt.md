# Bolt's Journal

## 2025-02-27 - tRPC + Drizzle Join Optimization
**Learning:** Backend joins are always faster than Frontend N+1 lookups.
**Action:** When using tRPC, always check if the backend service already returns the joined data (like `clienteNome` in `festas`) before fetching the related entity in the frontend. Often the backend developer has already optimized the query, but the frontend developer missed it.
