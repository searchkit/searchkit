import qs from 'qs'

export type RouteState = {
  [stateKey: string]: any
}

export type Router = {
  onUpdate(callback: (route: RouteState) => void): void
  read(): RouteState
  write(route: RouteState, shouldPushToHistory: boolean): void
  createURL(state: RouteState): string
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
  writeDelay?: number
  createURL?: CreateURL
  parseURL?: ParseURL
}

export const defaultCreateURL: CreateURL = ({ qsModule, routeState, location }) => {
  if (location) {
    const { protocol, hostname, port = '', pathname, hash } = location
    const queryString = qsModule.stringify(routeState)
    const portWithPrefix = port === '' ? '' : `:${port}`

    // IE <= 11 has no proper `location.origin` so we cannot rely on it.
    if (!queryString) {
      return `${protocol}//${hostname}${portWithPrefix}${pathname}${hash}`
    }

    return `${protocol}//${hostname}${portWithPrefix}${pathname}?${queryString}${hash}`
  }
  return `?${qsModule.stringify(routeState)}`
}

export const defaultParseURL: ParseURL = ({ qsModule, location }) =>
  qsModule.parse(location.search.slice(1), { arrayLimit: 99 })

class BrowserHistory implements Router {
  private readonly writeDelay: Required<BrowserHistoryArgs>['writeDelay']

  private readonly _createURL: Required<BrowserHistoryArgs>['createURL']

  private readonly _parseURL: Required<BrowserHistoryArgs>['parseURL']

  private writeTimer?: number
  private _onPopState?(event: PopStateEvent): void

  public constructor(
    {
      writeDelay = 400,
      createURL = defaultCreateURL,
      parseURL = defaultParseURL
    }: BrowserHistoryArgs = {} as BrowserHistoryArgs
  ) {
    this.writeTimer = undefined
    this.writeDelay = writeDelay
    this._createURL = createURL
    this._parseURL = parseURL
  }

  public read(): RouteState {
    return this._parseURL({ qsModule: qs, location: window.location })
  }

  public write(routeState: RouteState, shouldPushToHistory = true): void {
    const url = this.createURL(routeState)

    if (this.writeTimer) {
      window.clearTimeout(this.writeTimer)
    }

    this.writeTimer = window.setTimeout(() => {
      if (shouldPushToHistory) {
        window.history.pushState(routeState, null, url)
      }
      this.writeTimer = undefined
    }, this.writeDelay)
  }

  public onUpdate(callback: (routeState: RouteState) => void): void {
    this._onPopState = (event) => {
      if (this.writeTimer) {
        window.clearTimeout(this.writeTimer)
        this.writeTimer = undefined
      }

      const routeState = event.state

      if (!routeState) {
        callback(this.read())
      } else {
        callback(routeState)
      }
    }

    window.addEventListener('popstate', this._onPopState)
  }

  public createURL(routeState: RouteState): string {
    return this._createURL({
      qsModule: qs,
      routeState,
      location: window.location
    })
  }

  public dispose(): void {
    if (this._onPopState) {
      window.removeEventListener('popstate', this._onPopState)
    }

    if (this.writeTimer) {
      window.clearTimeout(this.writeTimer)
    }

    this.write({}, false)
  }
}

export default function (props?: BrowserHistoryArgs): BrowserHistory {
  return new BrowserHistory(props)
}
