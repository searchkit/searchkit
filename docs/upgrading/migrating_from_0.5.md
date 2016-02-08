# Migrating from Searchkit 0.5.x

## Hits sourceFilter property
`Hits` now supports the `sourceFilter` prop, we strongly advise you to use this as it will speed up your search and reduce a lot of wasted bandwidth.
```jsx
<Hits hitsPerPage={50} sourceFilter={["title", "poster"]} itemComponent={HitItem}/>
```
