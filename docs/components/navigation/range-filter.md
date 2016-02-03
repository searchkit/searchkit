# Range Filter
The range filter lets users filter results within a numerical range. Provides a histogram so show the user where results are found on the range. 

## Example

```jsx

import {
  RangeFilter,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent {

  render(){
    <div>
      <RangeFilter field="metaScore" id="metascore" min={0} max={100} showHistogram={true} title="MetaScore"/>
    </div>
  }
}
```

## Props
- `field` *(ESField)*: Required. An elasticsearch numerical field value.
- `id` *(string)*: Required. id of component. Must be unique. Used as key for url serialisation
- `min` *(number)*: Required. min start range
- `max` *(number)*: Required. max start range
- `title` *(string)*: Required. Title used for component and for selected filters component
- `showHistogram` *(boolean)*: Shows a histogram to provide a guide where their range would hit results.
- `mod` *(string)*: Optional. A custom BEM container class.
- `interval` *(number)*: Optional. Override the interval which is sent to ElasticSearch, used for generating the buckets which render the histogram. (Defaults to an interval which allows a max of 20 buckets which fit the range)
