---
id: guides-indexing
title: Indexing Data
sidebar_label: Indexing Data
slug: /core/guides/elasticsearch-setup-indexing
---

### Setup Elasticsearch

Either pick a cloud offering [Elastic Cloud](https://cloud.elastic.co?ref=searchkit) or run locally via [instructions here](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html)

### Setup Fields + Mappings

Searchkit has a CLI which helps creating a Elasticsearch schema for your documents and an example searchkit configuration to quickly get you started.

Copy the project from [indexer example](https://github.com/searchkit/searchkit/tree/next/examples/indexer)

Then within config.ts, add your own fields. Searchkit CLI will:

1. generate a Elasticsearch mapping file based on your configuration
2. Give you an example configuration for searchkit
3. Update elasticsearch with the mapping file (requires host)
4. Bulk index documents into elasticsearch (requires host, source and each field to have sourceOption path)

```javascript
withConfig({
  index: 'imdb_movies', // the elasticsearch index name
  host: "http://localhost:9200", // host url for elasticsearch
  connectionOptions: {
    apiKey: "cvdfv" // Optional. Elasticsearch apiKey for authentication. Requires write access to index
  }
  source: movies, //- Array of raw documents. Used with the field's sourceOptions. Optional
  fields: [
    {
      fieldName: 'type',  // name of field. Must be lowercase
      stored: true, // fields you want returned in the API.
      facet: true,  // If you want the value to be used as a facet
      searchable: true // If you want the field to be searchable within query
      type: 'integer' // Optional. Default is text. Can be `integer`, `date` or `float`
      sourceOptions: {
        path: 'Type' // Used in indexing step. The key for the field value source.
        transform: splitComma // Optional. To provide transformation from source to document field
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
