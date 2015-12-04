import SearchkitComponent from "../../../domain/new/SearchkitComponent";
import Searcher from "../../../domain/new/Searcher";
export default class App extends SearchkitComponent<any, any> {
    primarySearcher: Searcher;
    componentWillMount(): void;
    render(): JSX.Element;
}
