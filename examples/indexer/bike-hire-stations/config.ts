import bikeData from './data.json'
import { withConfig, toNumber, splitComma, toDate } from '@searchkit/cli'

withConfig({
	index: 'bike_hire_stations',
	host: "http://localhost:9200/",
  source: bikeData,
  // type: 'movie',
	fields: [
    {
      fieldName: 'id',
      stored: true,
      sourceOptions: {
        path: 'id'
      }
    },
    {
      fieldName: 'name',
      stored: true,
      searchable: true,
      sourceOptions: {
        path: 'name'
      }
    },
    {
			fieldName: 'location',
			stored: true,
      facet: false,
      searchable: false,
			type: 'geo_point',
			sourceOptions: {
        path: 'latitude',
        transform: (str, doc) => {
          return `${str}, ${doc['longitude']}`
        }
			}
    }
	]
})
