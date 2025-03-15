# searchkit

## 4.14.0

### Minor Changes

- Updated filter splitter and error handling

## 4.13.3

### Patch Changes

- Support colons in facet values

## 4.13.2

### Patch Changes

- a7dc41b7: switch back to content-type application/json

## 4.13.1

### Patch Changes

- support highlighting for nested fields

## 4.13.0

### Minor Changes

- update the content type to ndjson

## 4.12.0

### Minor Changes

- 130e35b1: Add score and add facetResponse function to handle custom facets

## 4.11.2

### Patch Changes

- 11e682fc: Support for decimal numeric filters
- acd9100b: add withCredentials to network connection options

## 4.11.1

### Patch Changes

- 77133782: fix bug with object field highlighting

## 4.11.0

### Minor Changes

- a6218b4b: Runtime fields support

## 4.10.2

### Patch Changes

- 12fffdd8: Cloud id support

## 4.10.1

### Patch Changes

- fix issue where rank is provided when no query

## 4.10.0

### Minor Changes

- 5f05c01a: Do not send highlight options when not detected + use RRF when hybrid search detected

## 4.9.0

### Minor Changes

- e7e61f13: Added \_index attribute to hit

## 4.8.0

### Minor Changes

- 8a2b6ef5: include filters into the KNN search. If query is not present do not use KNN, specify a match_all query to bring back all results. If a filter is selected and no query, rely on query attribute still

## 4.7.2

### Patch Changes

- 3c122925: fix issue with singular facet

## 4.7.1

### Patch Changes

- support for more complex Highlight attribute names

## 4.7.0

### Minor Changes

- a9e75df8: Added 1st class support for KNN search

## 4.6.2

### Patch Changes

- 2af53203: Fix support for negative numbers

## 4.6.1

### Patch Changes

- f781023a: fix custom snippet length

## 4.6.0

### Minor Changes

- 66980d07: Custom snippet length support

## 4.5.0

### Minor Changes

- 6ef6705e: Support for filters to be used with analyzed fields
- 6ef6705e: Added support for custom facets and filter queries

## 4.4.3

### Patch Changes

- publish in case

## 4.4.2

### Patch Changes

- 3943ea60: Better error messaging for auth issues

## 4.4.1

### Patch Changes

- 36af10f5: Fix issue with using auth on the browser

## 4.4.0

### Minor Changes

- c1325587: Update ESM package exports

## 4.3.0

### Minor Changes

- Connection Basic auth support + errors in console

## 4.2.1

### Patch Changes

- 80328bee: Add better error handling when elasticsearch has an exception

## 4.2.0

### Minor Changes

- 4221160a: nested filter support for inner_hits + better grouping of range filters
- 933926dd: Expanded support for geolocation field types

## 4.1.0

### Minor Changes

- 031f790f: Geo Filtering capability

## 4.0.4

### Patch Changes

- 3484bd44: Fix nested facet query

## 4.0.3

### Patch Changes

- Security dependency updates

## 4.0.2

### Patch Changes

- 303d245a: Fix highlighting when field isn't present in source

## 4.0.1

### Patch Changes

- Fix umd publishing
