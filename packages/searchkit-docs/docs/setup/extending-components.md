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
Some components have the feature to override the display component to allow you to control the markup and contents of the component using the `itemComponent` props. Example of overriding the default rendering of a hit from `Hits` component.

```js

import {
  HitsStats,
  SearchkitComponent
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
      <SearchBox
        searchOnChange={true}
        queryOptions={{analyzer:"standard"}}
        queryFields={["title^5", "languages", "text"]}/>

      <Hits hitsPerPage={50} highlightFields={["title"]} sourceFilter={["title", "poster", "imdbId"]} itemComponent={HitItem}/>

    </div>
  }
}
```

The following components support this feature:
- [Hits](../components/basics/hits.md)
- [InitialLoader](../components/basics/initial-loader.md)
- [Menu](../components/navigation/menu.md)
- [Refinement List](../components/navigation/refinement-list.md)
- [Reset](../components/navigation/reset.md)
- [Selected Filters](../components/navigation/selected-filters.md)
