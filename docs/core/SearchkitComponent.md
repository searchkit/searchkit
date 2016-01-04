# SearchkitComponent
A `react` component baseclass which offers convenience methods and references to instances of `SearchkitManager` and `Searcher`

```jsx
  import {
    SearchkitComponent
  } from "searchkit"

  class MySearchkitComponent extends SearchkitComponent {

    //optional overridable methods
    defineBEMBlocks(){
      //returns js object defining BEM blocks
    }

    defineAccessor(){
      //return a configured Accessor
    }

  }
```
