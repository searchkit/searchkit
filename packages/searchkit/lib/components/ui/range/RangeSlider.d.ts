import * as React from "react";
import { RangeProps } from './RangeProps';
export interface RangeSliderProps extends RangeProps {
    step?: number;
    marks?: Object;
    rangeFormatter?: (n: number) => number | string;
}
export declare class RangeSlider extends React.PureComponent<RangeSliderProps, {}> {
    static defaultProps: {
        mod: string;
        rangeFormatter: any;
    };
    constructor(props: any);
    onChange([min, max]: [any, any]): void;
    onFinished([min, max]: [any, any]): void;
    render(): JSX.Element;
}
