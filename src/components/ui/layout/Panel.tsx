import * as React from "react";
let bemBlock = require("bem-cn")
import {PureRender} from "../../../core"
export interface PanelProps extends React.Props<Panel> {
  key?: any
  title?: string
  mod?: string
  disabled?: boolean
  className?: string
  collapsable?: boolean
  defaultCollapsed?:boolean
}

@PureRender
export class Panel extends React.Component<PanelProps, {collapsed: boolean}> {

  static propTypes = {
    title: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    mod: React.PropTypes.string,
    className: React.PropTypes.string,
    collapsable: React.PropTypes.bool,
    defaultCollapsed:React.PropTypes.bool
  }

  static defaultProps = {
    disabled: false,
    collapsable: false,
    defaultCollapsed:true,
    mod: "sk-panel"
  }

  constructor(props){
    super(props)
    this.state = {
      collapsed: props.defaultCollapsed
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.defaultCollapsed != this.props.defaultCollapsed) {
      this.setState({
        collapsed: nextProps.defaultCollapsed
      })
    }
  }

  toggleCollapsed(){
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    const { title, mod, className, disabled, children, collapsable } = this.props
    const collapsed  = collapsable && this.state.collapsed
    const bemBlocks = {
      container: bemBlock(mod)
    }
    var block = bemBlocks.container
    var containerClass = block()
      .mix(className)
      .state({ disabled })

    var titleDiv
    if (collapsable){
      titleDiv = (
        <div className={block("header").state({ collapsable, collapsed })} onClick={this.toggleCollapsed.bind(this)}>
          {title}
        </div>
      )
    } else {
      titleDiv = <div className={block("header") }>{title}</div>
    }

    return (
      <div className={containerClass}>
        {titleDiv}
        <div className={block("content").state({ collapsed })}>
          {children}
        </div>
      </div>
    );
  }
}
