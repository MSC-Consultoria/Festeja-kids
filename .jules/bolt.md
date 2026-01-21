## 2024-05-22 - [Optimizing Agenda Load Time]
**Learning:** `better-sqlite3` binding issues in this environment prevent running integration tests that depend on a live DB. Mocks are essential.
**Action:** When verifying backend changes, rely on type checking (`pnpm check`) and mocked tests, or manual code review if mocks are complex to set up for existing legacy code.
