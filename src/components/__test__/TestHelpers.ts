import ReactTestUtils = require('react-addons-test-utils')
import {html as beautifyHtml} from 'js-beautify'
import { renderToStaticMarkup } from 'react-dom/server'
import * as ReactDOM from "react-dom"
import {compact} from "lodash"
import {map} from "lodash"

export const hasClass = (inst, className)=> {
  if(ReactTestUtils.isDOMComponent(inst.node)) {
    return inst.hasClass(className)
  } else {
    try {
      let classes = ReactDOM.findDOMNode(inst.node).className
      return (' ' + classes + ' ').indexOf(' ' + className + ' ') > -1
    } catch (e){}
  }
  return false
}


export function jsxToHTML(Element){
  return renderToStaticMarkup(Element)
    .replace(/<input([^>]*)\/>/g, "<input$1>")
}

export function htmlClean(html) {
  return html
    .replace(/<!-- react-text: \d+ -->/g, '')
    .replace(/<!-- \/react-text -->/g, '')
    .replace(/<!-- react-empty: \d+ -->/g, '')
}

export const printPrettyHtml = (html)=> {
  html = beautifyHtml( html, {"indent_size":2} )
    .replace(/class=/g, "className=")
    .replace(/<input([^>]*)>/g, "<input$1/>")
    .replace(/readonly=""/g,"readOnly={true}")
    .replace(/font-size/g,"fontSize")
    .replace(/style="([^"]+)"+/g, (match, style)=> {
      let reactStyle = map(compact(style.split(";")), (keyvalue: string)=> {
        let [key, value] = keyvalue.split(":")
        return `${key}:"${value}"`
      }).join(",")
      return "style={{" + reactStyle + "}}"
    })
  console.log("\n"+ html)
}


export const fastClick = (el)=>{
  el.simulate("mouseDown", {button:0})
}
