import * as axios from "axios";
import {BaseQueryAccessor} from "./BaseQueryAccessor";
import {
  GeoQuery
} from "../query";
import {
  RadiusAccessor
} from "../accessors"

const isEmpty = require("lodash/isEmpty")

export interface LocationSearchOptions {
  queryField?: string
  queryRadius?: string
  title?: string
}


export class LocationAccessor extends BaseQueryAccessor {
  options: LocationSearchOptions
  cachedGeolocation: any
  cachedQuery: string
  loading: boolean

  constructor(key, options={}){
    super(key)
    this.options = options
    this.loading = false
  }

  unsetCache() {
    this.cachedGeolocation = {}
    this.cachedQuery = ""
  }

  processResponse(response) {
    this.loading = false
    let results = response.data.results
    if (results) {
      this.cachedGeolocation = results[0].geometry
      if (!isEmpty(this.cachedGeolocation)) {
        this.searchkit._search()
      }
    } else {
      this.cachedGeolocation = {}
    }
  }

  getCachedGeolocation(q: string) {
    if (!q) {
      this.unsetCache()
      return {}
    }
    if (this.cachedQuery === q) {
      return this.cachedGeolocation
    }
    this.cachedQuery = q
    this.loading = true
    let baseUrl = "http://api.opencagedata.com/geocode/v1/json?key=738821089ba8ab84d5159836bca0c004&query="
    axios.get(baseUrl + q).then(this.processResponse.bind(this))
    return {}
  }

  buildSharedQuery(query) {
    let q = (this.state.getValue() || "") + ""
    if (q && !this.loading) {
      let radius = this.searchkit.getAccessorByType(RadiusAccessor).getRadius()
      let geolocation = this.getCachedGeolocation(q)
      if (!isEmpty(geolocation)) {
        let geoFilter = GeoQuery(this.options.queryField, {
          lat: geolocation.lat,
          lon: geolocation.lng,
          distance: radius
        })
        let selectedFilter = {
          name: this.options.title,
          value: q,
          id: this.key,
          remove: () => this.state = this.state.clear()
        }
        return query.addFilter(this.key, geoFilter).addSelectedFilter(selectedFilter)
      } else {
        this.getCachedGeolocation(q)
      }
    }
    return query
  }
}
