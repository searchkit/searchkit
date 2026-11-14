---
'searchkit': patch
---

Declare `@algolia/client-search` as a peer dependency. The published type declarations import `MultipleQueriesQuery` from it, so TypeScript consumers need it installed.
