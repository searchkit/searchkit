import {StatefulAccessor} from "./StatefulAccessor";
import {ValueState} from "../state"

export class RadiusAccessor extends StatefulAccessor<ValueState> {
  state = new ValueState()
  constructor(public defaultRadius: string){
    super("radius")
  }

  setRadius(radius){
    if(this.defaultRadius == radius){
      this.state = this.state.clear()
    } else {
      this.state = this.state.setValue(radius)
    }
  }

  getRadius(){
    return this.state.getValue() || this.defaultRadius
  }

  buildSharedQuery(query){
    return query.setRadius(this.getRadius())
  }
}
