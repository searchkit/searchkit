# Extending Components

## Styling
Searchkit uses [BEM concepts](https://en.bem.info/method/key-concepts). All searchkit components allow you to change the BEM block via the mod attribute. When BEM block is overridden, no styles will be applied to the component and you can then apply your styles as required.

### BEM Blocks
We use [BEM-cn](https://github.com/albburtsev/bem-cn) a BEM react library. Each component has one or more blocks (for example filters usually have 2 blocks, one for "container" and one for "option"). They will be accessible under `this.bemBlocks`. If you need an additional block or want to customize the block names, override the `defineBEMBlocks` method. Here is an example override

```js
defineBEMBlocks() {
  var blockName = "refinement-list"
  return {
    container: blockName,
    option: `${blockName}-option`
  }
}
```

The container block would be accessible using `this.bemBlocks.container`.

`this.bemBlocks.container("info").state({disabled:true})` -> "refinement-list__info is-disabled"

## Overriding rendering
You can override rendering methods for some of the searchkit components. Below is an example of overriding the HitsStats component

```js

import {
  HitsStats,
  SearchkitComponent
} from "searchkit";

class ExampleHitStats extends HitsStats {
  renderText() {
    return (<div className="{this.bemBlocks.container("info")}">override text</div>)
  }
}

class App extends SearchkitComponent<any, any> {
  render(){
    <div>
        <ExampleHitStats/>
    </div>
  }
}
```
