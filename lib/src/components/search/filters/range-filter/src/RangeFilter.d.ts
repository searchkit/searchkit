import { SearchkitComponent, SearchkitComponentProps, RangeAccessor } from "../../../../../core";
export interface RangeFilterProps extends SearchkitComponentProps {
    field: string;
    min: number;
    max: number;
    id: string;
    title: string;
    interval?: number;
    showHistogram?: boolean;
}
export declare class RangeFilter extends SearchkitComponent<RangeFilterProps, any> {
    accessor: RangeAccessor;
    static propTypes: any;
    defineAccessor(): RangeAccessor;
    defineBEMBlocks(): {
        container: string;
        labels: string;
    };
    sliderUpdate(newValues: any): void;
    sliderUpdateAndSearch(newValues: any): void;
    getMaxValue(): any;
    getHistogram(): JSX.Element;
    getInterval(): number;
    render(): JSX.Element;
}
