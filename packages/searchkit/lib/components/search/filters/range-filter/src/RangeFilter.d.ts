import { SearchkitComponent, SearchkitComponentProps, RangeAccessor, RenderComponentType, FieldOptions } from "../../../../../core";
import { RangeProps, Panel } from "../../../../ui";
export interface RangeFilterProps extends SearchkitComponentProps {
    field: string;
    min: number;
    max: number;
    id: string;
    title: string;
    interval?: number;
    showHistogram?: boolean;
    containerComponent?: RenderComponentType<any>;
    rangeComponent?: RenderComponentType<RangeProps>;
    rangeFormatter?: (count: number) => number | string;
    marks?: Object;
    fieldOptions?: FieldOptions;
}
export declare class RangeFilter extends SearchkitComponent<RangeFilterProps, any> {
    accessor: RangeAccessor;
    static propTypes: any;
    static defaultProps: {
        containerComponent: typeof Panel;
        rangeComponent: (props: any) => JSX.Element;
        showHistogram: boolean;
    };
    constructor(props: any);
    defineAccessor(): RangeAccessor;
    defineBEMBlocks(): {
        container: string;
        labels: string;
    };
    sliderUpdate(newValues: any): void;
    sliderUpdateAndSearch(newValues: any): void;
    getRangeComponent(): RenderComponentType<any>;
    render(): React.ReactElement<any>;
    renderRangeComponent(component: RenderComponentType<any>): React.ReactElement<any>;
}
