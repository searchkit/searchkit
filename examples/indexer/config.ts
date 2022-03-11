import movies from './movies.json'
import { withConfig, toNumber, splitComma, toDate } from '@searchkit/cli'

withConfig({
  index: 'imdb_movies',
  host: 'http://localhost:9200',
  connectionOptions: {
    apiKey: 'my-api-key'
  },
  source: movies,
  fields: [
    {
      fieldName: 'type',
      stored: true,
      facet: true,
      sourceOptions: {
        path: 'Type'
      }
    },
    {
      fieldName: 'title',
      stored: true,
      searchable: true,
      sourceOptions: {
        path: 'Title'
      }
    },
    {
      fieldName: 'year',
      stored: true,
      type: 'integer',
      sourceOptions: {
        path: 'Year',
        transform: toNumber
      }
    },
    {
      fieldName: 'rated',
      stored: true,
      facet: true,
      searchable: false,
      sourceOptions: {
        path: 'Rated'
      }
    },
    {
      fieldName: 'released',
      stored: true,
      facet: true,
      searchable: false,
      type: 'date',
      sourceOptions: {
        path: 'Released',
        transform: toDate('dd MMM yyyy')
      }
    },
    {
      fieldName: 'genres',
      stored: true,
      facet: true,
      searchable: true,
      sourceOptions: {
        path: 'Genre',
        transform: splitComma
      }
    },
    {
      fieldName: 'directors',
      stored: true,
      facet: true,
      searchable: true,
      sourceOptions: {
        path: 'Director',
        transform: splitComma
      }
    },
    {
      fieldName: 'writers',
      stored: true,
      facet: true,
      searchable: true,
      sourceOptions: {
        path: 'Writer',
        transform: splitComma
      }
    },
    {
      fieldName: 'actors',
      stored: true,
      facet: true,
      searchable: true,
      sourceOptions: {
        path: 'Actors',
        transform: splitComma
      }
    },
    {
      fieldName: 'countries',
      stored: true,
      facet: true,
      searchable: true,
      sourceOptions: {
        path: 'Country',
        transform: splitComma
      }
    },
    {
      fieldName: 'plot',
      stored: true,
      searchable: true,
      sourceOptions: {
        path: 'Plot'
      }
    },
    {
      fieldName: 'poster',
      stored: true,
      sourceOptions: {
        path: 'PosterS3'
      }
    },
    {
      fieldName: 'id',
      stored: true,
      sourceOptions: {
        path: 'imdbID'
      }
    },
    {
      fieldName: 'metascore',
      stored: true,
      facet: true,
      type: 'integer',
      sourceOptions: {
        path: 'Metascore',
        transform: toNumber
      }
    },
    {
      fieldName: 'imdbrating',
      stored: false,
      facet: true,
      type: 'float',
      sourceOptions: {
        path: 'imdbRating',
        transform: (str) => {
          if (!str || parseFloat(str) === NaN) return null
          return parseFloat(str)
        }
      }
    }
  ]
})
