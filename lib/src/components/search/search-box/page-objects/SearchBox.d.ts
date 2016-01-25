import { Component } from "xenon";
import Loader from "./Loader";
export default class SearchBox extends Component {
    query: Component;
    submit: Component;
    loader: Loader;
    search(query: string): void;
}
