import { SearchkitComponent, HierarchicalFacetAccessor } from "../../../../core";
export interface CollapsibleProps {
    collapsed?: Boolean;
    children?: any;
}
export declare class Collapsible extends SearchkitComponent<CollapsibleProps, any> {
    accessor: HierarchicalFacetAccessor;
    defineBEMBlocks(): {
        "collapsible": string;
    };
    constructor(props: any);
    toggleCollapsed(): void;
    render(): JSX.Element;
}
