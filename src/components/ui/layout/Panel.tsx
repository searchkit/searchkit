import * as React from "react";
import * as PropTypes from "prop-types";
import {block} from "../../../core"
export interface PanelProps extends React.Props<Panel> {
  key?: any
  title?: string
  mod?: string
  disabled?: boolean
  className?: string
  collapsable?: boolean
  defaultCollapsed?:boolean
}

export class Panel extends React.PureComponent<PanelProps, {collapsed: boolean}> {

  static propTypes = {
    title: PropTypes.string,
    disabled: PropTypes.bool,
    mod: PropTypes.string,
    className: PropTypes.string,
    collapsable: PropTypes.bool,
    defaultCollapsed:PropTypes.bool
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
    var containerBlock = block(mod)
      .state({ disabled })

    var titleDiv
    if (collapsable){
      titleDiv = (
        <div className={containerBlock.el("header").state({ collapsable, collapsed })} onClick={this.toggleCollapsed.bind(this)}>
          {title}
        </div>
      )
    } else {
      titleDiv = <div className={containerBlock.el("header") }>{title}</div>
    }

    return (
      <div className={containerBlock.mix(className)}>
        {titleDiv}
        <div className={containerBlock.el("content").state({ collapsed })}>
          {children}
        </div>
      </div>
    );
  }
}
