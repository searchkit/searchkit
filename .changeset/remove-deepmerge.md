---
'searchkit': patch
---

Remove the `deepmerge` dependency. Facet aggregations are now merged with a small internal helper that skips prototype-polluting keys, so searchkit no longer pulls in `deepmerge@4.3.1`, which security scanners flagged for GHSA-gcqx-w48m-w2h4 (#1422)
