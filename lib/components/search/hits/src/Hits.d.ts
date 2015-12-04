import { SearchkitComponent, PageSizeAccessor } from "../../../../core";
export interface IHits {
    hitsPerPage: number;
}
export declare class Hits extends SearchkitComponent<IHits, any> {
    defineAccessor(): PageSizeAccessor;
    renderResult(result: any): JSX.Element;
    render(): JSX.Element;
}
