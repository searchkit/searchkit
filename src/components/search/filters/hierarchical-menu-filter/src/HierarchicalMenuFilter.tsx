import * as React from "react";
import HierarchicalFacetAccessor from "../../../../../domain/accessors/HierarchicalFacetAccessor.ts";
import * as _ from "lodash";
import * as classNames from 'classnames';
import SearchkitComponent from "../../../../SearchkitComponent.ts";


require("./../styles/index.scss");

interface IHierarchicalMenuFilter {
	fields:Array<string>
	title:string
}

export default class HierarchicalMenuFilter extends SearchkitComponent<IHierarchicalMenuFilter, any> {
	public accessors:Array<HierarchicalFacetAccessor>

	constructor(props:IHierarchicalMenuFilter) {
		super(props)
	}

	componentWillMount() {
		super.componentWillMount();
		this.createAccessors();
	}

  createAccessors() {
		this.accessors = this.props.fields.map((field,i) => {
			let ignoreKeys = _.slice(this.props.fields,i)
			return this.searcher.stateManager.registerAccessor(
	      new HierarchicalFacetAccessor(field, {title:this.props.title, size:100, fields:ignoreKeys})
	    )
		});
  }

  addFilter(accessor, option) {
		let childAccessors = _.slice(this.accessors,_.indexOf(this.accessors,accessor))
		_.each(childAccessors, (accessor:HierarchicalFacetAccessor) => accessor.state.clear());
		accessor.state.clear()
		accessor.state.add(option.key)
		accessor.search()
	}

  private getLevelAccessor(level):HierarchicalFacetAccessor {
    return this.accessors[level - 1];
  }

	renderOption(level, option) {

    let accessor = this.getLevelAccessor(level);
    let isSelected:boolean = accessor.state.contains(option.key)

		let optionClassName = classNames({
			"hierarchical-menu-list-option":true,
			"hierarchical-menu-list-option--checked":isSelected
		})

		return (
			<div className="hierarchical-menu-list-options__item" key={level+"_"+option.key}>
        <div className={optionClassName} onClick={this.addFilter.bind(this, accessor, option)}>
  				<div className="hierarchical-menu-list-option__text">{option.key}</div>
        </div>
        {(()=> {
          if (isSelected) {
            return this.renderOptions(level+1);
          }
        })()}
			</div>
		)
	}

  renderOptions(level) {
    let accessor = this.accessors[level-1];
    if (!accessor) {
      return null;
    }
    return (
			<div className="hierarchical-menu-list-options">
  			{_.map(accessor.getBuckets(), this.renderOption.bind(this, level))}
			</div>
		);
  }

	render() {
		return (
			<div className="hierarchical-menu-list">
				<div className="hierarchical-menu-list--header">{this.props.title}</div>
				{this.renderOptions(1)}
			</div>
		);
	}
}
