# Grouped Selected Filters
An alternative component to SelectedFilters which groups the selected filters by Facet type and allows better use of screen real estate

![Example](./assets/grouped-selected-filters.png)

## Example
```jsx

import {
  GroupedSelectedFilters,
  Hits
} from "searchkit"

<div className="sk-layout__results sk-results-list">
  <div className="sk-results-list__action-bar sk-action-bar">    
    <div className="sk-action-bar__filters">
      <GroupedSelectedFilters/>
    </div>
  </div>
  <Hits hitsPerPage={10}/>
</div>
```

## GroupedSelectedFilters props

- `groupComponent` *(React Component)*: Used to override the rendering for each filter group.
