import * as React from 'react';
export declare type RenderFunction = (props?: any, children?: any) => Element;
export declare type Element = React.ReactElement<any>;
export declare type RenderComponentType<P> = React.ComponentClass<P> | React.ClassicComponentClass<P> | Element | RenderFunction | any;
export declare const RenderComponentPropType: any;
export declare function renderComponent(component: RenderComponentType<any>, props?: {}, children?: any): React.ReactElement<any>;
