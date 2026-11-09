import { useEffect, useRef, useState } from 'react'
import { useGeoSearch } from 'react-instantsearch'

// Loads the Google Maps JavaScript API once per page.
let googleMapsPromise = null
function loadGoogleMaps(apiKey, endpoint) {
  if (window.google?.maps) return Promise.resolve(window.google)
  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `${endpoint}&key=${apiKey}`
      script.async = true
      script.onload = () => resolve(window.google)
      script.onerror = () => {
        googleMapsPromise = null
        reject(new Error('Failed to load Google Maps'))
      }
      document.head.appendChild(script)
    })
  }
  return googleMapsPromise
}

// Renders a Google map whose markers are the geo hits of the current InstantSearch index.
// Moving the map refines the results to the visible bounds.
export default function GeoMap({ apiKey, endpoint, height = 500 }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  // The map fires `idle` after our own moves (creating the map, fitting bounds). Those must not
  // refine the results, or every later search would look like a map move.
  const ignoreIdleRef = useRef(true)
  const [google, setGoogle] = useState(null)
  const { items, refine, isRefinedWithMap } = useGeoSearch({})

  const refineRef = useRef(refine)
  refineRef.current = refine
  const isRefinedWithMapRef = useRef(isRefinedWithMap)
  isRefinedWithMapRef.current = isRefinedWithMap

  useEffect(() => {
    let cancelled = false
    loadGoogleMaps(apiKey, endpoint)
      .then((g) => {
        if (!cancelled) setGoogle(g)
      })
      .catch((error) => console.error(error))
    return () => {
      cancelled = true
    }
  }, [apiKey, endpoint])

  useEffect(() => {
    if (!google || mapRef.current || !containerRef.current) return
    const map = new google.maps.Map(containerRef.current, {
      center: { lat: 0, lng: 0 },
      zoom: 3,
    })
    map.addListener('idle', () => {
      if (ignoreIdleRef.current) {
        ignoreIdleRef.current = false
        return
      }
      const bounds = map.getBounds()
      if (!bounds) return
      const ne = bounds.getNorthEast()
      const sw = bounds.getSouthWest()
      refineRef.current({
        northEast: { lat: ne.lat(), lng: ne.lng() },
        southWest: { lat: sw.lat(), lng: sw.lng() },
      })
    })
    mapRef.current = map
  }, [google])

  useEffect(() => {
    if (!google || !mapRef.current) return
    markersRef.current.forEach((marker) => marker.setMap(null))
    const geoHits = items.filter((hit) => hit._geoloc)
    markersRef.current = geoHits.map(
      (hit) =>
        new google.maps.Marker({
          position: { lat: hit._geoloc.lat, lng: hit._geoloc.lng },
          map: mapRef.current,
          title: hit.title || hit.name,
        })
    )
    // Fit the map to the results when they change for a non-map reason (a search or filter).
    // When the user moved the map, the results are refined to the map's bounds, so keep the view.
    if (!isRefinedWithMapRef.current() && geoHits.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      geoHits.forEach((hit) =>
        bounds.extend({ lat: hit._geoloc.lat, lng: hit._geoloc.lng })
      )
      ignoreIdleRef.current = true
      mapRef.current.fitBounds(bounds)
    }
  }, [google, items])

  return <div ref={containerRef} style={{ height }} />
}
