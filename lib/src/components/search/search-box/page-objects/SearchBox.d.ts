import { Component, Input, Button } from "xenon";
import Loader from "./Loader";
export default class SearchBox extends Component {
    query: Input;
    submit: Button;
    loader: Loader;
    search(query: string): void;
}
