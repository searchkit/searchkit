# Migrating from Searchkit 0.8.x

## Breaking changes

### Action bar classes renamed
`sk-action-bar__info` + `sk-action-bar__filter` renamed to `sk-action-bar-row`.
We strongly recommend using Searchkit's new layout components, see more below.

## Notable Changes

- #### Layout components

  Brand new layout components, rather than using div's with specific classNames, we now provide out the box
  layout components which will work towards responsive layout in future versions.
  We strongly encourage you all to use these new layout components.

  - `Layout`, `TopBar`, `LayoutBody`, `SideBar`, `LayoutResults`, `ActionBar`, `ActionBarRow`
  - see [Layout example](../components/ui/layout-components.md)
  - see [Theming guide](../theming/using-searchkit-theme.md)
- New [CheckboxFilter](../components/navigation/checkbox-filter.md)   
- New [InputFilter](../components/navigation/input-filter.md)   
- New [DynamicRangeFilter](../components/navigation/dynamic-range-filter.md)   
- New [TagFilter components](../components/navigation/tag-filter.md)   
- `SortSelector` supports multiple sort fields
- `SearchkitManager` has new `reloadSearch` method
- `SearchBox` and `InputFilter` support new `queryBuilder` and `prefixQueryOptions` props
