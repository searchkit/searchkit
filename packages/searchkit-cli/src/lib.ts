import { Client } from '@elastic/elasticsearch'
import flatMap from 'lodash/flatMap'
import parse from 'date-fns/parse'
import formatISO from 'date-fns/formatISO'

export const splitComma = (str) => (str ? str.split(',').map((a) => a.trim()) : [])
export const toNumber = (str) => {
  if (!str) return undefined
  return Number(str.replace(/\D+/g, ''))
}
export const toDate = (format) => (str) => {
  if (!str) return null
  try {
    return formatISO(parse(str, format, new Date()))
  } catch (e) {
    throw new Error(str + 'incorrect time date value')
  }
}

export const transformDefinitionField = (field) => {
  const subFields = []

  if (field.type) {
    subFields.push({
      type: field.type
    })
  } else if (field.searchable) {
    subFields.push({
      type: 'text'
    })
  } else if (field.stored) {
    subFields.push({
      type: 'keyword'
    })
  }

  if (field.facet && subFields[0].type === 'text') {
    subFields.push({
      name: 'keyword',
      type: 'keyword'
    })
  }

  if (subFields.length === 1) {
    return {
      [field.fieldName]: {
        type: subFields[0].type
      }
    }
  }
  const [primaryField, ...secondaryFields] = subFields
  return {
    [field.fieldName]: {
      type: primaryField.type,
      fields: secondaryFields.reduce(
        (sum, a) => ({
          ...sum,
          [a.name]: { type: a.name }
        }),
        {}
      )
    }
  }
}

export const dropIndices = async (config) => {
  const client = new Client({
    node: config.host,
    auth: {
      apiKey: config.connectionOptions?.apiKey
    }
  })

  try {
    await client.indices.delete({ index: config.index })
  } catch (e) {}
}

export const createIndices = async (config) => {
  const client = new Client({
    node: config.host,
    auth: {
      apiKey: config.connectionOptions?.apiKey
    }
  })

  try {
    await client.indices.create({ index: config.index })
  } catch (e) {
    throw new Error('Could not create indices. Might of failed to delete Indices.')
  }
}

export const getMapping = (config) => {
  const fieldMappings = config.fields.map(transformDefinitionField)
  return fieldMappings.reduce(
    (sum, field) => ({
      ...sum,
      ...field
    }),
    {}
  )
}

export const addMappingES7 = async (config) => {
  const client = new Client({
    node: config.host,
    auth: {
      apiKey: config.connectionOptions?.apiKey
    }
  })

  try {
    await client.indices.putMapping({
      index: config.index,
      body: {
        properties: getMapping(config)
      }
    })
  } catch (e) {
    throw new Error('could not put field mapping')
  }
}

export const getDocs = (config) => {
  if (config.source) {
    return config.source.map((doc) =>
      config.fields
        .map((field) => {
          const value = field.sourceOptions ? doc[field.sourceOptions.path] : null
          return {
            [field.fieldName]: field.sourceOptions?.transform
              ? field.sourceOptions.transform(value, doc)
              : value
          }
        })
        .reduce(
          (sum, value) => ({
            ...sum,
            ...value
          }),
          {}
        )
    )
  }
}

export const indexDocs = async (config) => {
  const client = new Client({
    node: config.host,
    auth: {
      apiKey: config.connectionOptions?.apiKey
    }
  })
  const docs = await getDocs(config)
  try {
    const cmds = flatMap(docs, (doc) => [
      { index: { _index: config.index, _id: doc.id, _type: config.type } },
      doc
    ])
    await client.bulk({
      body: cmds,
      refresh: true
    })
  } catch (e) {
    throw new Error('Could not index documents')
  }
}

const getSubFieldType = (fields, types: Array<string>) => {
  const key = Object.keys(fields).find((key) => types.includes(fields[key].type))
  return {
    subFieldKey: key,
    subFieldType: fields[key].type
  }
}

export const getSearchkitConfig = (config, mapping) => {
  const storedFields = config.fields.filter((f) => f.stored).map((f) => f.fieldName)
  const searchableFields = config.fields
    .filter((f) => f.searchable)
    .map((f) => {
      const fieldMapping = mapping[f.fieldName]
      if (fieldMapping.type === 'text') {
        return f.fieldName
      }
      const textFieldKey = getSubFieldType(fieldMapping.fields, ['text'])
      return `${f.fieldName}.${textFieldKey}`
    })
  const facetFields = config.fields
    .filter((f) => f.facet)
    .map((f) => {
      const fieldMapping = mapping[f.fieldName]
      let field = ''
      let fieldType = ''
      if (['keyword', 'integer', 'date', 'float', 'geo_point'].includes(fieldMapping.type)) {
        field = f.fieldName
        fieldType = fieldMapping.type
      } else {
        const { subFieldKey, subFieldType } = getSubFieldType(fieldMapping.fields, [
          'keyword',
          'integer',
          'float',
          'date',
          'geo_point'
        ])
        field = `${f.fieldName}.${subFieldKey}`
        fieldType = subFieldType
      }

      if (fieldType === 'keyword') {
        return {
          fieldType: 'refinement',
          field: field,
          identifier: f.fieldName,
          label: f.fieldName
        }
      } else if (fieldType === 'date') {
        return { fieldType: 'dateRange', field: field, identifier: f.fieldName, label: f.fieldName }
      } else if (['integer', 'float'].includes(fieldType)) {
        return {
          fieldType: 'numericRange',
          field: field,
          identifier: f.fieldName,
          label: f.fieldName
        }
      }
      return null
    })
  return {
    searchableFields,
    facetFields,
    storedFields
  }
}

export const getSKQuickStartText = ({
  searchableFields,
  facetFields,
  storedFields,
  host,
  index,
  mapping
}) => {
  const mappingCall = {
    properties: mapping
  }

  return `

First setup your indices

\`\`\`json
PUT /${index}

{}

\`\`\`

Then push your indices mapping file. This will define the field types within your document.

\`\`\`json
PUT /${index}/_mapping

${JSON.stringify(mappingCall, null, 2)}
\`\`\`

Then setup Searchkit. Below is a configuration based on your settings.

See API Setup documentation on https://searchkit.co/docs/quick-start/api-setup

\`\`\`javascript
  const searchkitConfig = {
    host: '${host}',
    index: '${index}',
    hits: {
      fields: [${storedFields.map((f) => `'${f}'`).join(',')}]
    },
    sortOptions: [
      { id: 'relevance', label: "Relevance", field: [{"_score": "desc"}], defaultOption: true}
    ],
    query: new MultiMatchQuery({ fields: [${searchableFields.map((f) => `'${f}'`).join(',')}] }),
    facets: [
      ${facetFields
        .map((f) => {
          if (f.fieldType === 'refinement') {
            return `
      new RefinementSelectFacet({
        field: '${f.field}',
        identifier: '${f.label}',
        label: '${f.label}'
      }),
          `
          } else if (f.fieldType === 'dateRange') {
            return `
      new DateRangeFacet({
        field: '${f.field}',
        identifier: '${f.label}',
        label: '${f.label}'
      }),
          `
          } else if (f.fieldType === 'numericRange') {
            return `
      new RangeFacet({
        field: '${f.field}',
        identifier: '${f.label}',
        label: '${f.label}'
        range: {
          min: <MIN>,
          max: <MAX>,
          interval: <internal>
        }
      }),
          `
          }
        })
        .join(``)}
    ]
  }
\`\`\`

and update the graphql schema hitFields type. Each field type is declared as a string but you may need to update the field depending on how its stored in elasticsearch. It may be:
- a date
- an array of strings
- a number

\`\`\`gql

type ResultHit implements SKHit {
  id: ID!
  fields: HitFields
}

type HitFields {
  ${storedFields
    .map(
      (f) => `${f}: String
  `
    )
    .join('')}
}
\`\`\`

  `
}
