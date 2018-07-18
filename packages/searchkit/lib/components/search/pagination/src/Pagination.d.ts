import { SearchkitComponent, PaginationAccessor, SearchkitComponentProps } from "../../../../core";
import { Toggle } from "../../../ui";
export interface PaginationProps extends SearchkitComponentProps {
    listComponent?: any;
    pageScope?: number;
    showNumbers?: boolean;
    showText?: boolean;
    showLast?: boolean;
}
export declare class Pagination extends SearchkitComponent<PaginationProps, any> {
    accessor: PaginationAccessor;
    static translations: any;
    translations: any;
    static propTypes: any;
    static defaultProps: {
        listComponent: typeof Toggle;
        pageScope: number;
        showNumbers: boolean;
        showText: boolean;
        showLast: boolean;
        mod: string;
    };
    constructor(props: any);
    defineAccessor(): PaginationAccessor;
    getCurrentPage(): number;
    getTotalPages(): number;
    isDisabled(pageNumber: number): boolean;
    normalizePage(page: (number | string)): number;
    setPage(page: (number | string)): void;
    getPages(): any[];
    render(): JSX.Element;
}
export declare class PaginationSelect extends Pagination {
    static defaultProps: any;
}
