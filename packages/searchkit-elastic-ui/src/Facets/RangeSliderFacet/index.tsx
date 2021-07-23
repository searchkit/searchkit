import React, { ReactText, useEffect, useState } from 'react'
import { EuiTitle, EuiDualRange, colorPalette } from '@elastic/eui'
import { useSearchkit } from '@searchkit/client'
import { useDebouncedCallback } from 'use-debounce'

export const getLevels = (entries: Array<{ label: string; count: number }>): any =>
  entries.reduce((levels, entry, index, entries) => {
    const lastLevel = levels[levels.length - 1]
    const isLast = entries.length === index + 1
    if (!lastLevel || lastLevel.max) {
      levels.push({
        min: lastLevel ? lastLevel.max : parseFloat(entry.label),
        hasResults: entry.count === 0 ? false : true
      })
    } else if (
      lastLevel &&
      !lastLevel.max &&
      ((entry.count > 0 && !lastLevel.hasResults) ||
        (entry.count === 0 && lastLevel.hasResults) ||
        (isLast && !lastLevel.max))
    ) {
      lastLevel.max = parseFloat(entry.label)
      if (!isLast) {
        levels.push({
          min: parseFloat(entry.label),
          hasResults: entry.count === 0 ? false : true
        })
      }
    }
    return levels
  }, [])

export const RangeSliderFacet = ({ facet }) => {
  const api = useSearchkit()
  const levels = getLevels(facet.entries)
  const minBoundary = levels[0].min
  const maxBoundary = levels[levels.length - 1].max
  const [dualValue, setDualValue] = useState<[ReactText, ReactText]>([minBoundary, maxBoundary])
  const selectedOptions = api.getFiltersByIdentifier(facet.identifier)
  const selectedOption = selectedOptions && selectedOptions[0]

  const debouncedCallback = useDebouncedCallback((value) => {
    api.removeFiltersByIdentifier(facet.identifier)
    api.addFilter({ identifier: facet.identifier, min: value[0], max: value[1] })
    api.search()
  }, 400)

  useEffect(() => {
    if (selectedOption) {
      setDualValue([selectedOptions[0].min, selectedOptions[0].max])
    }
  }, [selectedOption])

  return (
    <>
      <EuiTitle size="xxs">
        <h3>{facet.label}</h3>
      </EuiTitle>
      <EuiDualRange
        id={facet.identifier}
        value={dualValue}
        min={minBoundary}
        max={maxBoundary}
        onChange={(value) => {
          setDualValue(value)
          debouncedCallback.callback(value)
        }}
        levels={levels.map((level) => ({
          min: level.min,
          max: level.max,
          color: level.hasResults ? 'primary' : 'warning'
        }))}
      />
    </>
  )
}

RangeSliderFacet.DISPLAY = 'RangeSliderFacet'
