import {NestedFieldContext} from "./NestedFieldContext"
import {ChildrenFieldContext} from "./ChildrenFieldContext"
import {EmbeddedFieldContext} from "./EmbeddedFieldContext"

export const FieldContextFactory = (fieldOptions)=>{
  switch (fieldOptions.type){
    case "nested":
      return new NestedFieldContext(fieldOptions)
    case "children":
      return new ChildrenFieldContext(fieldOptions)
    case "embedded":
    default:
      return new EmbeddedFieldContext(fieldOptions)
  }
}
