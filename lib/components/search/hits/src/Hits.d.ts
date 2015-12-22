import { SearchkitComponent, PageSizeAccessor } from "../../../../core";
export interface IHits {
    hitsPerPage: number;
    mod?: string;
}
export declare class Hits extends SearchkitComponent<IHits, any> {
    defineAccessor(): PageSizeAccessor;
    defineBEMBlocks(): {
        container: string;
        item: string;
    };
    renderResult(result: any): JSX.Element;
    renderNoResults(): JSX.Element;
    render(): JSX.Element;
}
