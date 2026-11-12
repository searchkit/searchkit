---
"searchkit": patch
---

Fix refining a facet value that starts with `-` returning no hits. InstantSearch sends such values as `\-value`; searchkit now unescapes the leading `\-` before building the Elasticsearch filter and when matching query rule `filterPresent` conditions (#1425)
