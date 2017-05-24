# Migrating from Searchkit 0.4.x

###  Overriding Display Components
Rather than extending a component class and overriding particular methods responsible for rendering, you now use the `itemComponent` or `component` prop and pass in a React component to do the rendering. The following components now support this feature:
- [Hits](../components/basics/hits.md)
- [InitialLoader](../components/basics/initial-loader.md)
- [Menu](../components/navigation/menu.md)
- [Refinement List](../components/navigation/refinement-list.md)
- [Reset](../components/navigation/reset.md)
- [Selected Filters](../components/navigation/selected-filters.md)

Not all components support this feature yet but will expand in future releases. Let us know via github issues if there is one in particular you need.

### Hits component no longer renders initial state
We have moved the initial loading view into a new [Initial loader Component](../components/basics/initial-loader.md)
