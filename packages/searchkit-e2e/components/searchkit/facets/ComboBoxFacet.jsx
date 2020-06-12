import React, { useState, useEffect } from 'react'
import {
  EuiFilterButton,
  EuiFilterGroup,
  EuiPopover,
  EuiFilterSelectItem,
  EuiPopoverTitle,
  EuiFieldSearch,
  EuiLoadingChart,
  EuiSpacer,
  EuiIcon
} from '@elastic/eui'
import { useSearchkit } from '@searchkit/client'
import { gql, useLazyQuery } from '@apollo/client'

const facetRefinementSearchQuery = gql`
  query refinementFacet(
    $facetQuery: String
    $query: String
    $filters: [FiltersSet]
    $facetId: String!
  ) {
    results(query: $query, filters: $filters) {
      facet(id: $facetId, query: $facetQuery) {
        id
        label
        entries {
          id
          label
          count
        }
      }
    }
  }
`

export const ComboBoxFacet = ({ facet }) => {
  const api = useSearchkit()

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [value, setValue] = useState('')

  const [execute, { data, loading }] = useLazyQuery(facetRefinementSearchQuery)

  useEffect(() => {
    if (value) {
      execute({
        variables: {
          facetId: facet.id,
          query: '',
          filters: [],
          facetQuery: value
        }
      })
    }
  }, [value])

  const onButtonClick = () => {
    setIsPopoverOpen(!isPopoverOpen)
  }

  const closePopover = () => {
    setIsPopoverOpen(false)
  }

  const items =
    data?.results?.facet.entries.map((entry) => {
      return { name: entry.label }
    }) || []

  const button = (
    <EuiFilterButton
      grow
      iconType="arrowRight"
      onClick={onButtonClick}
      isSelected={isPopoverOpen}
      numFilters={items.length}
      hasActiveFilters={true}
      numActiveFilters={2}
    >
      {facet.label}
    </EuiFilterButton>
  )

  return (
    <EuiFilterGroup>
      <EuiPopover
        id={`${facet.id_popover}`}
        ownFocus
        button={button}
        isOpen={isPopoverOpen}
        closePopover={closePopover}
        panelPaddingSize="none"
        withTitle
      >
        <EuiPopoverTitle>
          <EuiFieldSearch
            isLoading={loading}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </EuiPopoverTitle>
        <div className="euiFilterSelect__items">
          {items.length > 0 &&
            items.map((item, index) => (
              <EuiFilterSelectItem checked={item.checked} key={index}>
                {item.name}
              </EuiFilterSelectItem>
            ))}
          {items.length === 0 && !loading && (
            <div className="euiFilterSelect__note">
              <div className="euiFilterSelect__noteContent">
                <EuiIcon type="minusInCircle" />
                <EuiSpacer size="xs" />
                <p>No filters found</p>
              </div>
            </div>
          )}
        </div>
      </EuiPopover>
    </EuiFilterGroup>
  )
}

ComboBoxFacet.DISPLAY = 'ComboBox'
