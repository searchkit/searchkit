import qs from 'qs'

export type RouteState = {
  [stateKey: string]: any
}

export type Router = {
  /**
   * onUpdate Sets an event listener that is triggered when the storage is updated.
   * The function should accept a callback to trigger when the update happens.
   * In the case of the history / URL in a browser, the callback will be called
   * by `onPopState`.
   */
  onUpdate(callback: (route: RouteState) => void): void

  /**
   * Reads the storage and gets a route object. It does not take parameters,
   * and should return an object
   */
  read(): RouteState

  /**
   * Pushes a route object into a storage. Takes the UI state mapped by the state
   * mapping configured in the mapping
   */
  write(route: RouteState): void

  /**
   * Transforms a route object into a URL. It receives an object and should
   * return a string. It may return an empty string.
   */
  createURL(state: RouteState): string

  /**
   * Called when InstantSearch is disposed. Used to remove subscriptions.
   */
  dispose(): void
}

type CreateURL = ({
  qsModule,
  routeState,
  location
}: {
  qsModule: typeof qs
  routeState: RouteState
  location: Location
}) => string

type ParseURL = ({ qsModule, location }: { qsModule: typeof qs; location: Location }) => RouteState

type BrowserHistoryArgs = {
  windowTitle?: (routeState: RouteState) => string
  writeDelay?: number
  createURL?: CreateURL
  parseURL?: ParseURL
}

const defaultCreateURL: CreateURL = ({ qsModule, routeState, location }) => {
  const { protocol, hostname, port = '', pathname, hash } = location
  const queryString = qsModule.stringify(routeState)
  const portWithPrefix = port === '' ? '' : `:${port}`

  // IE <= 11 has no proper `location.origin` so we cannot rely on it.
  if (!queryString) {
    return `${protocol}//${hostname}${portWithPrefix}${pathname}${hash}`
  }

  return `${protocol}//${hostname}${portWithPrefix}${pathname}?${queryString}${hash}`
}

const defaultParseURL: ParseURL = ({ qsModule, location }) =>
  qsModule.parse(location.search.slice(1), { arrayLimit: 99 })

const setWindowTitle = (title?: string): void => {
  if (title) {
    window.document.title = title
  }
}

class BrowserHistory implements Router {
  /**
   * Transforms a UI state into a title for the page.
   */
  private readonly windowTitle?: BrowserHistoryArgs['windowTitle']
  /**
   * Time in milliseconds before performing a write in the history.
   * It prevents from adding too many entries in the history and
   * makes the back button more usable.
   *
   * @default 400
   */
  private readonly writeDelay: Required<BrowserHistoryArgs>['writeDelay']
  /**
   * Creates a full URL based on the route state.
   * The storage adaptor maps all syncable keys to the query string of the URL.
   */
  private readonly _createURL: Required<BrowserHistoryArgs>['createURL']
  /**
   * Parses the URL into a route state.
   * It should be symetrical to `createURL`.
   */
  private readonly parseURL: Required<BrowserHistoryArgs>['parseURL']

  private writeTimer?: number
  private _onPopState?(event: PopStateEvent): void

  /**
   * Initializes a new storage provider that syncs the search state to the URL
   * using web APIs (`window.location.pushState` and `onpopstate` event).
   */
  public constructor(
    {
      windowTitle,
      writeDelay = 400,
      createURL = defaultCreateURL,
      parseURL = defaultParseURL
    }: BrowserHistoryArgs = {} as BrowserHistoryArgs
  ) {
    this.windowTitle = windowTitle
    this.writeTimer = undefined
    this.writeDelay = writeDelay
    this._createURL = createURL
    this.parseURL = parseURL

    const title = this.windowTitle && this.windowTitle(this.read())

    setWindowTitle(title)
  }

  /**
   * Reads the URL and returns a syncable UI search state.
   */
  public read(): RouteState {
    return this.parseURL({ qsModule: qs, location: window.location })
  }

  /**
   * Pushes a search state into the URL.
   */
  public write(routeState: RouteState): void {
    const url = this.createURL(routeState)
    const title = this.windowTitle && this.windowTitle(routeState)

    if (this.writeTimer) {
      window.clearTimeout(this.writeTimer)
    }

    this.writeTimer = window.setTimeout(() => {
      setWindowTitle(title)
      window.history.pushState(routeState, title || '', url)
      this.writeTimer = undefined
    }, this.writeDelay)
  }

  /**
   * Sets a callback on the `onpopstate` event of the history API of the current page.
   * It enables the URL sync to keep track of the changes.
   */
  public onUpdate(callback: (routeState: RouteState) => void): void {
    this._onPopState = (event) => {
      if (this.writeTimer) {
        window.clearTimeout(this.writeTimer)
        this.writeTimer = undefined
      }

      const routeState = event.state

      // At initial load, the state is read from the URL without update.
      // Therefore the state object is not available.
      // In this case, we fallback and read the URL.
      if (!routeState) {
        callback(this.read())
      } else {
        callback(routeState)
      }
    }

    window.addEventListener('popstate', this._onPopState)
  }

  /**
   * Creates a complete URL from a given syncable UI state.
   *
   * It always generates the full URL, not a relative one.
   * This allows to handle cases like using a <base href>.
   * See: https://github.com/algolia/instantsearch.js/issues/790
   */
  public createURL(routeState: RouteState): string {
    return this._createURL({
      qsModule: qs,
      routeState,
      location: window.location
    })
  }

  /**
   * Removes the event listener and cleans up the URL.
   */
  public dispose(): void {
    if (this._onPopState) {
      window.removeEventListener('popstate', this._onPopState)
    }

    if (this.writeTimer) {
      window.clearTimeout(this.writeTimer)
    }

    this.write({})
  }
}

export default function (props?: BrowserHistoryArgs): BrowserHistory {
  return new BrowserHistory(props)
}
