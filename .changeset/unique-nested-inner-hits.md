---
'searchkit': patch
---

Give each nested filter its own `inner_hits` name. Refining two facets on the same nested path (or a nested facet and a nested numeric filter) made Elasticsearch fail with `[inner_hits] already contains an entry for key [path]`. The first clause keeps the default name (the path); the others are named `path_2`, `path_3`, ... (#1376)
