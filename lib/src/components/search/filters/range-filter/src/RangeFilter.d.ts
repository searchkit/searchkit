import { SearchkitComponent, SearchkitComponentProps, RangeAccessor } from "../../../../../core";
export interface RangeFilterProps extends SearchkitComponentProps {
    field: string;
    min: number;
    max: number;
    id: string;
    title: string;
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
    render(): JSX.Element;
}
