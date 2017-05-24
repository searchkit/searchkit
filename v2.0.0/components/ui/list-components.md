# List Components
A Suite of UI Components which render lists in various ways and can be passed to many Searchkit components to change their list appearance.

<img src="../navigation/assets/menu-list-components.png" />


Many of SearchKit's components which render lists will support a `listComponent` prop where these components an be referenced

## ItemList

Used to render list of facets or items

<img src="../navigation/assets/menu-itemlist.png" height="150px"/>

## ItemCheckboxList

Used to render list of facets or items when multiselecting

<img src="../navigation/assets/menu-checkbox.png" height="150px"/>


## ItemHistogramList
Used to render list of facets or items with a histogram bar showing the count. Requires a `doc_count` for each item, so won't work for Pagination, SortingSelector, and other non-filter components. 

<img src="../navigation/assets/menu-histogram.png" height="150px"/>

## TagCloud
Used to render list of facets or items where the count influences the size of text. Requires a `doc_count` for each item, so won't work for Pagination, SortingSelector, and other non-filter components. 

<img src="../navigation/assets/menu-tagcloud.png" height="150px"/>

## Tabs
Used to render tabs, often used for menu or view switching

<img src="../navigation/assets/menu-tabs.png" height="150px"/>

## Select
Used to render a selectable list of items

<img src="../navigation/assets/menu-select.png" height="150px"/>

## Toggle
Renders a toggle with single/multiple select behaviour

<img src="../navigation/assets/menu-toggle.png" height="150px"/>


## Compatible parent components

##### RefinementListFilter
ItemList, ItemCheckboxList, ItemHistogramList, TagCloud, Tabs, Select, Toggle

##### MenuFilter
ItemList, ItemCheckboxList, ItemHistogramList, TagCloud, Tabs, Select, Toggle

##### NumericRefinementListFilter
ItemList, ItemCheckboxList, ItemHistogramList, TagCloud, Tabs, Select, Toggle

##### ViewSwitcherToggle
ItemList, ItemCheckboxList, Tabs, Select, Toggle

##### PageSizeSelector
ItemList, ItemCheckboxList, Tabs, Select, Toggle

##### SortingSelector
ItemList, ItemCheckboxList, Tabs, Select, Toggle

##### Pagination
ItemList, ItemCheckboxList, Tabs, Select, Toggle
