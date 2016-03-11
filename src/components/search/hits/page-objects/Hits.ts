import {Component, List, field, defaults} from "xenon";

@defaults({qa:"hits", itemQA:"hit", itemType:Component})
export class Hits extends List<Component> {


}
