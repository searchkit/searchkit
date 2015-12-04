import SearchkitComponent from "../../../../domain/new/SearchkitComponent";
export interface IHits {
    hitsPerPage: number;
    render: string;
}
export default class Hits extends SearchkitComponent<IHits, any> {
    renderResult(result: any): JSX.Element;
    render(): JSX.Element;
}
