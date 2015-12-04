import {ObjectState} from "../state/State"
import {Accessor} from "./Accessor"
import {Term, Terms, BoolShould, BoolMust} from "../query/QueryBuilders";
import * as _ from "lodash";


export class HierarchicalFacetAccessor extends Accessor<ObjectState> {


  state = new ObjectState()
  options:any
  constructor(key, options:any){
    super(key)
    this.options = options
  }

}
