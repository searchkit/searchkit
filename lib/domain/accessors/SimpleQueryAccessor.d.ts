import Accessor from "./Accessor.ts";
import RootBuilder from "../builders/RootBuilder.ts";
export default class SimpleQueryAccessor extends Accessor {
    buildQuery(builder: RootBuilder, query: any): void;
}
