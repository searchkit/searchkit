
export interface ListProps {
  toggleItem: (key:string)=>void
  setItems: (keys:Array<string>)=>void
  items: Array<any>
  selectedItems: Array<string>
  docCount?: number // number of documents for this list
  disabled?: boolean
  mod?: string
  className?: string
  showCount?: boolean
  translate?: (string) => string
}

export interface ItemProps {
    bemBlocks: { container: any, option: any }
    onClick: Function
    active: boolean
    label: string
    count: number
    showCount: boolean
    listDocCount?: number // number of documents for this list
    disabled?: boolean
}
