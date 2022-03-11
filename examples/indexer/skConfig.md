

First setup your indices

```json
PUT /imdb_movies

{}

```

Then push your indices mapping file. This will define the field types within your document.

```json
PUT /imdb_movies/_mapping

{
  "properties": {
    "type": {
      "type": "keyword"
    },
    "title": {
      "type": "text"
    },
    "year": {
      "type": "integer"
    },
    "rated": {
      "type": "keyword"
    },
    "released": {
      "type": "date"
    },
    "genres": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    },
    "directors": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    },
    "writers": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    },
    "actors": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    },
    "countries": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword"
        }
      }
    },
    "plot": {
      "type": "text"
    },
    "poster": {
      "type": "keyword"
    },
    "id": {
      "type": "keyword"
    },
    "metascore": {
      "type": "integer"
    },
    "imdbrating": {
      "type": "float"
    }
  }
}
```

Then setup Searchkit. Below is a configuration based on your settings.

See API Setup documentation on https://searchkit.co/docs/quick-start/api-setup

```javascript
  const searchkitConfig = {
    host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
    index: 'imdb_movies',
    hits: {
      fields: ['type','title','year','rated','released','genres','directors','writers','actors','countries','plot','poster','id','metascore']
    },
    sortOptions: [
      { id: 'relevance', label: "Relevance", field: [{"_score": "desc"}], defaultOption: true}
    ],
    query: new MultiMatchQuery({ fields: ['title','genres','directors','writers','actors','countries','plot'] }),
    facets: [
      
      new RefinementSelectFacet({
        field: 'type',
        identifier: 'type',
        label: 'type'
      }),
          
      new RefinementSelectFacet({
        field: 'rated',
        identifier: 'rated',
        label: 'rated'
      }),
          
      new DateRangeFacet({
        field: 'released',
        identifier: 'released',
        label: 'released'
      }),
          
      new RefinementSelectFacet({
        field: 'genres.keyword',
        identifier: 'genres',
        label: 'genres'
      }),
          
      new RefinementSelectFacet({
        field: 'directors.keyword',
        identifier: 'directors',
        label: 'directors'
      }),
          
      new RefinementSelectFacet({
        field: 'writers.keyword',
        identifier: 'writers',
        label: 'writers'
      }),
          
      new RefinementSelectFacet({
        field: 'actors.keyword',
        identifier: 'actors',
        label: 'actors'
      }),
          
      new RefinementSelectFacet({
        field: 'countries.keyword',
        identifier: 'countries',
        label: 'countries'
      }),
          
      new RangeFacet({
        field: 'metascore',
        identifier: 'metascore',
        label: 'metascore'
        range: {
          min: <MIN>,
          max: <MAX>,
          interval: <internal>
        }
      }),
          
      new RangeFacet({
        field: 'imdbrating',
        identifier: 'imdbrating',
        label: 'imdbrating'
        range: {
          min: <MIN>,
          max: <MAX>,
          interval: <internal>
        }
      }),
          
    ]
  }
```

and update the graphql schema hitFields type. Each field type is declared as a string but you may need to update the field depending on how its stored in elasticsearch. It may be:
- a date
- an array of strings
- a number

```gql

type ResultHit implements SKHit {
  id: ID!
  fields: HitFields
}

type HitFields {
  type: String
  title: String
  year: String
  rated: String
  released: String
  genres: String
  directors: String
  writers: String
  actors: String
  countries: String
  plot: String
  poster: String
  id: String
  metascore: String
  
}
```

  