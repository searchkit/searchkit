import ReactTestUtils = require('react-addons-test-utils');

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
