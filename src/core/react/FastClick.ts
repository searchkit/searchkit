import * as React from "react";
import {PureRender} from "./pure-render"

export interface Point {
  x:number, y :number
}

@PureRender
export class FastClick extends React.Component<any, any>{

  startPoint:Point
  threshold = 20
  supportsTouch:boolean

  handleMouseDown(event){
    if (this.supportsTouch) return
    if(event.button === 0){
      this.props.handler()
    }
  }

  cleanupTouch(){
    delete this.startPoint
  }

  getSinglePoint(event):Point{
    let touches = event.changedTouches
    if(touches.length === 1){
      return {
        x:touches[0].pageX,
        y:touches[0].pageY
      }
    }
    return null
  }

  handleTouchStart(event){
    this.supportsTouch = true
    this.startPoint = this.getSinglePoint(event)
  }

  pointsWithinThreshold(p1, p2){
    return(
      Math.abs(p1.x - p2.x) < this.threshold &&
      Math.abs(p1.y - p2.y) < this.threshold
    )
  }

  handleTouchEnd(event){
    if(this.startPoint){
      let endPoint = this.getSinglePoint(event)
      if(this.pointsWithinThreshold(this.startPoint, endPoint)){
        this.props.handler()
      }
      this.cleanupTouch()
    }

  }

  handleClick(event){
    event.preventDefault()
  }

  render(){
    return React.cloneElement(this.props.children, {
      onMouseDown:this.handleMouseDown.bind(this),
      onTouchStart:this.handleTouchStart.bind(this),
      onTouchEnd:this.handleTouchEnd.bind(this),
      onClick:this.handleClick.bind(this)
    })
  }

}
