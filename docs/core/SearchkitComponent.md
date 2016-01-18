# SearchkitComponent
A `react` component baseclass which offers convenience methods and references to instances of `SearchkitManager` and `Searcher`

```jsx
  import {
    SearchkitComponent
  } from "searchkit"

  class MySearchkitComponent extends SearchkitComponent {

    //optional overridable methods

    // uses bem-cn library
    // this.bemBlocks.container() -> "container"
    // this.bemBlocks.option().mix(this.bemBlocks.container("item")) -> "option container__item"
    defineBEMBlocks(){
      return {
        "container":"container",
        "option":"item"
      }
    }

    defineAccessor(){
      //return a configured Accessor
    }

  }
```
