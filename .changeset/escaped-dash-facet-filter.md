---
'searchkit': patch
---

author: @trackoor
author: @bardrop

Fix refining a facet value that starts with `-` returning no hits ([#1425](https://github.com/searchkit/searchkit/issues/1425), reported by @trackoor, with a fix proposed by @bardrop in [#1437](https://github.com/searchkit/searchkit/pull/1437)). InstantSearch escapes a leading `-` as `\-` in `facetFilters`; Searchkit now unescapes it before building the Elasticsearch filter clause.
