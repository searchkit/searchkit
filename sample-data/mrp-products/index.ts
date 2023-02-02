import { Client } from '@elastic/elasticsearch'
const client = new Client({
  cloud: {
    id: ''
  },
  auth: {
    apiKey: ''
  }
})
const data = require('./data.json')

async function run() {
  client.indices.create({
    index: 'search-ecommerce',
    mappings: require('./mapping.json')
  })

  const bulkRequest = data.reduce((acc: any, item: any) => {
    return [
      ...acc,
      { index: { _index: 'search-ecommerce', _id: item.id } },
      {
        ...item,
        price: parseFloat(item.price),
        categories_lvl1: item.categories[0],
        categories_lvl2: item.categories[1] ? item.categories[0] + ' > ' + item.categories[1] : '',
        categories_lvl3: item.categories[2]
          ? item.categories[0] + ' > ' + item.categories[1] + ' > ' + item.categories[2]
          : ''
      }
    ]
  }, [])

  await client.bulk({ body: bulkRequest })
}

run().catch(console.log)
