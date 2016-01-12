import { SearchkitComponent, PageSizeAccessor } from "../../../../core";
export interface IHits {
    hitsPerPage: number;
    mod?: string;
    highlightFields?: Array<string>;
}
export declare class Hits extends SearchkitComponent<IHits, any> {
    componentWillMount(): void;
    defineAccessor(): PageSizeAccessor;
    defineBEMBlocks(): {
        container: string;
        item: string;
    };
    renderResult(result: any): JSX.Element;
    renderInitialView(): JSX.Element;
    renderNoResults(): JSX.Element;
    render(): JSX.Element;
}
