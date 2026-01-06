# Bolt's Journal

## 2024-05-22 - [Redundant N+1 Query on Frontend]
**Learning:** Found a classic N+1 query pattern where the frontend was fetching the entire `clientes` list just to resolve client names for a list of `festas`, even though the backend was already performing a JOIN and returning `clienteNome`. This highlights the importance of checking what the backend *actually* returns before fetching auxiliary data on the frontend.
**Action:** Always inspect the backend response type/schema before adding secondary queries to resolving relationships on the frontend.
