import * as React from "react";
import * as rx from "rx";
import ESClient from "../../../../domain/ESClient.ts";
import SimpleQueryAccessor from "../../../../domain/accessors/SimpleQueryAccessor.ts";
import SearchkitComponent from "../../../SearchkitComponent.ts";

require("./../styles/index.scss");

interface ISearchBox {
}

export default class SearchBox extends SearchkitComponent<ISearchBox, any> {
	accessor:SimpleQueryAccessor

	constructor (props:ISearchBox) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this)
		this.onChange = this.onChange.bind(this)
	}

	defineAccessor(){
		return new SimpleQueryAccessor("q")
	}

	onSubmit(event) {
		event.preventDefault()
		const val = this.getValue()
		this.accessor.triggerSearchReset()
		this.accessor.state.set(val)
		this.accessor.search()
	}

	getValue(){
		return this.accessor.state.get()
	}

	onChange(event){
		this.accessor.state.set(event.target.value)
		this.forceUpdate()
	}

	renderAutocomplete() {
		return
		if (_.get(this.getValue(),"length",0) > 2) {
			return (
				<div className="suggestions-autocomplete">
					<div className="suggestions-section">
						<div className="suggestions-section__heading">Genre</div>
						<div className="suggestions-section__items">
							<div className="suggestion suggestion-section__item">
								<div className="suggestion__value"><b>Mus</b>cial</div>
								<div className="suggestion__count">234</div>
							</div>
							<div className="suggestion suggestion-section__item">
								<div className="suggestion__value"><b>Fan</b>tasy</div>
								<div className="suggestion__count">4</div>
							</div>
						</div>
					</div>
					<div className="suggestions-section">
						<div className="suggestions-section__heading">Actors</div>
						<div className="suggestions-section__items">
							<div className="suggestion suggestion-section__item suggestion--active">
								<div className="suggestion__value"><b>Nav</b>een Andrews</div>
								<div className="suggestion__count">23</div>
							</div>
							<div className="suggestion suggestion-section__item">
								<div className="suggestion__value"><b>Jenn</b>nifer Carpenter</div>
								<div className="suggestion__count">24</div>
							</div>
						</div>
					</div>
				</div>

			)
		}
	}

	render() {
		return (
			<div className="search-box">
        <form onSubmit={this.onSubmit}>
          <div className="search-box__icon"></div>
          <input
						ref="queryField"
						type="text"
						value={this.getValue()}
						onChange={this.onChange}
						placeholder="search"
						className="search-box__text"/>
          <input type="submit" value="search" className="search-box__action"/>
        </form>
      </div>
		);
	}
}
