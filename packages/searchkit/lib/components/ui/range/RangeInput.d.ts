import * as React from "react";
import { RangeProps } from './RangeProps';
export declare class NumberInput extends React.Component<any, any> {
    constructor(props: any);
    static defaultProps: {
        value: string;
    };
    componentWillReceiveProps(nextProps: any): void;
    isValid(value: any): boolean;
    onChange(e: any): void;
    render(): JSX.Element;
}
export interface RangeInputProps extends RangeProps {
    minPlaceholder?: string;
    maxPlaceholder?: string;
}
export declare class RangeInput extends React.Component<RangeInputProps, {}> {
    refs: {
        [key: string]: any;
        min: (NumberInput);
        max: (NumberInput);
    };
    static defaultProps: {
        mod: string;
        translate: (_str: any) => any;
        minPlaceholder: string;
        maxPlaceholder: string;
    };
    constructor(props: any);
    handleInputChange(_value: any, _key: any): void;
    handleSubmit(e: any): void;
    render(): JSX.Element;
}
