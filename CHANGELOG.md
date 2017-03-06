## 1.0.0 - Beta 7 (23th Feb, 2017)
- fix: Set default size to 20 for `HierarchicalMenuFilter` #398
- Abort axios requests which will not be used. E.g. search as you type

## 1.0.0 - Beta 6 (19th Feb, 2017)
- new feature: Ability for custom highlighting options #355

## 1.0.0 - Beta 5 (17th Feb, 2017)
- new feature: Axios upgrade, expose timeout #396
- updated dev guide

## 1.0.0 - Beta 4 (14th Feb, 2017)
- fix: Elasticsearch 5 compat fix

## 1.0.0 - Beta 3 (14th Feb, 2017)
- fix: Typo in error message
- fix: fix typo on indexing documentation
- fix: small fix on checkbox filters when filter option name is too long #335

## 1.0.0 - Beta 2 (13th Feb, 2017)
- fix: Circle CI build

## 1.0.0 - Beta 1 (13th Feb, 2017)
- fix: `ViewSwitcherHits` mutating props. React 15 gives warning.
- fix: `Pagination` works. Lodash regression issue

## 1.0.0 - Beta 0 (4rd Feb, 2017)
### Dependencies Updates
- Added React 15 to peer dependencies + fix tests for react 15.4
- history to 2.1.1
- typescript to 2.1.4
- type definitions managed by npm
- lodash to 4.14
- rc-slider to 5.4.3
- protractor to 4.0.0

## 0.10.1 (10th August, 2016)
- fix pagination regression due to lodash change of api

## 0.10.0 (4th June, 2016)
- `SearchkitManager` is more intelligent with reregistering url listeners
- `RefinementListFilter`, `MenuFilter`, `NumericRefinementListFilter` and `RangeFilter` now supports `fieldOptions` for `nested`/`child` fields
- `RefinementListFilter`, `MenuFilter` inject missing selected filters
- `RefinementListFilter`, `MenuFilter` have new `bucketsTransform` prop function to manipulate the elastic search buckets returned.
- Bug fix to itemComponent, listComponent, \*Component which allows context in stateless components
- MenuFilter fix to support booleans
- HierarchicalRefinementFilter disabled state fix
- update history dependency to `2.1.1` which should be compatible with react-router 2.x
- fix `DynamicRangeFilter` rounding issues
- Added `countFormatter` count formatting support to `RefinementListFilter`, `MenuFilter`, `NumericRefinementListFilter`, `HierarchicalMenuFilter`, `HierarchicalRefinementFilter`, `HitsStats`
- Added `rangeFormatter` range display support to `RangeFilter`, `DynamicRangeFilter`
- Fix corner cases to BoolMustNot queries
- `SearchkitManager` `searchOnLoad` now works without history
- `SearchkitManager.addResultsListener` to register a callback when ever new results are recieved
- Fix input filter styling
- Fix FacetFilter 'View All' link edge case

## 0.9.2 (7th April, 2016)
### Notable changes
- fix `NoHits` styling so it uses scss vars
- fix `CheckboxFilter` disabled state
- fix `SearchBox`, `InputFilter` when searchOnChange=false disabled state
- introduce `blurAction` to `SearchBox`, `InputFilter`
  - `blurAction="search" will search on blur`
  - `blurAction="restore" will restore text to previous state on blur`

## 0.9.1 (6th April, 2016)
### Notable changes
- fix scss dep management, so vars.scss can be overriden
- add a dark theme example app in our test folder

## 0.9.0 (3rd April, 2016)
### Breaking changes
- layout classnames `sk-action-bar__info` + `sk-action-bar__filter` renamed to `sk-action-bar-row`.
  - We strongly advise to use the new layout components.

### Notable Changes
 - New `Layout` components to be used instead of specific div + classname markup
   - `Layout`, `TopBar`, `LayoutBody`, `SideBar`, `LayoutResults`, `ActionBar`, `ActionBarRow`
   - precursor to responsive layout where we make these layout components more intelligent.
 - New `CheckboxFilter` component which does a on/off checkbox based on arbitrary query
 - New `InputFilter` component which is a free text filter, great if you need to filter on specific fields.
 - New `DynamicRangeFilter` component which will dynamically calculates the possible min/max based on your search results.
  - note this filter only supports range slider UI.
 - New `TagFilter` components, Used to have clickable tags within your search results.
 - `SearchBox` enhancements
  - `prefixQueryOptions` prop if you want to customize the elastic options for this query
  - `queryBuilder` prop if you want to customize how the query is built, defaults to `SimpleQueryString`    
 - `SortSelector` now supports multiple sort fields (e.g. secondary sort), be sure to provide the mandatory key
 - `SearchkitManager` has new `reloadSearch` method, used if you want to just reload the search even with the same query.


## 0.8.3 (17th March, 2016)
### Bug Fixes
 - SortingSelector handles for app reload.

## 0.8.2 (17th March, 2016)
### Bug Fixes
 - PageSizeSelector synchronises state correctly with url

## 0.8.1 (16th March, 2016)
### Bug Fixes
 - support Classic components using react.createClass properly in our prop overrides such as listComponent, itemComponent etc.

## 0.8.0 (15th March, 2016)
### Breaking Changes
 - Classname changes,in `RefinementListFilter`, `MenuFilter`, `NumericRefinementListFilter`, `Pagination`, `ViewSwitcherToggle`, `SortingSelector`. We have updated the theme to be backwards compatible, but if you have custom css for those components, you may need to update them.

### Notable Changes
 - New UI Components  
  - List components (`Toggle`, `Select`, `ItemList`, `CheckboxItemList`, `ItemHistogramList`, `Tabs`, `TagCloud`)
    - supported by `RefinementListFilter`, `MenuFilter`, `Pagination`, `ViewSwitcherToggle`, `SortingSelector`, `NumericRefinementListFilter`
  - Panel, all left hand filter components use Panel which can be collapsable now.  
- RefinementListFilter, MenuFilter itemComponent changes
  - If you have implemented a custom itemComponent, the toggleFilter action function has been renamed to onClick, be sure to rename so that clicking facets works as expected.
 - Added range input capability to `RangeFilter`

 - Added `PageSizeSelector` for selecting how many results per page
 - `Hits` + `ViewSwitcherHits` now supports listComponent to fully handled the list container.
 - `Pagination` now supports showText property, `PaginationSelect` is a select based implementation of Pagination
 - `SearchkitManager` now supports `searchOnLoad` property which controls whether the initial search runs.
 - `SearchkitManager` has a `searchUrlPath` property which controls the endpoint name (defaults to \_search)
 - exclude/include properties added to `RefinementListFilter`, `MenuFilter`. These are just a pass through property to ElasticSearch's Terms Aggregation

## 0.7.0 (15th feb, 2016)
### Breaking Changes
- `Theming`, 0.7 has major changes to component classnames and overall theming approach. Searchkit classes are now prefixed with `sk-` in order to avoid collisions, we also provide a set of variables which control various aspects of the theme. See theming section in docs.
- `Hits` component requires `mod="sk-hits-grid"` to retain grid styling
- If you are using the cdn, we only ship `themes.css` and no longer `styles.css`
```html
<link href="//cdn.jsdelivr.net/searchkit/0.7.0/theme.css" rel="stylesheet"/>
```
- [Example pull request to update to 0.7.0](https://github.com/PAK90/Gatherer2/pull/2/files)
- [Searchkit Theming documentation](http://docs.searchkit.co/stable/docs/theming/using-searchkit-theme.html)


### Notable Changes
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
