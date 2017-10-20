# Pagination
The pagination component provides ability to go to next and previous page.

![Example](./assets/pagination.png)
## Example

```jsx

import {
  Pagination,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent {

  render(){
    <div>
      <Pagination showNumbers={true}/>
    </div>
  }
}
```

## Props
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/Translate.md) page.
- `showNumbers` *(Boolean)*: Display pagination page links. Defaults to `false`.
- `showLast` *(Boolean)*: Whether to show last page (often slow in ElasticSearch ), defaults to `false`
- `showText` *(Boolean)*: Whether to display previous, next + dividers. Useful to switch off when using Select component.
defaults to `true`
- `pageScope` *(Number)*: When using `showNumber={true}`, how many page numbers to show before and after the current page number. Defaults to `3`
- `mod` *(string)*: Optional. A custom BEM container class.
- `listComponent` *(React Component)*: Used to change the rendering.

## PaginationSelect
If you would like a more compact rendering, you can use Searchkit's `PaginationSelect component instead`

```jsx
<PaginationSelect/>
```


## Translations
- `pagination.previous` - Previous
- `pagination.next` - Next
