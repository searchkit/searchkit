---
"searchkit": patch
---

Escape facet search queries properly. Lucene regex operators (`& # @ ~ < > "`) are now escaped in the terms aggregation `include`, so queries like `R&B`, `C#` or `<tag>` find their values instead of matching nothing or failing with HTTP 400. Facet hit highlighting also treats the query as plain text, so `C++` or `Rock (` no longer throw (#1423, #1424)
