import * as React from "react";

import {
  LocationAccessor,
  RadiusAccessor,
  SearchkitComponent,
  SearchkitComponentProps
} from "../../../../core"

const defaults = require("lodash/defaults")
const throttle = require("lodash/throttle")
const assign = require("lodash/assign")

export interface LocationBoxProps extends SearchkitComponentProps {
  queryField?: string
  queryRadius?: string
  title?: string
}

export class LocationBox extends SearchkitComponent<LocationBoxProps, any> {
  accessor: LocationAccessor
  radiusAccessor: RadiusAccessor
  search: () => void

  static translations:any = {
    "locationbox.placeholder": "Event location",
    "locationbox.search": "Search"
  }
  translations = LocationBox.translations

  static propTypes = defaults({
    queryField: React.PropTypes.string,
    queryRadius: React.PropTypes.string,
    title: React.PropTypes.string,
    translations: SearchkitComponent.translationsPropType(
      LocationBox.translations
    )
  }, SearchkitComponent.propTypes)

  constructor (props: LocationBoxProps) {
    super(props);
    this.state = {
      focused:false
    }
    this.search = () => {
      this.searchQuery(this.accessor.getQueryString())
    }
  }

  componentWillMount() {
    super.componentWillMount()
    this.radiusAccessor = new RadiusAccessor("30km")
    this.searchkit.addAccessor(this.radiusAccessor)
  }

  defineBEMBlocks() {
    return {container: (this.props.mod || "sk-location-box")};
  }

  defineAccessor() {
    return new LocationAccessor("loc", {
      queryField: this.props.queryField,
      queryRadius: this.props.queryRadius,
      title: this.props.title
    })
  }

  onSubmit(event) {
    event.preventDefault()
    this.searchQuery(this.getValue())
  }

  searchQuery(query) {
    let shouldResetOtherState = false
    // Here query could be used to retrieve location
    // But prefer to do it in accessor

    this.accessor.setQueryString(query, shouldResetOtherState)
    // then call this.searchkit.performLocationFilter(newSearh)
    this.searchkit.performSearch()
  }

  getValue() {
    return (this.accessor.state.getValue() || "") + ""
  }

  onChange(e) {
    const query = e.target.value;
    this.accessor.setQueryString(query)
    this.forceUpdate()
  }

  setFocusState(focused:boolean) {
    this.setState({focused:focused})
  }

  render() {
    let block = this.bemBlocks.container

    return (
      <div className={block().state({focused:this.state.focused})}>
        <form onSubmit={this.onSubmit.bind(this)}>
          <div className={block("icon")}></div>
          <input type="text"
          data-qa="location"
          className={block("text")}
          placeholder={this.translate("locationbox.placeholder")}
          value={this.getValue()}
          onFocus={this.setFocusState.bind(this, true)}
          onBlur={this.setFocusState.bind(this, false)}
          ref="queryField"
          onInput={this.onChange.bind(this)}/>
          <input type="submit" value={this.translate("locationbox.search")} className={block("action")} data-qa="submit"/>
          <div data-qa="loader" className={block("loader").mix("sk-spinning-loader").state({hidden:!this.isLoading()})}></div>
        </form>
      </div>
    );
  }
}
