# Indexing Guide

`Elasticsearch` querying is very sophisticated, and many of the features rely on an appropriate `mapping` configured

## Multi fields
Often you will want a field to be both `searchable` and appear as `facets`. A field will need to be indexed in 2 ways to achieve this, and we can make use of multi fields

### Mapping example
```json
{
  "movie" : {
    "properties" : {
      "genres" : {
        "type" : "string",
        "fields" : {
          "genres" : {"type" : "string"},
          "raw" : {
            "type" : "string",
            "index" : "not_analyzed"
          }
        }
      }
    }
  }
}
```

This mapping will mean the `genres` field is indexed in 2 ways. The `genres` path will be analyzed by elastic search meaning it will be tokenized and have the standard stop words removed which is ideal for a free text search.
The `genres.raw` path will be left untouched by `Elasticsearch`, `Searchkit` would use `not_analyzed` paths to power facetted search components.

### Component examples
Using the `genres.raw` field
```html
<RefinementListFilter id="genres" title="Genres" field="genres.raw" operator="AND"/>
```
Using the `genres` field for searching using prefix
```html
<SearchBox prefixQueryFields={["genres^1", "name^10"]}/>
```

## Hierarchical Data
`Searchkit` has an out the box `HierarchicalMenuFilter` component which displays a `tree` or `taxonomy` component.

### Dynamic tree of multiple fields
One example use of this component is composing several fields and dynamically constructed a tree to suit the UI.
e.g. show a Hierarchical menu based on **movie type** and then a sub menu containing **movie genres**, `Searchkit` will construct the appropriate `aggregation` queries automatically behind the scenes
```html
<HierarchicalMenuFilter fields={["type.raw", "genres.raw"]} title="Categories" id="categories"/>
```

### Structured tree
Some applications may already have the concept of a `tree`. e.g. `Pages` or `Taxonomy` or `Hierarchical tags` in their application and would like `Searchkit` to automatically render the tree.

We suggest the following `mapping` + `indexing` strategy for this.

#### Hierarchical Mapping example
given a field named `color` with a max of `10` levels, the tree would look like the following.

##### Mapping example
```js
{
  "photos":{
    "color":{
      "properties":{
       //includes all ids for flat level querying
       "all":{"type":"string", "index":"not_analyzed"},

       //tags bucketed by their level in the tree
       "lvl1":{"type":"string", "index":"not_analyzed"},
       "lvl2":{"type":"string", "index":"not_analyzed"},
       "lvl3":{"type":"string", "index":"not_analyzed"},
       //...
       "lvl10":{"type":"string", "index":"not_analyzed"}
    }
  }
}
```

##### Indexing example
```js
{
  "color.all":["Red", "Green", "Ruby Red", "Emerald", "Lime"]
  "color.lvl1":["Red", "Green"]
  "color.lvl2":["Ruby Red", "Emerald", "Lime"]
}
```

#### Component example
e would then configuring using the tree levels we wish to render
```html
<HierarchicalMenuFilter fields={["color.lvl1", "color.lvl2", "color.lvl3"]} title="Colors" id="colors"/>
```
