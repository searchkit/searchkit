# Migrating from Searchkit 0.5.x

## Hits sourceFilter property
`Hits` now supports the `sourceFilter` prop, we strongly advise you to use this as it will speed up your search and reduce a lot of wasted bandwidth.
```jsx
<Hits hitsPerPage={50} sourceFilter={["title", "poster", "imdbId"]} itemComponent={HitItem}/>
```

## HitStats component overrides
If you previously extended `HitStats` in order to customize the component, please switch to using the `component` prop.
More details can be found in the [HitStats documentation](../components/metadata/stats.md)
