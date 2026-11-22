/**
 * Engine-neutral filter AST.
 *
 * Searchkit parses the filters InstantSearch sends (`facetFilters`, `numericFilters`, `filters`,
 * geo params) and query rule `QueryFilter` / `QueryBoost` strings into these nodes. Adapters
 * compile them into their own query language.
 *
 * Nodes carry the InstantSearch **attribute**; each adapter resolves it to its configured `field`
 * when compiling (see `getFacetFilterMap`).
 */

export type FilterAndNode = { op: 'and'; nodes: FilterNode[] }

export type FilterOrNode = { op: 'or'; nodes: FilterNode[] }

export type FilterNotNode = { op: 'not'; node: FilterNode }

export type FilterEqNode = {
  op: 'eq'
  attribute: string
  value: string | number | boolean
  /** The value exactly as written in the request, for adapters that pass values through as text */
  raw?: string
}

export type FilterInNode = { op: 'in'; attribute: string; values: (string | number)[] }

export type FilterRangeBounds = {
  gte?: string
  gt?: string
  lte?: string
  lt?: string
}

export type FilterRangeNode = {
  op: 'range'
  attribute: string
  /** Bounds are numbers, or strings when they are not numeric (e.g. dates in a `filters` range) */
  gte?: number | string
  gt?: number | string
  lte?: number | string
  lt?: number | string
  /** The bounds exactly as written in the request, for adapters that pass values through as text */
  raw?: FilterRangeBounds
}

export type FilterGeoDistanceNode = {
  op: 'geo_distance'
  attribute: string
  lat: number
  lng: number
  /** `aroundRadius` (meters) or `'all'`; undefined when the request did not set one */
  radius?: number | 'all'
  /** The coordinates exactly as written in `aroundLatLng` */
  raw?: { lat?: string; lng?: string }
}

export type FilterGeoBoundingBoxNode = {
  op: 'geo_bbox'
  attribute: string
  /** `[top, left, bottom, right]`, as in InstantSearch's `insideBoundingBox` */
  box: [number, number, number, number]
}

export type FilterExistsNode = { op: 'exists'; attribute: string }

export type FilterNode =
  | FilterAndNode
  | FilterOrNode
  | FilterNotNode
  | FilterEqNode
  | FilterInNode
  | FilterRangeNode
  | FilterGeoDistanceNode
  | FilterGeoBoundingBoxNode
  | FilterExistsNode
