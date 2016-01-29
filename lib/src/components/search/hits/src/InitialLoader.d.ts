import * as React from "react";
import { SearchkitComponent, SearchkitComponentProps } from "../../../../core";
export interface InitialLoaderprops extends SearchkitComponentProps {
    component?: any;
}
export declare class InitialLoader extends SearchkitComponent<InitialLoaderprops, any> {
    defineBEMBlocks(): {
        container: string;
    };
    render(): React.DOMElement<{
        bemBlocks: any;
    }>;
}
