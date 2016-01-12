import { Component, List } from "xenon";
import RefinementOption from "./RefinementOption.ts";
export default class RefinementListFilter extends Component {
    title: Component;
    options: List<RefinementOption>;
    id(name: any): void;
}
