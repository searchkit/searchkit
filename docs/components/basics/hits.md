# Hits Component
Hits component displays results from ElasticSearch. To customize each result, you need to implement a React component and pass into `itemComponent` prop.
The component will receive a single `hit` object from the search results, which will include `result._source` which contains the untouched stored fields which were indexed.

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
    <div className={props.bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:_.get(props.result,"highlight.title",false) || props.result._source.title}}></div>
  </div>
)

class App extends SearchkitComponent {

  render(){
    <div>
      <Hits hitsPerPage={50} highlightFields={["title"]} sourceFilter={["title", "poster", "imdbId"]} itemComponent={HitItem}/>
    </div>
  }
}
```

## Props
- `hitsPerPage` *(Number)*: Number of results displayed per page
- `highlightFields` *(Array<string>)*: Array of highlighted fields. Any highlight matches will be returned in the result.highlight[fieldName]. See above for example.
- `mod` *(string)*: Optional. A custom BEM container class.
- `itemComponent` *(ReactComponent)*: React component used for each hit render.
- `sourceFilter` *(string|boolean|Array<string>)*: A source filter parameter which is sent to elasticsearch to reduce the hit `_source` data within the results. see the [elastic documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-source-filtering.html) for further details.
- `scrollTo` *(string|boolean)*: When results have changed, we scroll to the top of the element using the jQuery style selector passed in the `scrollTo` prop. If true, it will use the body as the selector.  Default value is true. If false, it will not scroll when new results are rendered. We determine a change by comparing hits `_id` field with the new results.

## Demo
[](codepen://searchkit/vLgLOw?height=800&theme=0)
