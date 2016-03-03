
export interface ListProps {
  toggleItem: (key:string)=>void
  setItems: (keys:Array<string>)=>void
  items: Array<any>
  selectedItems: Array<string>
  disabled?: boolean
  mod?: string
  className?: string
  showCount?: boolean
  translate?: (string) => string
  urlBuilder?: (any) => string
}

export interface ItemProps {
    bemBlocks: { container: any, option: any }
    toggleItem: Function
    active: boolean
    label: string
    count: number
    showCount: boolean
    disabled?: boolean
}
