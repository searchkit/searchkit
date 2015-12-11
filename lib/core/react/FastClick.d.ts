import * as React from "react";
export interface FastClickProps {
    handler: Function;
    children?: any;
}
export declare class FastClick extends React.Component<FastClickProps, any> {
    render(): React.DOMElement<{
        onMouseDown: (event: any) => void;
    }>;
}
