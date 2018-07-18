import * as React from "react";
export interface Point {
    x: number;
    y: number;
}
export declare class NormalClickComponent extends React.PureComponent<any, any> {
    render(): React.DetailedReactHTMLElement<{
        onClick: any;
    }, HTMLElement>;
}
export declare class FastClickComponent extends React.PureComponent<any, any> {
    startPoint: Point;
    threshold: number;
    supportsTouch: boolean;
    handleMouseDown(event: any): void;
    cleanupTouch(): void;
    getSinglePoint(event: any): Point;
    handleTouchStart(event: any): void;
    pointsWithinThreshold(p1: any, p2: any): boolean;
    handleTouchEnd(event: any): void;
    handleClick(event: any): void;
    render(): React.DetailedReactHTMLElement<{
        onMouseDown: any;
        onTouchStart: any;
        onTouchEnd: any;
        onClick: any;
    }, HTMLElement>;
}
export declare class FastClick extends React.Component<any, any> {
    static component: typeof NormalClickComponent;
    render(): React.ReactElement<any>;
}
