import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import {
  addMappingES7,
  createIndices,
  dropIndices,
  getMapping,
  getSearchkitConfig,
  getSKQuickStartText,
  indexDocs
} from './lib'

export { splitComma, toNumber, toDate } from './lib'

export interface SearchkitField {
  facet?: boolean
  stored?: boolean
  fieldName: string
  searchable?: boolean
  type?: 'integer' | 'date' | 'float' | 'geo_point' | 'search_as_you_type' | string
  sourceOptions?: {
    path?: string
    transform?: (
      str: string,
      document: Record<string, unknown>
    ) => string | number | string[] | number[]
  }
}

export interface CliConfig {
  index: string
  type?: string
  host: string
  connectionOptions?: {
    apiKey?: string
  }
  source?: any
  fields: Array<SearchkitField>
}

export const withConfig = async (config: CliConfig) => {
  let mapping

  await inquirer
    .prompt({
      name: 'Generate Example Searchkit Config?',
      type: 'confirm'
    })
    .then((answers) => {
      const chosenAnswer = Object.values(answers)[0]
      if (chosenAnswer) {
        mapping = getMapping(config)

        const skConfig = getSearchkitConfig(config, mapping)
        const c = getSKQuickStartText({
          ...skConfig,
          host: config.host,
          index: config.index,
          mapping
        })
        fs.writeFileSync(path.join(process.cwd(), '/skConfig.md'), c)
      }
    })

  if (config.host) {
    await inquirer
      .prompt({
        name: 'Host detected. Destroy index and reinsert index mapping?',
        type: 'confirm'
      })
      .then(async (answers) => {
        const chosenAnswer = Object.values(answers)[0]
        if (chosenAnswer) {
          await dropIndices(config)
          await createIndices(config)
          await addMappingES7(config)
        }
      })

    if (config.source) {
      await inquirer
        .prompt({
          name: 'Source detected. Insert documents into ES host?',
          type: 'confirm'
        })
        .then(async (answers) => {
          const chosenAnswer = Object.values(answers)[0]
          if (chosenAnswer) {
            await indexDocs(config)
          }
        })
    }
  }
}
