import {shouldPureComponentUpdate} from "./shouldPureComponentUpdate"

export const PureRender = (target)=> {
  target.prototype.shouldComponentUpdate = shouldPureComponentUpdate
}
