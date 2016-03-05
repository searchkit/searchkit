import ReactTestUtils = require('react-addons-test-utils');
const beautifyHtml = require('js-beautify').html
const { renderToStaticMarkup } = require('react-dom/server')
import * as ReactDOM from "react-dom"

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
  return renderToStaticMarkup(Element).replace(/<input([^>]*)\/>/g, "<input$1>")
}

export const printPrettyHtml = (html)=> {
  html = beautifyHtml( html, {"indent_size":2} )
    .replace(/class=/g, "className=")
    .replace(/<input([^>]*)>/g, "<input$1/>")
    .replace(/readonly=""/g,"readOnly={true}")
  console.log("\n"+ html)
}


export const fastClick = (el)=>{
  el.simulate("mouseDown", {button:0})
}
