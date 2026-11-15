---
'searchkit': patch
---

Fix refining a facet value that starts with `-` returning no hits. InstantSearch escapes a leading `-` as `\-` in `facetFilters`; Searchkit now unescapes it before building the Elasticsearch filter clause.
