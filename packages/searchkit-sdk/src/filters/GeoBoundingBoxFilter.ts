import isNil from 'lodash/isNil'
import omitBy from 'lodash/omitBy'
import { GeoBoundingBoxFilter } from '../core/QueryManager'
import { BaseFilter } from './BaseFilter'

interface GeoBoundingBoxFilterConfig {
  identifier: string
  field: string
  label: string
  display?: 'GeoBoundingBoxFilter' | string
}

class GeoBoundingBoxFilterClass implements BaseFilter {
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
        [this.config.field]: omitBy(
          {
            top_left: filters[0].geoBoundingBox.topLeft,
            bottom_right: filters[0].geoBoundingBox.bottomRight,
            bottom_left: filters[0].geoBoundingBox.bottomLeft,
            top_right: filters[0].geoBoundingBox.topRight
          },
          isNil
        )
      }
    }
  }

  getSelectedFilter(filterSet) {
    const c = filterSet.geoBoundingBox
    return {
      type: 'GeoBoundingBoxSelectedFilter',
      id: `${this.getIdentifier()}_${JSON.stringify(c)}`,
      identifier: this.getIdentifier(),
      label: this.getLabel(),
      topLeft: c.topLeft,
      bottomRight: c.bottomRight,
      display: this.config.display || 'GeoBoundingBoxFilter'
    }
  }
}

export default GeoBoundingBoxFilterClass
