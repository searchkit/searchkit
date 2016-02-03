import * as React from "react"
import {shouldPureComponentUpdate} from "./shouldPureComponentUpdate"
import {PureRender} from "./PureRender"

export class PureRenderComponent<T> extends React.Component<T, any> {
  shouldComponentUpdate:Function= shouldPureComponentUpdate
}
