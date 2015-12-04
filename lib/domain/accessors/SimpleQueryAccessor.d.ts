import Accessor from "./Accessor";
import RootBuilder from "../builders/RootBuilder";
export default class SimpleQueryAccessor extends Accessor {
    buildQuery(builder: RootBuilder, query: any): void;
}
