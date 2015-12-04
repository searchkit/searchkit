import { SearchkitComponent } from "../../../../core";
export interface IHits {
    hitsPerPage: number;
}
export declare class Hits extends SearchkitComponent<IHits, any> {
    renderResult(result: any): JSX.Element;
    render(): JSX.Element;
}
