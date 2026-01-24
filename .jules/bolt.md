# Bolt's Journal

This journal documents critical performance learnings for the Festeja Kids codebase.

## 2024-05-22 - [Optimized Stats Calculation]
**Learning:** Replaced in-memory aggregation of all party records with SQL `count`/`sum` aggregation. This prevents fetching thousands of rows for a simple dashboard widget.
**Action:** Look for similar `getAll` + `filter`/`reduce` patterns in other routers (e.g. `clientes`, `pagamentos`) and move them to DB aggregations.
