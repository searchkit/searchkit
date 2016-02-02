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
      <Hits hitsPerPage={50} highlightFields={["title"]} itemComponent={HitItem}/>
    </div>
  }
}
```

## Props
- `hitsPerPage` *(Number)*: Number of results displayed per page
- `highlightFields` *(Array<string>)*: Array of highlighted fields. Any highlight matches will be returned in the result.highlight[fieldName]. See above for example.
- `mod` *(string)*: Optional. A custom BEM container class.
- `itemComponent` *(ReactComponent)*: React component used for each hit render.


## Demo
[](codepen://searchkit/vLgLOw?height=800&theme=0)
