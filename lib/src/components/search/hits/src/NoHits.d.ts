import { SearchkitComponent, SearchkitComponentProps } from "../../../../core";
export interface NoHitsProps extends SearchkitComponentProps {
}
export declare class NoHits extends SearchkitComponent<NoHitsProps, any> {
    static translations: any;
    translations: any;
    static propTypes: {};
    defineBEMBlocks(): {
        container: string;
    };
    render(): JSX.Element;
}
