import { Client } from '@elastic/elasticsearch'
const client = new Client({
  // credentials
})
const data = require('./docs.json')

async function run() {
  client.indices.create({
    index: 'search-camping-sites',
    mappings: require('./mapping.json')
  })

  const bulkRequest = data.reduce((acc: any, item: any) => {
    const { _id, ...rest } = item
    return [...acc, { index: { _index: 'search-camping-sites', _id: _id } }, rest]
  }, [])

  await client.bulk({ body: bulkRequest })
}

run().catch(console.log)
