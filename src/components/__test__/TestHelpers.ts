import ReactTestUtils = require('react-addons-test-utils');
const beautifyHtml = require('js-beautify').html
const { renderToStaticMarkup } = require('react-dom/server')

export const hasClass = (inst, className)=> {
  if(ReactTestUtils.isDOMComponent(inst.node)) {
    return inst.hasClass(className)
  } else {
    try {
      let classes = inst.node.props.children.props.className
      return (' ' + classes + ' ').indexOf(' ' + className + ' ') > -1
    } catch (e){}
  }
  return false
}


export function jsxToHTML(Element){
  return renderToStaticMarkup(Element).replace(/<input([^>]*)\/>/g, "<input$1>")
} 

export const printPrettyHtml = (html)=> {
  console.log("\n"+ beautifyHtml( html, {"indent_size":2} ).replace(/class=/g, "className=") )
}


export const fastClick = (el)=>{
  el.simulate("mouseDown", {button:0})
}
