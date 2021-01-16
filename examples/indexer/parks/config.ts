import parks from './parks.json'
import { withConfig, toNumber, splitComma, toDate } from '@searchkit/cli'

withConfig({
	index: 'us_parks',
	host: "http://localhost:9200/",
  source: parks,
  // type: 'movie',
	fields: [
		{
			fieldName: 'description',
      stored: true,
      searchable:true,
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
      facet:true,
			sourceOptions: {
        path: 'states'
			}
		},
    {
      fieldName: 'title',
      stored: true,
      searchable: true,
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
