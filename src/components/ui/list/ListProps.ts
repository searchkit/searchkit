
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
  multiselect?: boolean // if true, uses toggleItem, else uses setItems
}

export interface ItemProps {
  bemBlocks: { container: any, option: any }
  onClick: Function
  label: string
  count: number
  active?: boolean
  disabled?: boolean
  showCount: boolean
  style?: any
  listDocCount?: number // number of documents for this list
  itemKey?:string
}
