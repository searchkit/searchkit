import { Hit, InstantSearch } from 'instantsearch.js'
import { AnalyticsMiddleware } from '../src/index'
import { lastResults, state } from './mocks'

jest.mock('@elastic/behavioral-analytics-javascript-tracker', () => ({
  createTracker: jest.fn().mockReturnValue({
    trackSearchClick: jest.fn(),
    trackSearch: jest.fn()
  })
}))

jest.useFakeTimers()

import { createTracker } from '@elastic/behavioral-analytics-javascript-tracker'

describe('AnalyticsMiddleware', () => {
  let mockInstantsearchInstance: InstantSearch
  let middleware: ReturnType<typeof AnalyticsMiddleware>

  beforeEach(() => {
    jest.clearAllMocks()

    middleware = AnalyticsMiddleware({
      tracker: {
        apiKey: 'apiKey',
        collectionName: 'collectionName',
        endpoint: 'endpoint'
      },
      attributes: {
        searchClick: {
          titleField: 'title',
          urlField: 'url'
        }
      }
    })

    mockInstantsearchInstance = {
      sendEventToInsights: null,
      helper: {
        lastResults,
        state
      }
    } as unknown as InstantSearch
  })

  it('should return middleware', () => {
    const instance = middleware({ instantSearchInstance: mockInstantsearchInstance })

    instance.subscribe()

    expect(createTracker).toHaveBeenCalledWith({
      apiKey: 'apiKey',
      collectionName: 'collectionName',
      endpoint: 'endpoint'
    })
  })

  it('should track search click', () => {
    const instance = middleware({ instantSearchInstance: mockInstantsearchInstance })
    instance.subscribe()

    expect(mockInstantsearchInstance.sendEventToInsights).toBeInstanceOf(Function)
    mockInstantsearchInstance.sendEventToInsights({
      insightsMethod: 'clickedObjectIDsAfterSearch',
      payload: {
        index: 'index',
        objectIDs: ['1'],
        positions: [1]
      },
      hits: [
        {
          title: 'title',
          url: 'url'
        } as unknown as Hit
      ],
      widgetType: 'widgetType',
      eventType: 'eventType'
    })

    const tracker = (createTracker as jest.Mock).mock.results[0].value as ReturnType<
      typeof createTracker
    >

    expect(tracker.trackSearchClick).toHaveBeenCalledWith({
      document: { id: '1', index: 'index' },
      page: {
        title: 'title',
        url: 'url'
      },
      search: {
        filters: {
          brand: ['Apple', 'Samsung'],
          metascore: '*-4',
          price: '100-1000',
          rating: '4-*'
        },
        page: { current: 1, size: 20 },
        query: 'iphone',
        results: { items: [], total_results: 100 }
      }
    })
  })

  it('should track search', () => {
    const instance = middleware({ instantSearchInstance: mockInstantsearchInstance })
    instance.subscribe()

    const tracker = (createTracker as jest.Mock).mock.results[0].value as ReturnType<
      typeof createTracker
    >

    instance.onStateChange()
    instance.onStateChange()
    instance.onStateChange()
    jest.advanceTimersByTime(400)

    expect(tracker.trackSearch).toHaveBeenCalledTimes(0)

    jest.advanceTimersByTime(100)

    expect(tracker.trackSearch).toHaveBeenCalledWith({
      search: {
        filters: {
          brand: ['Apple', 'Samsung'],
          metascore: '*-4',
          price: '100-1000',
          rating: '4-*'
        },
        page: { current: 1, size: 20 },
        query: 'iphone',
        results: { items: [], total_results: 100 }
      }
    })

    expect(tracker.trackSearch).toHaveBeenCalledTimes(1)
  })
})
