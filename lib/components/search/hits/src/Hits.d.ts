import { SearchkitComponent } from "../../../../core";
export interface IHits {
    hitsPerPage: number;
    render: string;
}
export declare class Hits extends SearchkitComponent<IHits, any> {
    renderResult(result: any): JSX.Element;
    render(): JSX.Element;
}
