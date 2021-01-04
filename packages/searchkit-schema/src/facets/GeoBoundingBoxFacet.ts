import { DateRangeFilter, GeoBoundingBoxFilter } from '../core/QueryManager'
import { BaseFacet } from './BaseFacet'

interface GeoBoundingBoxFacetConfig {
  identifier: string
  field: string
  label: string
  display?: 'DateRange' | string
}

class GeoBoundingBoxFacet implements BaseFacet {
  public excludeOwnFilters = false

  constructor(public config: GeoBoundingBoxFacetConfig) {}
  getLabel(): string {
    return this.config.label
  }

  getIdentifier() {
    return this.config.identifier
  }

  getFilters(filters: Array<GeoBoundingBoxFilter>) {
    return {
      geo_bounding_box: {
        [this.config.field]: {
          top_left: filters[0].geoBoundingBox.topLeft,
          bottom_right: filters[0].geoBoundingBox.bottomRight
        }
      }
    }
  }

  getAggregation() {
    return {}
  }

  getSelectedFilter(filterSet) {
    const c = filterSet.geoBoundingBox
    return {
      type: 'GeoBoundingBoxSelectedFilter',
      id: `${this.getIdentifier()}_${c.topLeft.lat}_${c.topLeft.lon}_${c.bottomRight.lat}_${
        c.bottomRight.lon
      }`,
      identifier: this.getIdentifier(),
      label: this.getLabel(),
      topLeft: c.topLeft,
      bottomRight: c.bottomRight,
      display: null
    }
  }

  transformResponse() {
    return null
  }
}

export default GeoBoundingBoxFacet
