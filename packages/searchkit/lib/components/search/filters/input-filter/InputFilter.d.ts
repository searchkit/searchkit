import * as React from "react";
import { QueryAccessor, SearchkitComponent, SearchkitComponentProps, RenderComponentType } from "../../../../core";
import { Panel } from "../../../ui";
export interface InputFilterProps extends SearchkitComponentProps {
    id: string;
    title: string;
    mod?: string;
    searchOnChange?: boolean;
    searchThrottleTime?: number;
    queryBuilder?: Function;
    queryFields?: Array<string>;
    queryOptions?: any;
    prefixQueryFields?: Array<string>;
    prefixQueryOptions?: any;
    placeholder?: string;
    blurAction?: "search" | "restore";
    containerComponent?: RenderComponentType<any>;
}
export declare class InputFilter extends SearchkitComponent<InputFilterProps, any> {
    accessor: QueryAccessor;
    lastSearchMs: number;
    throttledSearch: () => void;
    static translations: any;
    translations: any;
    static defaultProps: {
        containerComponent: typeof Panel;
        collapsable: boolean;
        mod: string;
        searchThrottleTime: number;
        blurAction: string;
    };
    static propTypes: any;
    constructor(props: InputFilterProps);
    componentDidMount(): void;
    defineBEMBlocks(): {
        container: string;
    };
    defineAccessor(): QueryAccessor;
    onSubmit(event: any): void;
    searchQuery(query: any): void;
    getValue(): any;
    getAccessorValue(): string;
    onChange(e: any): void;
    onClear(): void;
    setFocusState(focused: boolean): void;
    render(): React.ReactElement<any>;
}
