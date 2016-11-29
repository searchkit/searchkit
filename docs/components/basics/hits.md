# Hits Component
Hits component displays results from ElasticSearch. To customize each result, you need to implement a React component and pass into `itemComponent` prop.
The component will receive a single `hit` object from the search results, which will include `result._source` which contains the untouched stored fields which were indexed.

![Example](./assets/hits-grid.png)

## Example Usage

```jsx

import * as _ from "lodash";

import {
  Hits,
  SearchkitComponent,
  HitItemProps
} from "searchkit";

const HitItem = (props) => (
  <div className={props.bemBlocks.item().mix(props.bemBlocks.container("item"))}>
    <img className={props.bemBlocks.item("poster")} src={props.result._source.poster}/>
    <div className={props.bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:_.get(props.result,"highlight.title",props.result._source.title)}}></div>
  </div>
)

class App extends SearchkitComponent {

  render(){
    <div>
      <Hits hitsPerPage={50} highlightFields={["title"]} sourceFilter={["title", "poster", "imdbId"]}
      mod="sk-hits-grid" itemComponent={HitItem}/>
    </div>
  }
}
```

## Props
- `hitsPerPage` *(Number)*: Number of results displayed per page
- `highlightFields` *(Array<string>)*: Array of highlighted fields. Any highlight matches will be returned in the result.highlight[fieldName]. See above for example.
- `customHighlight` *(Object)*: Optional. Allows any custom highlight behavior to control the number of fragments, fragment sizes, and highlighter. Passed through directly to elasticsearch as the value for `highlight`. See the [elastic documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-highlighting.html) for further details.
- `mod` *(string)*: Optional. A custom BEM container class.
  - Searchkit ships with defaults for `sk-hits-grid` and `sk-hits-list`
- `itemComponent` *(ReactComponent)*: React component used for each hit render.
- `listComponent` *(ReactComponent)*: React component used if you want to control the full list of results (e.g. make a table component)
- `sourceFilter` *(string|boolean|Array<string>)*: A source filter parameter which is sent to elasticsearch to reduce the hit `_source` data within the results. see the [elastic documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-source-filtering.html) for further details.
- `scrollTo` *(string|boolean)*: When results have changed, we scroll to the top of the element using the jQuery style selector passed in the `scrollTo` prop. If true, it will use the body as the selector.  Default value is true. If false, it will not scroll when new results are rendered. We determine a change by comparing hits `_id` field with the new results.


## Searchkit Theming styles
Searchkit ships out the box with 2 styles of search results which are controlled via the `mod` property

- `sk-hits-grid` grid styling
- `sk-hits-list` List styling

## Table List example using listComponent

![Table example](./assets/hits-table.png)

```jsx
class MovieHitsTable extends React.Component {

  render(){
    const { hits } = this.props
    return (
      <div style={{width: '100%', boxSizing: 'border-box', padding: 8}}>
        <table className="sk-table sk-table-striped" style={{width: '100%', boxSizing: 'border-box'}}>
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Year</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {map(hits, hit => (
              <tr key={hit._id}>
                <td style={{margin: 0, padding: 0, width: 40}}>
                  <img data-qa="poster" src={hit._source.poster} style={{width: 40}}/>
                </td>
                <td>{hit._source.title}</td>
                <td>{hit._source.year}</td>
                <td>{hit._source.imdbRating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

class App extends SearchkitComponent {

  render(){
    <div>
      <Hits hitsPerPage={50} sourceFilter={["title", "poster", "imdbId", "imdbRating"]} listComponent={MovieHitsTable}/>
    </div>
  }
}
```

## Demo
[](codepen://searchkit/vLgLOw?height=800&theme=0)
