import * as React from "react";
import { SearchkitComponent, SearchkitComponentProps, RenderComponentType } from "../../../../core";
export interface InitialViewDisplayProps {
    bemBlocks: any;
}
export declare class InitialViewDisplay extends React.PureComponent<InitialViewDisplayProps, any> {
    render(): JSX.Element;
}
export interface InitialLoaderprops extends SearchkitComponentProps {
    component?: RenderComponentType<InitialViewDisplayProps>;
}
export declare class InitialLoader extends SearchkitComponent<InitialLoaderprops, any> {
    static defaultProps: {
        component: typeof InitialViewDisplay;
    };
    static propTypes: any;
    defineBEMBlocks(): {
        container: string;
    };
    render(): React.ReactElement<any>;
}
