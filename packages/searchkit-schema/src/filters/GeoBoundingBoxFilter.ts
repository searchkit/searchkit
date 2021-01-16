import { GeoBoundingBoxFilter } from '../core/QueryManager'
import { BaseFilter } from './BaseFilter'

interface GeoBoundingBoxFilterConfig {
  identifier: string
  field: string
  label: string
  display?: 'GeoBoundingBoxFilter' | string
}

class GeoBoundingBoxFilterClass implements BaseFilter {
  public excludeOwnFilters = false

  constructor(public config: GeoBoundingBoxFilterConfig) {}
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

}

export default GeoBoundingBoxFilterClass
