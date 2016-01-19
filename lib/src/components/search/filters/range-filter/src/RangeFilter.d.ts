import { SearchkitComponent, SearchkitComponentProps, FilterBasedAccessor, ObjectState } from "../../../../../core";
export interface RangeAccessorOptions {
    title: string;
    id: string;
    min: number;
    max: number;
    field: string;
}
export declare class RangeAccessor extends FilterBasedAccessor<ObjectState> {
    options: any;
    state: ObjectState;
    constructor(key: any, options: RangeAccessorOptions);
    buildSharedQuery(query: any): any;
    getBuckets(): any;
    buildOwnQuery(query: any): any;
}
export interface RangeFilterProps extends SearchkitComponentProps {
    field: string;
    min: number;
    max: number;
    id: string;
    title: string;
}
export declare class RangeFilter extends SearchkitComponent<RangeFilterProps, any> {
    accessor: RangeAccessor;
    static propTypes: {};
    constructor(props: any);
    defineAccessor(): RangeAccessor;
    defineBEMBlocks(): {
        container: string;
    };
    sliderUpdate(newValues: any): void;
    sliderUpdateAndSearch(newValues: any): void;
    render(): JSX.Element;
}
