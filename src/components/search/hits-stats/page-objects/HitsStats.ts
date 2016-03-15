import {Component,  field, defaults} from "xenon";

@defaults({qa:"hits-stats"})
export class HitsStats extends Component {

  @field(Component,{qa:"info"})
  info: Component

}
