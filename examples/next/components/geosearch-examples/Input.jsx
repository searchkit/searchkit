import { EuiComboBox } from '@elastic/eui'
import { useState, useEffect } from 'react'
import { useSearchkit } from '@searchkit/client'

const Input = () => {

  const api = useSearchkit()

  const [sessionId] = useState((new Date()).getTime())
  const autocompletePlaces = new google.maps.places.AutocompleteService()
  const geoCoder = new google.maps.Geocoder()

  const [suggestions, setSuggestions] = useState([])
  const [selected, setSelected] = useState([])
  const [query, setQuery] = useState("")

  const [isLoading, setLoading] = useState(false)

  const onInputChange = async (searchValue) => {

    const query = searchValue.trim().toLowerCase()
    setQuery(query)

    if (!query || query.length < 3) {
      setSuggestions([])
      setLoading(false)
      return false
    }

    setLoading(true)

    autocompletePlaces.getPlacePredictions(
      { input: query, types: ["geocode"], sessiontoken: sessionId },
      (results) => {
        const suggestions = results.map((result) => {
          return {
            key: result.place_id,
            label: `${result.structured_formatting.main_text} (${result.structured_formatting.secondary_text})`
          }
        })
        setSuggestions(suggestions)
        setLoading(false)
      }
    )

  }

  useEffect(async () => {

    if (selected && selected.length === 1) {

      geoCoder.geocode({
        placeId: selected[0].key
      }, (places) => {
        const resultBounds = new google.maps.LatLngBounds(
          places[0].geometry.viewport.getSouthWest(),
          places[0].geometry.viewport.getNorthEast()
        );
        const topRightCord = resultBounds.getNorthEast()
        const bottomLeftCord = resultBounds.getSouthWest()

        api.filters = []
        api.addFilter({
          identifier: "location",
          geoBoundingBox: {
            topRight: {
              lat: topRightCord.lat(),
              lon: topRightCord.lng()
            },
            bottomLeft: {
              lat: bottomLeftCord.lat(),
              lon: bottomLeftCord.lng()
            }
          }
        })
        api.search()
      })
    }

  }, [selected])

  const onChange = (selected) => {
    setSelected(selected)
    if (selected || selected.length === 0) {
      api.removeFiltersByIdentifier('location')
      api.search()
    }
    setQuery("")
  }

  return (
    <EuiComboBox
      placeholder="Search for place"
      async
      selectedOptions={selected}
      options={suggestions}
      onChange={onChange}
      onSearchChange={onInputChange}
      isLoading={isLoading}
      singleSelection={ {asPlainText: true} }
      fullWidth
      noSuggestions={query.length < 3}
      />
  )
}

export default Input
