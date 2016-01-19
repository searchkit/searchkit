import { SearchkitComponent, SearchkitComponentProps, RangeAccessor } from "../../../../../core";
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
        labels: string;
    };
    sliderUpdate(newValues: any): void;
    sliderUpdateAndSearch(newValues: any): void;
    getHistogram(): JSX.Element;
    render(): JSX.Element;
}
