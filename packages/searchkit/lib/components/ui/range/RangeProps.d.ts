export interface RangeProps {
    onChange: (range: {
        min: number;
        max: number;
    }) => void;
    onFinished: (range: {
        min: number;
        max: number;
    }) => void;
    min: number;
    max: number;
    minValue?: number;
    maxValue?: number;
    items: Array<any>;
    disabled?: boolean;
    mod?: string;
    className?: string;
    translate?: (s: string) => string;
}
export declare const RangePropTypes: {
    onChange: any;
    onFinishd: any;
    min: any;
    max: any;
    minValue: any;
    maxValue: any;
    items: any;
    disabled: any;
    mod: any;
    className: any;
    translate: any;
};
