import {StatefulAccessor} from "./StatefulAccessor"
import {State} from "../State"


export class FilterBasedAccessor<T extends State<any>> extends StatefulAccessor<T> {

  onResetFilters(){
    this.resetState()
  }
}
