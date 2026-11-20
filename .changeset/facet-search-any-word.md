---
'searchkit': patch
---

Facet search now matches the start of any word, whatever comes before it. The terms aggregation `include` only allowed plain ASCII-letter words before the match, so `Pedro` did not find `Mendoza, Pedro`, and `Hans` did not find `Müller, Hans`. Words after a comma, an apostrophe, a digit, a non-ASCII letter or a double space are now found too (#1417)
