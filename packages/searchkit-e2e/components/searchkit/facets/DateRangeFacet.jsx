import React, { useState, useEffect } from 'react'
import { EuiTitle, EuiDatePickerRange, EuiDatePicker } from '@elastic/eui'
import { useSearchkit } from '@searchkit/client'

export const DateRangeFacet = ({ facet, loading }) => {
  const api = useSearchkit()
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  useEffect(() => {
    if (startDate && endDate) {
      console.log(startDate, endDate)
      api.setFilter({ id: facet.id, dateMin: startDate, dateMax: endDate })
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
