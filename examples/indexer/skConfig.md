

First setup your indices

```json
PUT /bike_hire_stations

{}

```

Then push your indices mapping file. This will define the field types within your document.

```json
PUT /bike_hire_stations/_mapping

{
  "mappings": {
    "properties": {
      "id": {
        "type": "keyword"
      },
      "name": {
        "type": "text"
      },
      "location": {
        "type": "geo_point"
      }
    }
  }
}
```

Then setup Searchkit. Below is a configuration based on your settings.

See API Setup documentation on https://searchkit.co/docs/quick-start/api-setup

```javascript
  const searchkitConfig = {
    host: 'http://localhost:9200/',
    index: 'bike_hire_stations',
    hits: {
      fields: ['id','name','location']
    },
    sortOptions: [
      { id: 'relevance', label: "Relevance", field: [{"_score": "desc"}], defaultOption: true}
    ],
    query: new MultiMatchQuery({ fields: ['name'] }),
    facets: [
      
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
  id: String
  name: String
  location: String
  
}
```

  