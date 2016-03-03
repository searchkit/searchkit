
export interface ListProps {
  toggleItem: (key:string)=>void
  setItems: (keys:Array<string>)=>void
  urlBuilder: (any) => string
  items: Array<any>
  selectedItems: Array<string>
  disabled?: boolean
  mod?: string
  className?: string
  showCount?: boolean
  translate?: (string) => string
}
