import type {
  ConfigConnection,
  SearchAdapter,
  SearchSettingsConfig,
  Transporter
} from '@searchkit/core'

export interface SearchkitConfig {
  /**
   * @description The search engine adapter, e.g. `ElasticsearchAdapter({ host })`. Takes precedence over `connection`.
   */
  adapter?: SearchAdapter<any, any>
  /**
   * @description The Elasticsearch connection, or a custom Elasticsearch `Transporter` (an object with an `msearch` method). Shorthand for `adapter: ElasticsearchAdapter(connection)`; ignored when `adapter` is set.
   */
  connection?: ConfigConnection | Transporter
  search_settings: SearchSettingsConfig
}
