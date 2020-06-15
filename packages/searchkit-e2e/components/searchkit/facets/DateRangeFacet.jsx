import React, { useState, useEffect } from 'react'
import { EuiTitle, EuiDatePickerRange, EuiDatePicker } from '@elastic/eui'
import { useSearchkit } from '@searchkit/client'

export const DateRangeFacet = ({ facet, loading }) => {
  const api = useSearchkit()
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const selectedOptions = api.getFiltersById(facet.id)
  const selectedOption = selectedOptions && selectedOptions[0]

  useEffect(() => {
    if (startDate && endDate) {
      if (selectedOption) {
        api.removeFilter(selectedOption)
      }

      api.addFilter({ id: facet.id, dateMin: startDate, dateMax: endDate })
      api.search()
    }
  }, [startDate, endDate])

  return (
    <>
      <EuiTitle size="xxs">
        <h3>{facet.label}</h3>
      </EuiTitle>
      <EuiDatePickerRange
        startDateControl={
          <EuiDatePicker
            selected={startDate}
            onChange={setStartDate}
            startDate={startDate}
            value={selectedOption && selectedOption.dateMin}
            endDate={endDate}
            placeholder="from"
            isInvalid={startDate > endDate}
            aria-label="Start date"
          />
        }
        endDateControl={
          <EuiDatePicker
            selected={endDate}
            onChange={setEndDate}
            startDate={startDate}
            value={selectedOption && selectedOption.dateMax}
            endDate={endDate}
            isInvalid={startDate > endDate}
            aria-label="End date"
            placeholder="to"
          />
        }
      />
    </>
  )
}

DateRangeFacet.DISPLAY = 'DateRange'
