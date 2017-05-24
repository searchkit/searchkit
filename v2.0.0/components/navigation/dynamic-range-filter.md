# Dynamic Range Filter
The dynamic range filter lets users filter results within a numerical range. The min and max values are automatically computed by Elasticsearch using the data in the index.

<img src="./assets/dynamic-range-filter.png" height="150px"/>

## Example

```jsx

import {
  DynamicRangeFilter,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent {

  render(){
    <div>
      <DynamicRangeFilter field="metaScore" id="metascore" title="MetaScore"/>
    </div>
  }
}
```

## Props
- `field` *(ESField)*: Required. An elasticsearch numerical field value.
- `id` *(string)*: Required. id of component. Must be unique. Used as key for url serialisation
- `title` *(string)*: Required. Title used for component and for selected filters component
- `rangeComponent` *(ReactComponent)*: Control which sub range component to render
   - Compatible with `RangeSliderInput`
   - Defaults to `RangeSliderInput`
- `mod` *(string)*: Optional. A custom BEM container class.
- `rangeFormatter` *((count:number)=> string|number)* A formatter function used to convert numbers into more readable display values. E.g. long number formatting or prefixing currencies.`
- `fieldOptions` *({type:"embedded|nested|children", options:Object})* Configures the type field that is stored in ElasticSearch, can be `embedded`(default) `nested` or `children`
  - `type:nested` requires `options.path` provided
  - `type:children` requires `options.childType` provided
