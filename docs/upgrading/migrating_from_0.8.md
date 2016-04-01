# Migrating from Searchkit 0.8.x

## Breaking changes

### Action bar classes renamed
`sk-action-bar__info` + `sk-action-bar__filter` renamed to `sk-action-bar-row`.
We strongly recommend using Searchkit's new layout components, see more below.
```jsx
// before
<div className="sk-results-list__action-bar sk-action-bar">
  <div className="sk-action-bar__info">
    <HitsStats/>  
  </div>
  <div className="sk-action-bar__filters">
    <GroupedSelectedFilters/>
    <ResetFilters/>
  </div>
</div>

//after
<div className="sk-results-list__action-bar sk-action-bar">
  <div className="sk-action-bar-row">
    <HitsStats/>  
  </div>
  <div className="sk-action-bar-row">
    <GroupedSelectedFilters/>
    <ResetFilters/>
  </div>
</div>
```

## Notable Changes

Brand new layout components, rather than using div's with specific classNames, we now provide out the box
layout components which will work towards responsive layout in future versions.
We strongly encourage you all to use these new layout components.

- `Layout`, `TopBar`, `LayoutBody`, `SideBar`, `LayoutResults`, `ActionBar`, `ActionBarRow`
- see [Theming guide](../theming/using-searchkit-theme.md)
