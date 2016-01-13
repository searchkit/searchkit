import { SearchkitComponentProps, SearchkitComponent } from "./SearchkitComponent";
export interface SearchkitFilterComponentProps extends SearchkitComponentProps {
    collapsed?: Boolean;
}
export declare class SearchkitFilterComponent<P extends SearchkitFilterComponentProps, S> extends SearchkitComponent<P, S> {
    constructor(props: P);
}
