import {
  createTracker,
  SearchEventInputProperties,
  SearchClickEventInputProperties,
  TrackerOptions
} from '@elastic/behavioral-analytics-javascript-tracker'
import type { InsightsEvent } from 'instantsearch.js/es/middlewares'
import type { InstantSearch } from 'instantsearch.js/es/types'

import debounce from 'lodash.debounce'
import { getDocumentAttribute, getPageAttribute, getSearchAttribute } from './attributes'

interface AnalyticsPluginOptions {
  tracker: TrackerOptions
  attributes: TrackerAttributes
}

export interface SearchClickFieldAttributes {
  titleField: string
  urlField: string
}

interface TrackerAttributes {
  searchClick?: SearchClickFieldAttributes
}

const DEBOUNCE_TIME = 500

export function AnalyticsMiddleware(options: AnalyticsPluginOptions) {
  const tracker = createTracker(options.tracker)

  return function middleware({ instantSearchInstance }: { instantSearchInstance: InstantSearch }) {
    const dispatchTrackSearch = debounce(() => {
      if (!instantSearchInstance.helper || !instantSearchInstance.helper.lastResults) return

      const searchEvent: SearchEventInputProperties = {
        search: getSearchAttribute(
          instantSearchInstance.helper?.lastResults,
          instantSearchInstance.helper?.state
        )
      }
      tracker.trackSearch(searchEvent)
    }, DEBOUNCE_TIME)

    return {
      $$type: 'ais.insights',
      $$internal: false,
      onStateChange() {
        dispatchTrackSearch()
      },
      started() {
        dispatchTrackSearch()
      },
      subscribe() {
        instantSearchInstance.sendEventToInsights = (event: InsightsEvent) => {
          if (!instantSearchInstance.helper || !instantSearchInstance.helper.lastResults) return

          const eventType = event.insightsMethod
          if (eventType === 'clickedObjectIDsAfterSearch') {
            const payload = event.payload as {
              index: string
              objectIDs: [string]
              positions: [number]
            }

            const searchClickEvent: SearchClickEventInputProperties = {
              search: getSearchAttribute(
                instantSearchInstance.helper?.lastResults,
                instantSearchInstance.helper?.state
              ),
              document: getDocumentAttribute(payload.objectIDs[0], payload.index),
              page: getPageAttribute(event.hits?.[0], options.attributes?.searchClick)
            }

            tracker.trackSearchClick(searchClickEvent)
          }
        }
      },
      unsubscribe() {
        instantSearchInstance.sendEventToInsights = () => {}
      }
    }
  }
}
