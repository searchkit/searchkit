import { useSearchkit, useSearchkitVariables } from '@searchkit/client'
import { useEffect, useRef, useState } from 'react'
import debounce from 'debounce'
import xor from 'lodash/xor'

let map

export default ({ data }) => {

  const api = useSearchkit()
  const variables = useSearchkitVariables()
  const [markers, setMarkers] = useState([])
  const [mapIds, setMapIds] = useState([])
  const [mapGeoBounds, setMapGeoBounds] = useState(null)
  const mapRef = useRef(null)

  useEffect(() => {
    map = new google.maps.Map(mapRef.current, {
      zoom: 8,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false
    })

    const updateBoundsFilter = debounce(() => {
      const bounds = map.getBounds()
      if (bounds) {
        setMapGeoBounds(bounds)
      }
    }, 100)

    map.addListener("idle", updateBoundsFilter)

  }, [])

  useEffect(() => {

    if (!data || !map) {
      return {}
    }

    const items = data.hits.items
    const itemIds = items.map(({ id }) => id)


    if (xor(mapIds, itemIds).length === 0) {
      return {}
    }

    markers.forEach((marker) => {
      marker.setMap(null)
    })
    const bounds = new google.maps.LatLngBounds();

    const newMarkers = data.hits.items.map((hitItem) => {
      const latlng = hitItem.fields.location.split(",")
      const markerloc = new google.maps.LatLng(latlng[0], latlng[1]);
      const marker = new google.maps.Marker({
        position: markerloc,
        map: map
      })
      bounds.extend(markerloc)
      return marker
    })

    const filterGeoBounds = api.getFiltersByIdentifier("location")
    if (filterGeoBounds && filterGeoBounds[0]) {
      const x = filterGeoBounds[0].geoBoundingBox
      const filterBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(x.bottomLeft.lat, x.bottomLeft.lon),
        new google.maps.LatLng(x.topRight.lat, x.topRight.lon)
      )
      map.fitBounds(filterBounds)
    } else {
      map.fitBounds(bounds)
    }
    if (!map.getProjection()) {
      google.maps.event.trigger(map, 'ready')
    }

    setMarkers(newMarkers)
    setMapIds(itemIds)

  }, [data])

  useEffect(() => {
    if (mapGeoBounds) {
      const apiLocationFilter = api.getFiltersByIdentifier("location")
      if (apiLocationFilter.length > 0) {
        console.log("mapGeoBounds", JSON.stringify(mapGeoBounds))

        const x = apiLocationFilter[0].geoBoundingBox
        const ne = mapGeoBounds.getNorthEast()
        const sw = mapGeoBounds.getSouthWest()
        const filterBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(x.bottomLeft.lat, x.bottomLeft.lon),
          new google.maps.LatLng(x.topRight.lat, x.topRight.lon)
        )

        const boundsInMap = !(mapGeoBounds && mapGeoBounds.contains(filterBounds.getNorthEast()) && mapGeoBounds.contains(filterBounds.getSouthWest()) )
        if (boundsInMap) {
          api.removeFiltersByIdentifier("location")
          api.setPage({ from: 0, size: 10 })
          api.addFilter({
            identifier: "location",
            geoBoundingBox: {
              topRight: {
                lat: ne.lat(),
                lon: ne.lng()
              },
              bottomLeft: {
                lat: sw.lat(),
                lon: sw.lng()
              }
            }
          })

          api.search()
        }
      } else {
        const ne = mapGeoBounds.getNorthEast()
        const sw = mapGeoBounds.getSouthWest()
        api.removeFiltersByIdentifier("location")
        api.setPage({ from: 0, size: 10 })
        api.addFilter({
          identifier: "location",
          geoBoundingBox: {
            topRight: {
              lat: ne.lat(),
              lon: ne.lng()
            },
            bottomLeft: {
              lat: sw.lat(),
              lon: sw.lng()
            }
          }
        })

        api.search()
      }
    }

  }, [mapGeoBounds])

  useEffect(() => {
    const filterGeoBounds = api.getFiltersByIdentifier("location")
    if (filterGeoBounds && filterGeoBounds[0]) {
      const x = filterGeoBounds[0].geoBoundingBox
      const filterBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(x.bottomLeft.lat, x.bottomLeft.lon),
        new google.maps.LatLng(x.topRight.lat, x.topRight.lon)
      )

      if (!map.getBounds() || !filterBounds.equals(map.getBounds())) {
        setMapGeoBounds(filterBounds)
      }

    }
  }, [variables])

  return (
    <div>
      <div ref={mapRef} style={{
        height: "500px",
        width: "100%"
      }}/>
    </div>
  )
}
