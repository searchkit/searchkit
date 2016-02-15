## 0.7.0 (15th feb, 2016)
### Notable Changes
- `Theming`, 0.7 has major changes to component classnames and overall theming approach. Searchkit classes are now prefixed with `sk-` in order to avoid collisions, we also provide a set of variables which control various aspects of the theme. See theming section in docs.
- `setQueryProcessor` added to `SearchkitManager` which allows post processing of query before it is sent to elasticsearch.  [#131](https://github.com/searchkit/searchkit/issues/131)
- `SortingSelector` now allows empty field, sort properties, useful if you need to add a None option or you want to rely on elasticsearch defaults for sort direction. [#116](https://github.com/searchkit/searchkit/issues/116)
- `ViewSwitcherHits` and `ViewSwitcherToggle` toggle components which allows view switch functionality, e.g. grid or list view. Our theming updates also provide good defaults for grid + list views. [#30](https://github.com/searchkit/searchkit/issues/116)
- `ResetFilter` now accepts reset options. This allows the which features(filter, query, pagination) influence the resetting disabled state, and what gets reset once the component has been clicked. [#107](https://github.com/searchkit/searchkit/issues/107)

## 0.6.2 (9th feb, 2016)
### Notable Changes
- Fix regression in RefinementListFilter not showing view more options

## 0.6.1 (8th feb, 2016)
### Notable Changes
- Fix pagination bug where last page was not clickable.
- Fix documentation references for sourceFilter which lead to incomplete demo

## 0.6.0 (8th feb, 2016)
### Notable Changes
- `Hits` now supports the `sourceFilter` prop, we strongly advise you to use this as it will speed up your search and reduce a lot of wasted bandwidth [#20](https://github.com/searchkit/searchkit/issues/20)
```jsx
<Hits hitsPerPage={50} sourceFilter={["title", "poster", "imdbId"]} itemComponent={HitItem}/>
```
- `SortingSelector` Component now supports `defaultOption` prop, and we have fixed issues in selection. [#89](https://github.com/searchkit/searchkit/issues/89)
- `RefinementListFilter`, `MenuFilter`, `HierarchicalMenuFilter` all support sorting on intrinsic order fields via the the `orderKey` and `orderDirection` props. [#46](https://github.com/searchkit/searchkit/issues/46)
- `NoHits`, `ResetFilters` now support customization via high order react components
- `HitStats` now supports customization via higher order react component, note
if you previously extended HitStats, you will need to change your code to use the `component` prop
- ScrollToTop improvements, now configurable on `Hits` component and will scroll to top on any result changes, this is via the `scrollTo` prop. [#48](https://github.com/searchkit/searchkit/issues/48)
- ErrorHandling, we now display a more meaningful message when an error in elastic or the http call occurs. The `NoHits` component displays this, and is also configurable via the `errorComponent` higher order component prop.[#18](https://github.com/searchkit/searchkit/issues/18)
- `ResetFilters` now ignores defaultQueries.[#44](https://github.com/searchkit/searchkit/issues/44)

## 0.5.1 (3rd Feb, 2016)
- missing theme css

## 0.5.0 (3rd Feb, 2016)

### Notable changes
- remove lib from git. If you install package not via npm, you need to `npm run-script build` in root of project. [#37](https://github.com/searchkit/searchkit/issues/37)

### New Features
* InitialView component [#34](https://github.com/searchkit/searchkit/issues/34)


### Improvements
* Avoid duplicate redundant searches [#71](https://github.com/searchkit/searchkit/issues/71)
* Discourage extending searchkit components, use `itemComponent` and `component` to override display with your own React components. The following components support this feature. See component docs for more information. [#17](https://github.com/searchkit/searchkit/issues/17)
  - Hits
  - InitialLoader
  - Menu
  - Refinement List
  - Reset
  - Selected Filters

* Pagination supports showing links [#40](https://github.com/searchkit/searchkit/issues/40)
* Range Filter no filter applied if range min max equals component min and max [#16](https://github.com/searchkit/searchkit/issues/16)
* Configurable search throttle time via prop on searchbox component [#55](https://github.com/searchkit/searchkit/issues/55)

### Bugs
* No throttling of search query [#35](https://github.com/searchkit/searchkit/issues/35)
* componentWillUnmount not removing accessor [#25](https://github.com/searchkit/searchkit/issues/25)
* NumericRefinementListFilter does not add `.is-disabled` class when has no options [#50](https://github.com/searchkit/searchkit/issues/50)



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
