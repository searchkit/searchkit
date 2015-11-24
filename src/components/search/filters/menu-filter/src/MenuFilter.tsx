import * as React from "react";

require("./../styles/index.scss");

interface IMenuFilter {
	name:string
}

export default class MenuFilter extends React.Component<IMenuFilter, any> {

	render() {
		return (
			<div className="menu-filter">
        <div className="menu-filter__header">{this.props.name}</div>
				<div className="menu-filter__options menu-filter-options">
					<div className="menu-filter-options__item menu-filter-option">
						<div className="menu-filter-option__checkbox">
							<input type="input"/>
						</div>
					</div>
				</div>
      </div>
		);
	}
}
