import * as React from "react";
import * as PropTypes from "prop-types";
import { block } from "searchkit"

export interface TogglePanelProps extends React.Props<TogglePanel> {
  key?: any
  title?: string
  mod?: string
  disabled?: boolean
  className?: string
  collapsable?: boolean
  rightComponent: any
}

export class TogglePanel extends React.Component<TogglePanelProps, {collapsed: boolean}> {

  static propTypes = {
      title: PropTypes.string,
      disabled: PropTypes.bool,
      mod: PropTypes.string,
      className: PropTypes.string,
      collapsable: PropTypes.bool,
  }

  static defaultProps = {
    disabled: false,
    collapsable: false,
    mod: "sk-panel"
  }

  constructor(props){
    super(props)
    this.state = {
      collapsed: props.collapsable
    }
  }

  toggleCollapsed(){
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  componentDidMount() {
      console.log('componentDidMount')
  }

  componentWillUnmount() {
      console.log('componentWillUnmount')
  }

  render() {
      const { title, mod, className, disabled, children, collapsable, rightComponent } = this.props
      const { collapsed } = this.state
      const bemBlocks = {
          container: block(mod)
      }

    
      var containerBlock = bemBlocks.container.el
          
      var containerClass = containerBlock().mix(className)
          .state({ disabled })

      var titleDiv
      if (collapsable){
        const arrowClass = collapsed ? 'sk-arrow-right' : 'sk-arrow-down'
        titleDiv = (
          <div className={block("header").state({ collapsable })} onClick={this.toggleCollapsed.bind(this)}>
            {rightComponent ? < div style={{ float: 'right' }}>{rightComponent}</div> : undefined}
            <span className={arrowClass}/>&nbsp;{title}
          </div>
        )
      } else {
        titleDiv = (
          <div className={block("header") }>
            {rightComponent ? < div style={{ float: 'right' }}>{rightComponent}</div> : undefined}
            {title}
          </div>
        )
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
