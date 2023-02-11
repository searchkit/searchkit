# @searchkit/api

## 4.2.0

### Minor Changes

- 4221160a: nested filter support for inner_hits + better grouping of range filters
- 933926dd: Expanded support for geolocation field types

### Patch Changes

- Updated dependencies [4221160a]
- Updated dependencies [933926dd]
  - searchkit@4.2.0

## 4.1.0

### Minor Changes

- 031f790f: Geo Filtering capability

### Patch Changes

- Updated dependencies [031f790f]
  - searchkit@4.1.0

## 4.0.4

### Patch Changes

- bump dependency

## 4.0.3

### Patch Changes

- bump searchkit dependency

## 4.0.2

### Patch Changes

- Security dependency updates
- Updated dependencies
  - searchkit@4.0.3

## 4.0.1

### Patch Changes

- 6f0b8c97: remove querystring dependency

## 4.0.0

### Major Changes

- b1a0cde9: First Release

### Minor Changes

- a11ce94f: Only wrap Elasticsearch query when query rule actions are present
- ee857da0: Add sorting support
- a0e24e7e: return appliedRules in search response
- 6b364816: query rules: query rewrite fix
- 13d6655e: Adjust the default query relevance handler to include prefix
- 90b72ac1: fix issue with facet filters
- d760fb7a: Highlight & snippets support
- 5c2c77d4: Support debug mode to emit the elasticsearch query + transporter to handle errors gracefully
- 22a91911: Fix issue where facet requests returned hits
- 1fd1706c: Add QueryFilter and QueryBoost actions
- 41716dd2: Query rules support for facet rendering / ordering + custom data
- Pulling out searchkit from the API package, for future browser intentions
- 8329b682: Support nested fields for filters and facets
- e3770fba: Introduce id into query rule
- 2c4748df: Custom headers support for elasticsearch connection
- 37c72f78: support nested fields for numeric filters

### Patch Changes

- 799be8e0: Fix issue when facets have multiple nested attributes that have the same nested path
- e9dfa3d4: More advanced filter support
- 21297f17: update transporter to fix issue with single bad reequest
- 9145077a: Additional Query rule conditions and actions
- 0d970a91: Add beforeSearch & afterSearch hook to transform requests
- Updated dependencies
  - searchkit@4.0.0

## 4.0.0-next.16

### Minor Changes

- ee857da0: Add sorting support

## 4.0.0-next.15

### Minor Changes

- d760fb7a: Highlight & snippets support

## 4.0.0-next.14

### Minor Changes

- a0e24e7e: return appliedRules in search response
- 13d6655e: Adjust the default query relevance handler to include prefix
- 1fd1706c: Add QueryFilter and QueryBoost actions

## 4.0.0-next.13

### Minor Changes

- e3770fba: Introduce id into query rule

## 4.0.0-next.12

### Minor Changes

- 22a91911: Fix issue where facet requests returned hits

### Patch Changes

- 21297f17: update transporter to fix issue with single bad reequest

## 4.0.0-next.11

### Patch Changes

- 0d970a91: Add beforeSearch & afterSearch hook to transform requests

## 4.0.0-next.10

### Minor Changes

- 6b364816: query rules: query rewrite fix
- 2c4748df: Custom headers support for elasticsearch connection

## 4.0.0-next.9

### Patch Changes

- Additional Query rule conditions and actions

## 4.0.0-next.8

### Patch Changes

- e9dfa3d4: More advanced filter support

## 4.0.0-next.7

### Minor Changes

- a11ce94f: Only wrap Elasticsearch query when query rule actions are present

## 4.0.0-next.6

### Minor Changes

- Support debug mode to emit the elasticsearch query + transporter to handle errors gracefully

## 4.0.0-next.5

### Minor Changes

- fix issue with facet filters

## 4.0.0-next.4

### Patch Changes

- 799be8e0: Fix issue when facets have multiple nested attributes that have the same nested path

## 4.0.0-next.3

### Minor Changes

- 97297d50: support nested fields for numeric filters

## 4.0.0-next.2

### Minor Changes

- 186735d0: Support nested fields for filters and facets

## 4.0.0-next.1

### Minor Changes

- 41716dd2: Query rules support for facet rendering / ordering + custom data

## 4.0.0-next.0

### Major Changes

- First Release
