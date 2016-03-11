# Pagination
The pagination component provides ability to go to next and previous page.

## Example

```jsx

import {
  Pagination,
  SearchkitComponent
} from "searchkit";

class App extends SearchkitComponent {

  render(){
    <div>
      <Pagination/>
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
- `mod` *(string)*: Optional. A custom BEM container class.

## Translations
- `pagination.previous` - Previous
- `pagination.next` - Next
