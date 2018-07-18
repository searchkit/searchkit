import * as React from 'react';
export declare class RangeComponent extends React.PureComponent<any, {}> {
    static propTypes: {
        showHistogram: any;
        showSlider: any;
        showInput: any;
    };
    render(): JSX.Element;
}
export declare function RangeComponentBuilder(components: any): (props: any) => JSX.Element;
export declare const RangeSliderHistogram: (props: any) => JSX.Element;
export declare const RangeSliderHistogramInput: (props: any) => JSX.Element;
export declare const RangeSliderInput: (props: any) => JSX.Element;
export declare const RangeHistogramInput: (props: any) => JSX.Element;
