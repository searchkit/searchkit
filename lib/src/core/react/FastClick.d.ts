import * as React from "react";
export interface Point {
    x: number;
    y: number;
}
export declare class FastClick extends React.Component<any, any> {
    startPoint: Point;
    threshold: number;
    supportsTouch: boolean;
    handleMouseDown(event: any): void;
    cleanupTouch(): void;
    getSinglePoint(event: any): Point;
    handleTouchStart(event: any): void;
    pointsWithinThreshold(p1: any, p2: any): boolean;
    handleTouchEnd(event: any): void;
    render(): React.DOMElement<{
        onMouseDown: any;
        onTouchStart: any;
        onTouchEnd: any;
    }>;
}
