# Indexing & Mapping Guide
`Elasticsearch` querying is very sophisticated, and many of the features rely on an appropriate `mapping` configured.

## Updating index
Straightforward to update the index. See [Updating indices](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-update-settings.html).

### Analyzer extensions
Out the box, elasticsearch uses the default [standard analyzer](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-standard-analyzer.html). We extend the default analyzer to offer [word delimiter](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-word-delimiter-tokenfilter.html), [html strip](https://www.elastic.co/guide/en/elasticsearch/reference/1.4/analysis-htmlstrip-charfilter.html) and [char mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-mapping-charfilter.html).

```json
{
  "analysis": {
    "char_filter": {
       "replace": {
        "type": "mapping",
        "mappings": [
          "&=> and "
        ]
      }
    },
    "filter": {
      "word_delimiter" : {
        "type" : "word_delimiter",
        "split_on_numerics" : false,
        "split_on_case_change" : true,
        "generate_word_parts" : true,
        "generate_number_parts" : true,
        "catenate_all" : true,
        "preserve_original":true,
        "catenate_numbers":true
      }
    },
    "analyzer": {
      "default": {
        "type": "custom",
        "char_filter": [
          "html_strip",
          "replace"
        ],
        "tokenizer": "whitespace",
        "filter": [
            "lowercase",
            "word_delimiter"
        ]
      }
    }
  }
}
```

## Searchkit Mapping best practices

### Indexing fields for filtering & searching
Often you will want a field to be both `searchable` and appear as `filters`. A field will need to be indexed in 2 ways to achieve this, and we can make use of multi fields

#### Mapping example
```json
{
  "movie" : {
    "properties" : {
      "genres" : {
        "type" : "string",
        "fields" : {          
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
The `genres.raw` path will be left untouched by `Elasticsearch`, `Searchkit` would use `not_analyzed` paths to power aggregated search components.

#### Component examples
Using the `genres.raw` field
```jsx
<RefinementListFilter id="genres" title="Genres" field="genres.raw" operator="AND"/>
```
Using the field for searching using prefix
```jsx
<SearchBox prefixQueryFields={["genres^1", "name^10"]}/>
```
