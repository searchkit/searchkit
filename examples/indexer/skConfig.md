

First setup your indices

```json
PUT /us_parks

{}

```

Then push your indices mapping file. This will define the field types within your document.

```json
PUT /us_parks/_mapping

{
  "mappings": {
    "properties": {
      "description": {
        "type": "text"
      },
      "nps_link": {
        "type": "keyword"
      },
      "states": {
        "type": "keyword"
      },
      "title": {
        "type": "text"
      },
      "id": {
        "type": "keyword"
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
    index: 'us_parks',
    hits: {
      fields: ['description','nps_link','states','title','id','location']
    },
    sortOptions: [
      { id: 'relevance', label: "Relevance", field: [{"_score": "desc"}], defaultOption: true}
    ],
    query: new MultiMatchQuery({ fields: ['description','title'] }),
    facets: [
      
      new RefinementSelectFacet({
        field: 'states',
        identifier: 'states',
        label: 'states'
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
  description: String
  nps_link: String
  states: String
  title: String
  id: String
  location: String
  
}
```

  