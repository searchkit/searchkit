import { RenderComponentType } from 'searchkit'
export type AdapterProps = {
  multi: boolean
  loadOptions: Function
  onSelect: Function
  selectedValues: Array<string>
  itemComponent: RenderComponentType<any>
}
