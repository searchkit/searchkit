export interface GeoQueryOptions {
  distance?: string
  lat: number
  lon: number
}

export function GeoQuery(key, options: GeoQueryOptions){
  return {
    geo_distance: {
      distance: options.distance,
      [key]: {
        lat: options.lat,
        lon: options.lon
      }
    }
  }
}
