import React, { useEffect, useState } from 'react'
import { EuiTitle, EuiDualRange } from '@elastic/eui'
import { useSearchkit } from '@searchkit/client'
import { useDebouncedCallback } from 'use-debounce'

export const getLevels = (entries) => {
  const counts = entries.reduce((sum, entry) => {
    if (entry.count > 0) {
      return [...sum, parseInt(entry.label)]
    }
    return sum
  }, [])
  if (counts.length > 0) {
    return { min: Math.min(...counts), max: Math.max(...counts) }
  }
  return { min: 0, max: 0 }
}

export const RangeSliderFacet = ({ facet }) => {
  const api = useSearchkit()
  const [dualValue, setDualValue] = useState([0, 100])
  const selectedOptions = api.getFiltersById(facet.id)
  const selectedOption = selectedOptions && selectedOptions[0]

  const [debouncedCallback] = useDebouncedCallback((value) => {
    api.removeFiltersById(facet.id)
    api.addFilter({ id: facet.id, min: value[0], max: value[1] })
    api.search()
  }, 400)

  useEffect(() => {
    if (selectedOption) {
      setDualValue([selectedOptions[0].min, selectedOptions[0].max])
    }
  }, [selectedOption])

  const range = getLevels(facet.entries)

  const levels = [
    {
      min: 0,
      max: range.min,
      color: 'warning'
    },
    {
      min: range.min,
      max: range.max,
      color: 'primary'
    },
    {
      min: range.max,
      max: 100,
      color: 'warning'
    }
  ]

  return (
    <>
      <EuiTitle size="xxs">
        <h3>{facet.label}</h3>
      </EuiTitle>
      <EuiDualRange
        id={facet.id}
        value={dualValue}
        onChange={(value) => {
          setDualValue(value)
          debouncedCallback(value)
        }}
        levels={levels}
      />
    </>
  )
}

RangeSliderFacet.DISPLAY = 'RangeSlider'
