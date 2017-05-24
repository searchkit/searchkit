# Input Filter
A input box based filter which is similar to SearchBox, but can be used multiple times, general on the left side panel.
<img src="./assets/input-filter.png" height="200px"/>

## Example

```jsx
import {
  InputFilter,  
} from "searchkit";

<InputFilter
  id="author_q"
  title="Actors filter"
  placeholder="Search actors"
  searchOnChange={true}
  prefixQueryFields={["actors"]}
  queryFields={["actors"]}
/>
```

## Props
- `title` *(string)*: Title of the menu. Shown as a header and within selected filters
- `id` *(string)*: id of component. Must be unique. Used as key for url serialisation
- `searchOnChange` *(Boolean)*: Optional. Updates search results as you type. Will be false by default.
  - use with `prefixQueryFields` to get a better search as you type behaviour.  
- `queryBuilder` *(Function)* builder used to create the query going to elastic.
  - defaults to `SimpleQueryString`
  - Supports `QueryString`, or custom function accepting `(query:string, options:Object)`
- `queryFields` *(Array<string>)*: Optional. An array of elasticsearch fields to search within. Can specify boosting on particular fields. Will search `_all` by default.
- `queryOptions` *(Object)*: Optional. An object of options for [Query String](https://www.elastic.co/guide/en/elasticsearch/reference/2.0/query-dsl-query-string-query.html).
- `placeholder` *(string)*: placeholder for the input box
- `prefixQueryFields` *(Array<string>)*: Optional. An array of elasticsearch fields to search within. Can specify boosting on particular fields. Will search `_all` by default. Will only be used if searchOnChange is true.
- `prefixQueryOptions` *(Object)*: Optional. An object of options for [MultiMatchQuery ](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html#query-dsl-multi-match-query).
- `mod` *(string)*: Optional. A custom BEM container class.
- `translations` *(Object)*: An object of translations you wish to override. For more information on translations see [translate](../../core/Translate.md) page.
- `searchThrottleTime` *(number)*: Default is 200ms. Is used when `searchOnChange` prop is `true`. A search to elasticsearch will only be invoked once every `searchThrottleTime` ms.   
- `blurAction` *(search|restore)*: When `searchOnChange={false}` Configure behavior of the InputFtiler  when the user blur's out of the field. Defaults to `search`
