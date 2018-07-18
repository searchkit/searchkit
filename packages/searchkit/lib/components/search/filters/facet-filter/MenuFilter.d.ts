import { Panel, CheckboxItemList } from '../../../ui';
import { FacetFilter } from "./FacetFilter";
export { Panel, CheckboxItemList };
export declare class MenuFilter extends FacetFilter {
    static propTypes: any;
    static defaultProps: any;
    toggleFilter(option: any): void;
    setFilters(options: any): void;
    getSelectedItems(): (string | number)[];
    getItems(): any;
}
