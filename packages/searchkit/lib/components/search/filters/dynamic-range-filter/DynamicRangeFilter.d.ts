import { SearchkitComponent, SearchkitComponentProps, RenderComponentType, DynamicRangeAccessor, FieldOptions } from "../../../../core";
import { RangeProps, Panel, RangeSlider } from "../../../ui";
export interface DynamicRangeFilterProps extends SearchkitComponentProps {
    field: string;
    id: string;
    title: string;
    containerComponent?: RenderComponentType<any>;
    rangeComponent?: RenderComponentType<RangeProps>;
    rangeFormatter?: (count: number) => number | string;
    fieldOptions?: FieldOptions;
}
export declare class DynamicRangeFilter extends SearchkitComponent<DynamicRangeFilterProps, any> {
    accessor: DynamicRangeAccessor;
    static propTypes: any;
    static defaultProps: {
        containerComponent: typeof Panel;
        rangeComponent: typeof RangeSlider;
        rangeFormatter: any;
    };
    constructor(props: any);
    defineAccessor(): DynamicRangeAccessor;
    defineBEMBlocks(): {
        container: string;
        labels: string;
    };
    getMinMax(): {
        min: any;
        max: any;
    };
    sliderUpdate(newValues: any): void;
    sliderUpdateAndSearch(newValues: any): void;
    render(): React.ReactElement<any>;
    renderRangeComponent(component: RenderComponentType<any>): React.ReactElement<any>;
}
