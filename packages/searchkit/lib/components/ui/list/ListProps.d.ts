export interface ListProps {
    toggleItem: (key: string) => void;
    setItems: (keys: Array<string>) => void;
    items: Array<any>;
    countFormatter?: (count: number) => string | number;
    selectedItems: Array<string>;
    docCount?: number;
    disabled?: boolean;
    mod?: string;
    className?: string;
    showCount?: boolean;
    translate?: (s: string) => string;
    multiselect?: boolean;
}
export interface ItemProps {
    bemBlocks: {
        container: any;
        option: any;
    };
    onClick: Function;
    label: string;
    count: number | string;
    rawCount: number;
    active?: boolean;
    disabled?: boolean;
    showCount: boolean;
    style?: any;
    listDocCount?: number;
    itemKey?: string;
}
