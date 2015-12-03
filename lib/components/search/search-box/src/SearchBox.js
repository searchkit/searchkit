var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var SimpleQueryAccessor_ts_1 = require("../../../../domain/accessors/SimpleQueryAccessor.ts");
var SearchkitComponent_ts_1 = require("../../../SearchkitComponent.ts");
require("./../styles/index.scss");
var SearchBox = (function (_super) {
    __extends(SearchBox, _super);
    function SearchBox(props) {
        _super.call(this, props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    SearchBox.prototype.defineAccessor = function () {
        return new SimpleQueryAccessor_ts_1.default("q");
    };
    SearchBox.prototype.onSubmit = function (event) {
        event.preventDefault();
        var val = this.getValue();
        this.accessor.triggerSearchReset();
        this.accessor.state.set(val);
        this.accessor.search();
    };
    SearchBox.prototype.getValue = function () {
        return this.accessor.state.get();
    };
    SearchBox.prototype.onChange = function (event) {
        this.accessor.state.set(event.target.value);
        this.forceUpdate();
    };
    SearchBox.prototype.renderAutocomplete = function () {
        if ("d" == "s") {
            return (React.createElement("div", {"className": "suggestions-autocomplete"}, React.createElement("div", {"className": "suggestions-section"}, React.createElement("div", {"className": "suggestions-section__heading"}, "Genre"), React.createElement("div", {"className": "suggestions-section__items"}, React.createElement("div", {"className": "suggestion suggestion-section__item"}, React.createElement("div", {"className": "suggestion__value"}, React.createElement("b", null, "Mus"), "cial"), React.createElement("div", {"className": "suggestion__count"}, "234")), React.createElement("div", {"className": "suggestion suggestion-section__item"}, React.createElement("div", {"className": "suggestion__value"}, React.createElement("b", null, "Fan"), "tasy"), React.createElement("div", {"className": "suggestion__count"}, "4")))), React.createElement("div", {"className": "suggestions-section"}, React.createElement("div", {"className": "suggestions-section__heading"}, "Actors"), React.createElement("div", {"className": "suggestions-section__items"}, React.createElement("div", {"className": "suggestion suggestion-section__item suggestion--active"}, React.createElement("div", {"className": "suggestion__value"}, React.createElement("b", null, "Nav"), "een Andrews"), React.createElement("div", {"className": "suggestion__count"}, "23")), React.createElement("div", {"className": "suggestion suggestion-section__item"}, React.createElement("div", {"className": "suggestion__value"}, React.createElement("b", null, "Jenn"), "nifer Carpenter"), React.createElement("div", {"className": "suggestion__count"}, "24"))))));
        }
    };
    SearchBox.prototype.render = function () {
        return (React.createElement("div", {"className": "search-box"}, React.createElement("form", {"onSubmit": this.onSubmit}, React.createElement("div", {"className": "search-box__icon"}), React.createElement("input", {"ref": "queryField", "type": "text", "value": this.getValue(), "onChange": this.onChange, "placeholder": "search", "className": "search-box__text"}), React.createElement("input", {"type": "submit", "value": "search", "className": "search-box__action"}))));
    };
    return SearchBox;
})(SearchkitComponent_ts_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchBox;
//# sourceMappingURL=SearchBox.js.map