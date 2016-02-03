# Range Filter
The range filter provides the ability to create a range of

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
- `interval` *(number)*: Optional. Enables the slider to be stepped and the interval is the value to be added or subtracted on each step the slider makes. Must be greater than 0 and max - min should be evenly divisble by the step value. For example a min 0 max 100, a good interval would be 5. Without interval specified, the slider would be fluid in moving from min to max. 
