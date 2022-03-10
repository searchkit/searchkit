import parks from './parks.json'
import { withConfig, toNumber, splitComma, toDate } from '@searchkit/cli'

withConfig({
  index: 'us_parks',
  host: 'http://localhost:9200/',
  source: parks,
  fields: [
    {
      fieldName: 'visitors',
      stored: true,
      searchable: false,
      type: 'integer',
      sourceOptions: {
        path: 'visitors'
      }
    },
    {
      fieldName: 'acres',
      stored: true,
      searchable: false,
      type: 'integer',
      sourceOptions: {
        path: 'acres'
      }
    },
    {
      fieldName: 'world_heritage_site',
      stored: true,
      searchable: true,
      facet: true,
      sourceOptions: {
        path: 'world_heritage_site'
      }
    },
    {
      fieldName: 'image_url',
      stored: true,
      searchable: false,
      sourceOptions: {
        path: 'image_url'
      }
    },
    {
      fieldName: 'date_established',
      stored: true,
      searchable: false,
      type: 'date',
      sourceOptions: {
        path: 'date_established'
      }
    },
    {
      fieldName: 'description',
      stored: true,
      searchable: true,
      sourceOptions: {
        path: 'description'
      }
    },
    {
      fieldName: 'nps_link',
      stored: true,
      sourceOptions: {
        path: 'nps_link'
      }
    },
    {
      fieldName: 'states',
      stored: true,
      searchable: true,
      facet: true,
      sourceOptions: {
        path: 'states'
      }
    },
    {
      fieldName: 'title',
      stored: true,
      searchable: true,
      facet: true,
      sourceOptions: {
        path: 'title'
      }
    },
    {
      fieldName: 'id',
      stored: true,
      sourceOptions: {
        path: 'id'
      }
    },
    {
      fieldName: 'location',
      stored: true,
      facet: false,
      searchable: false,
      type: 'geo_point',
      sourceOptions: {
        path: 'location'
      }
    }
  ]
})
