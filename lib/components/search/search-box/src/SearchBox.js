var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var core_1 = require("../../../../core");
require("./../styles/index.scss");
var SearchBox = (function (_super) {
    __extends(SearchBox, _super);
    function SearchBox(props) {
        _super.call(this, props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    SearchBox.prototype.defineAccessor = function () {
        return new core_1.SearchAccessor("q");
    };
    SearchBox.prototype.onSubmit = function (event) {
        event.preventDefault();
        var val = this.getValue();
        // this.accessor.triggerSearchReset()
        this.accessor.state.setValue(val);
        // this.accessor.search()
        this.searchkit.performSearch();
    };
    //
    SearchBox.prototype.getValue = function () {
        return (this.accessor.state.getValue() || "") + "";
    };
    SearchBox.prototype.onChange = function (event) {
        this.accessor.state.setValue(event.target.value);
        this.forceUpdate();
    };
    //
    // renderAutocomplete() {
    // 	if ("d" == "s") {
    // 		return (
    // 			<div className="suggestions-autocomplete">
    // 				<div className="suggestions-section">
    // 					<div className="suggestions-section__heading">Genre</div>
    // 					<div className="suggestions-section__items">
    // 						<div className="suggestion suggestion-section__item">
    // 							<div className="suggestion__value"><b>Mus</b>cial</div>
    // 							<div className="suggestion__count">234</div>
    // 						</div>
    // 						<div className="suggestion suggestion-section__item">
    // 							<div className="suggestion__value"><b>Fan</b>tasy</div>
    // 							<div className="suggestion__count">4</div>
    // 						</div>
    // 					</div>
    // 				</div>
    // 				<div className="suggestions-section">
    // 					<div className="suggestions-section__heading">Actors</div>
    // 					<div className="suggestions-section__items">
    // 						<div className="suggestion suggestion-section__item suggestion--active">
    // 							<div className="suggestion__value"><b>Nav</b>een Andrews</div>
    // 							<div className="suggestion__count">23</div>
    // 						</div>
    // 						<div className="suggestion suggestion-section__item">
    // 							<div className="suggestion__value"><b>Jenn</b>nifer Carpenter</div>
    // 							<div className="suggestion__count">24</div>
    // 						</div>
    // 					</div>
    // 				</div>
    // 			</div>
    //
    // 		)
    // 	}
    // }
    //
    SearchBox.prototype.render = function () {
        return (React.createElement("div", {"className": "search-box"}, React.createElement("form", {"onSubmit": this.onSubmit}, React.createElement("div", {"className": "search-box__icon"}), React.createElement("input", {"ref": "queryField", "type": "text", "value": this.getValue(), "onChange": this.onChange, "placeholder": "search", "className": "search-box__text"}), React.createElement("input", {"type": "submit", "value": "search", "className": "search-box__action"}))));
    };
    return SearchBox;
})(core_1.SearchkitComponent);
exports.SearchBox = SearchBox;
//# sourceMappingURL=SearchBox.js.map