## 0.5.0

## 0.4.0 (26th Jan, 2016)
* update to lodash 4.0 with individual function imports (smaller footprint)
* Breaking api change to internal query builder RangeQuery
* Increased unit test coverage to 99%
* Increase e2e test coverage

## 0.3.5 (21st Jan, 2016)

* New RangeFilter slider component
* More QueryDSL builds
* Improved tsting


## 0.3.2 (18th Jan, 2016)

* Correct Searchkit.version

## 0.3.1 (18th Jan, 2016)

* Better Documentation

## 0.3.0 (18th Jan, 2016)

### Overview
* Complete rewrite of query builder
* More test coverage ( 92% coverage )

### Improvements
* More comprehensive support for [translations]()
* Better Documentation

### New
* New `NoHits` Component

### Breaking Changes
* No results blank state now handled by `NoHits` component, removed responsibility from `Hits` component. Please use `NoHits` component instead for this state.


## 0.2.0 (11 Jan, 2016)

### New
* New [Hierarchical Filter Component](http://docs.searchkit.co/stable/docs/components/navigation/hierarchical-refinement-filter.html)

### Improvements
* `Searchbox`: `prefixQueryFields` uses `queryFields` if not specified and `searchOnChange` prop is enabled

## 0.1.13  (4th Jan, 2016)
* Changed licence to Apache 2.0

## 0.1.12 (4th Jan, 2016)

* Better Documentation

### Improvements
* Searchbox uses replacestate as you type, pushstate on no change after 400ms

## 0.1.11 (3rd Jan, 2016)

* Better Documentation

### Improvements
* Searchbox uses replacestate as you type, pushstate on no change after 400ms

## 0.1.8 (Jan 1st 2016)

* Initial public release
