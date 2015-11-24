import * as React from "react";

require("./../styles/index.scss");

interface IHits {

}

export default class Hits extends React.Component<IHits, any> {

	render() {
		return (
			<div className="hits">
        <div className="hits__item hit">
          <div className="hit__title">jkhjkh</div>
          <div className="hit__description">jkhhjhkjh</div>
        </div>
				<div className="hits__item hit">
          <div className="hit__title">jkhjkh</div>
          <div className="hit__description">jkhhjhkjh</div>
        </div>
      </div>
		);
	}
}
