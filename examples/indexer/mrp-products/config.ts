import mrpProducts from './data.json'
import { withConfig, toNumber, splitComma, toDate } from '@searchkit/cli'

withConfig({
	index: 'mrp-products',
	host: "http://localhost:9200/",
  source: mrpProducts,
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
			fieldName: 'designerName',
			stored: true,
      facet: true,
      searchable: true,
			sourceOptions: {
        path: 'designerName'
			}
    },
    {
			fieldName: 'imageURL',
			stored: true,
      facet: false,
      searchable: false,
			sourceOptions: {
        path: 'imageURL'
			}
    },
    {
			fieldName: 'price',
			stored: true,
      facet: false,
      searchable: false,
      type: 'integer',
			sourceOptions: {
        path: 'price'
			}
    },
    {
			fieldName: 'colour',
			stored: true,
      facet: true,
      searchable: true,
			sourceOptions: {
        path: 'colour'
			}
    },
    {
			fieldName: 'sizes',
			stored: true,
      facet: true,
      searchable: true,
			sourceOptions: {
        path: 'sizes'
			}
    },
    {
			fieldName: 'category_lvl1',
			stored: true,
      facet: true,
      searchable: true,
			sourceOptions: {
        path: 'categories',
        transform: (str, doc) => {
          return str[0]
        }
			}
    },
    {
			fieldName: 'category_lvl2',
			stored: true,
      facet: true,
      searchable: true,
			sourceOptions: {
        path: 'categories',
        transform: (str, doc) => {
          return str[1]
        }
			}
    },
    {
			fieldName: 'category_lvl3',
			stored: true,
      facet: true,
      searchable: true,
			sourceOptions: {
        path: 'categories',
        transform: (str, doc) => {
          return str[2]
        }
			}
    }
	]
})
