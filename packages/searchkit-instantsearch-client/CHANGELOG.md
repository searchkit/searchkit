# @searchkit/api

## 4.11.0

### Minor Changes

- a6218b4b: Runtime fields support

### Patch Changes

- Updated dependencies [a6218b4b]
  - searchkit@4.11.0

## 4.10.1

### Patch Changes

- fix issue where rank is provided when no query
- Updated dependencies
  - searchkit@4.10.1

## 4.10.0

### Minor Changes

- 5f05c01a: Do not send highlight options when not detected + use RRF when hybrid search detected

### Patch Changes

- Updated dependencies [5f05c01a]
  - searchkit@4.10.0

## 4.9.0

### Minor Changes

- e7e61f13: Added \_index attribute to hit

### Patch Changes

- Updated dependencies [e7e61f13]
  - searchkit@4.9.0

## 4.8.0

### Minor Changes

- 8a2b6ef5: include filters into the KNN search. If query is not present do not use KNN, specify a match_all query to bring back all results. If a filter is selected and no query, rely on query attribute still

### Patch Changes

- Updated dependencies [8a2b6ef5]
  - searchkit@4.8.0

## 4.7.3

### Patch Changes

- 3c122925: fix issue with singular facet
- Updated dependencies [3c122925]
  - searchkit@4.7.2

## 4.7.2

### Patch Changes

- support for more complex Highlight attribute names
- Updated dependencies
  - searchkit@4.7.1

## 4.7.1

### Patch Changes

- c494ce2b: Fix client support

## 4.7.0

### Minor Changes

- a9e75df8: Added 1st class support for KNN search

### Patch Changes

- Updated dependencies [a9e75df8]
  - searchkit@4.7.0

## 4.6.2

### Patch Changes

- 2af53203: Fix support for negative numbers
- Updated dependencies [2af53203]
  - searchkit@4.6.2

## 4.6.1

### Patch Changes

- f781023a: fix custom snippet length
- Updated dependencies [f781023a]
  - searchkit@4.6.1

## 4.6.0

### Minor Changes

- 66980d07: Custom snippet length support

### Patch Changes

- Updated dependencies [66980d07]
  - searchkit@4.6.0

## 4.5.0

### Minor Changes

- 6ef6705e: Support for filters to be used with analyzed fields
- 6ef6705e: Added support for custom facets and filter queries

### Patch Changes

- Updated dependencies [6ef6705e]
- Updated dependencies [6ef6705e]
  - searchkit@4.5.0

## 4.4.3

### Patch Changes

- publish in case
- Updated dependencies
  - searchkit@4.4.3

## 4.4.2

### Patch Changes

- 3943ea60: Better error messaging for auth issues
- Updated dependencies [3943ea60]
  - searchkit@4.4.2

## 4.4.1

### Patch Changes

- 36af10f5: Fix issue with using auth on the browser
- Updated dependencies [36af10f5]
  - searchkit@4.4.1

## 4.4.0

### Minor Changes

- c1325587: Update ESM package exports

### Patch Changes

- Updated dependencies [c1325587]
  - searchkit@4.4.0

## 4.3.0

### Minor Changes

- Connection Basic auth support + errors in console

### Patch Changes

- Updated dependencies
  - searchkit@4.3.0

## 4.2.1

### Patch Changes

- 80328bee: Add better error handling when elasticsearch has an exception
- Updated dependencies [80328bee]
  - searchkit@4.2.1

## 4.2.0

### Minor Changes

- 4221160a: nested filter support for inner_hits + better grouping of range filters
- 933926dd: Expanded support for geolocation field types
- 507d94d3: support for request options

### Patch Changes

- Updated dependencies [4221160a]
- Updated dependencies [933926dd]
  - searchkit@4.2.0

## 4.1.4

### Patch Changes

- 75afdc28: Added a primitive client caching mechanism

## 4.1.3

### Patch Changes

- 3484bd44: Fix nested facet query
- Updated dependencies [3484bd44]
  - searchkit@4.0.4

## 4.1.2

### Patch Changes

- Security dependency updates
- Updated dependencies
  - searchkit@4.0.3

## 4.1.1

### Patch Changes

- cdd27496: Fix facet values search when using browser only

## 4.1.0

### Minor Changes

- ed51794a: Support for browser only use-case

## 4.0.0

### Major Changes

- b1a0cde9: First Release

### Patch Changes

- 99d38964: fix build issue
- ba99ac83: Update export for jsdelivr and unpkg

## 4.0.0-next.2

### Patch Changes

- fix build issue

## 4.0.0-next.1

### Patch Changes

- ba99ac83: Update export for jsdelivr and unpkg

## 5.0.0-next.0

### Major Changes

- First Release

## 1.3.0

### Minor Changes

- 3c724ff: support custom http headers

## 1.2.0

### Minor Changes

- Fix umd issue with export needing default fn

## 1.1.1

### Patch Changes

- Add content-type header to api request

## 1.1.0

### Minor Changes

- cleanup

## 1.0.0

### Major Changes

- d5ee3af: First release of instantsearch elasticsearch adapter
