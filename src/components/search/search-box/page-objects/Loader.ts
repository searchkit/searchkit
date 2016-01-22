import {Component,  field, defaults} from "xenon";

@defaults({qa:"loader", states:Loader.states})
export default class Loader extends Component {
  public static states = {
    HIDDEN: "is-hidden"
  }
}
