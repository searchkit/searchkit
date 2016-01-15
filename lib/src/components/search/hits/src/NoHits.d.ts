import { SearchkitComponent, SearchkitComponentProps } from "../../../../core";
export interface NoHitsProps extends SearchkitComponentProps {
}
export declare class NoHits extends SearchkitComponent<NoHitsProps, any> {
    defineBEMBlocks(): {
        container: string;
    };
    render(): JSX.Element;
}
