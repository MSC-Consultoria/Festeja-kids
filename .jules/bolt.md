## 2025-05-21 - [Testing Drizzle with Broken Native Bindings]
**Learning:** When the local environment cannot build native bindings for `better-sqlite3`, unit tests for database logic become impossible to run using the real driver.
**Action:** Use `vi.mock("better-sqlite3")` and `vi.mock("drizzle-orm/better-sqlite3")` to mock the driver and ORM factory. This allows verifying the transformation logic (processing `sql` results) without needing a functioning native database driver.
