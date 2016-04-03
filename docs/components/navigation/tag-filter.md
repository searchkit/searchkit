# TagFilter, TagFilterList, TagFilterConfig
A suite of components to provide tag filters within your search results.

<img src="./assets/tag-filter.png"/>


## Example
Within a list item component we can use the `TagFilterList` and pass the `values` + `field`.
Note that a `RefinementListFilter` or `MenuFilter` or `TagFilterConfig` is required with provided
field so the filter can be added correctly.
```jsx
  <ul style={{ marginTop: 8, marginBottom: 8, listStyle: 'none', paddingLeft: 20 }}>
    <li>Rating: {rated}</li>          
    <li>Writers: <TagFilterList field="writers.raw" values={writers} /></li>
    <li>Actors: <TagFilterList field="actors.raw" values={actors} /></li>
  </ul>        
```

### List Item example
```jsx
const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId  
  const { title, poster, writers = [], actors = [], genres = [], plot, released, rated } = result._source;

  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <img data-qa="poster" src={result._source.poster}/>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title")}>{title}</h2></a>
        <h3 className={bemBlocks.item("subtitle")}>Released in {source.year}, rated {source.imdbRating}/10</h3>
        <ul style={{ marginTop: 8, marginBottom: 8, listStyle: 'none', paddingLeft: 20 }}>
          <li>Rating: {rated}</li>          
          <li>Writers: <TagFilterList field="writers.raw" values={writers} /></li>
          <li>Actors: <TagFilterList field="actors.raw" values={actors} /></li>
        </ul>        
      </div>
    </div>
  )
}

const App = ()=> {
  <TagFilterConfig id="genres" title="Genres" field="genres.raw" />
  <RefinementListFilter id="actors" title="Actors" field="actors.raw" size={10}/>
  ...
  <Hits hitsPerPage={12} itemComponent={MovieHitsListItem}/>
}
```

Note how we have a `RefinementListFilter` for `actors.raw` but needed to add a `TagFilterConfig` for `genres.raw`.
The `TagFilterConfig` will not render anything, and will just provide configuration for that field.


## TagFilterList
TagFilterList renders a list of tags with add/remove behaviour
- `filter` *(string)*: Required. The field name which should also map to a `RefinementListFilter` or `MenuFilter` or `TagFilterConfig` component within the page.
- `values` *(Array<string>)*: The array of values per result, often read from the `_source` of each document

## TagFilter
A Low level component to render each Tag, used if you want to full control the surrounding list.
- `filter` *(string)*: Required. The field name which should also map to a `RefinementListFilter` or `MenuFilter` or `TagFilterConfig` component within the page.
- `value` *(string)*: The value of the tag

## TagFilterConfig
A non rendering config component which holds logic to add/remove filters.
-  `field` *(string)*: Elastic search field to filter on
- `title` *(string)*: Title of the filter, used for selected filters rendering
- `id`: *(string)*: unique id used for url serialization
- `operator` *('AND'|'OR')*: If you filter on a and b with OR, results with either the value a or b will match. If you select a and b, results will show which have both a and b.
