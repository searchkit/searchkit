# Range Filter
The range filter lets users filter results within a numerical range. Provides a histogram so show the user where results are found on the range.

<img src="./assets/range-filter.png" height="150px"/>

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
- `rangeComponent` *(ReactComponent)*: Control which sub range component to render
   - Compatible with `RangeSliderHistogram`, `RangeSliderHistogramInput`, `RangeSliderInput`, `RangeHistogramInput`
   - Defaults to `RangeSliderHistogram`
- `mod` *(string)*: Optional. A custom BEM container class.
- `interval` *(number)*: Optional. Override the interval which is sent to ElasticSearch, used for generating the buckets which render the histogram. (Defaults to an interval which allows a max of 20 buckets which fit the range)
- `fieldOptions` *({type:"embedded|nested|children", options:Object})* Configures the type field that is stored in ElasticSearch, can be `embedded`(default) `nested` or `children`
  - `type:nested` requires `options.path` provided
  - `type:children` requires `options.childType` provided
  - see [Field Options](../../core/FieldOptions.md)
- `rangeFormatter` *((count:number)=> string|number)* A formatter function used to convert numbers into more readable display values. E.g. long number formatting or prefixing currencies.`
