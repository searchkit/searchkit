---
'searchkit': patch
'@searchkit/api': patch
---

Fix TypeScript errors when `@elastic/elasticsearch` is not installed, or is a version whose package `exports` hide `lib/api/types` (e.g. the latest 8.x). Searchkit only uses the Elasticsearch client for types, so the types it uses are now included in its own declarations instead of being imported from `@elastic/elasticsearch`. Nothing extra needs to be installed, and Elasticsearch 8.x and 9.x clients both work alongside it.
