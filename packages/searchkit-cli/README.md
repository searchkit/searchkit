# <a href="https://www.searchkit.co/">Searchkit</a>

## Searchkit Cli

[![npm version](https://badge.fury.io/js/%40searchkit%2Felastic-ui.svg)](https://badge.fury.io/js/%40searchkit%2Fcli)

Eases configuration and indexing of documents into elasticsearch. Will provide a CLI to help you define your fields, add them as a mapping and index dataset into your local / cloud elasticsearch instance.

## Documentation

A Step guide on how to use searchkit CLI can be found at: <br/>
[https://searchkit.co/docs/guides/elasticsearch-setup-indexing](https://searchkit.co/docs/guides/elasticsearch-setup-indexing)

```javascript
withConfig({
  index: 'imdb_movies', <--- the elasticsearch index name
  host: "http://localhost:9200", <--- host url for elasticsearch
  source: movies, <---- Array of raw documents. Used with the field's sourceOptions. Optional
  type: 'movie' <----- required for Elasticsearch v6. If you use elasticsearch 7, do *not* specify type.
	fields: [
    {
      fieldName: 'type',  <-- name of field. Must be lowercase
      stored: true, <-------- fields you want returned in the API. 
      facet: true,  <-------- If you want the value to be used as a facet
      searchable: true <----- If you want the field to be searchable within query
      type: 'integer' <--- Optional. Default is keyword. Can be `integer`, `date` or `float`
      sourceOptions: { 
        path: 'Type' <-- Used in indexing step. The key for the field value source. 
        transform: splitComma <-- Optional. To provide transformation from source to document field 
      }
    }
  ]
})
```

Then run the CLI via `yarn start` and follow the steps.

#### Generate Example Searchkit Config?
If yes, CLI will generate a file in current working directory called skConfig.md. This will provide you an elasticsearch mapping file and an example searchkit config, based on the field definitions within config.ts

#### Host detected. Destroy index and reinsert index mapping?
If yes, will recreate the elasticsearch index

#### Source detected. Insert documents into ES host?
If yes, will index the documents into elasticsearch
