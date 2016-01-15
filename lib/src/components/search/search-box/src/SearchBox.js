var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
var Autosuggest = require('react-autosuggest');
require("../styles/index.scss");
var core_1 = require("../../../../core");
var SearchBox = (function (_super) {
    __extends(SearchBox, _super);
    function SearchBox(props) {
        _super.call(this, props);
        this.translations = SearchBox.translations;
        this.state = {
            focused: false
        };
        this.lastSearchMs = 0;
    }
    SearchBox.prototype.componentWillMount = function () {
        _super.prototype.componentWillMount.call(this);
    };
    SearchBox.prototype.defineBEMBlocks = function () {
        return { container: (this.props.mod || "search-box") };
    };
    SearchBox.prototype.defineAccessor = function () {
        return new core_1.QueryAccessor("q", {
            prefixQueryFields: (this.props.searchOnChange ? (this.props.prefixQueryFields || this.props.queryFields) : false),
            queryFields: this.props.queryFields || ["_all"],
            queryOptions: _.extend({}, this.props.queryOptions)
        });
    };
    SearchBox.prototype.onSubmit = function (event) {
        event.preventDefault();
        this.searchQuery(this.getValue());
    };
    SearchBox.prototype.searchQuery = function (query) {
        // this.searchkit.resetState()
        this.accessor.state = this.accessor.state.setValue(query);
        var now = +new Date;
        var newSearch = now - this.lastSearchMs <= 2000;
        this.lastSearchMs = now;
        this.searchkit.performSearch(newSearch);
    };
    SearchBox.prototype.getValue = function () {
        return (this.accessor.state.getValue() || "") + "";
    };
    SearchBox.prototype.onChange = function (e) {
        var _this = this;
        var query = e.target.value;
        this.accessor.state = this.accessor.state.setValue(query);
        if (this.props.searchOnChange) {
            _.throttle(function () {
                _this.searchQuery(_this.accessor.state.getValue());
            }, 400)();
        }
        this.forceUpdate();
    };
    SearchBox.prototype.setFocusState = function (focused) {
        this.setState({ focused: focused });
    };
    SearchBox.prototype.render = function () {
        var block = this.bemBlocks.container;
        return (React.createElement("div", {"className": block().state({ focused: this.state.focused })}, React.createElement("form", {"onSubmit": this.onSubmit.bind(this)}, React.createElement("div", {"className": block("icon")}), React.createElement("input", {"type": "text", "data-qa": "query", "className": block("text"), "placeholder": this.translate("searchbox.placeholder"), "value": this.getValue(), "onFocus": this.setFocusState.bind(this, true), "onBlur": this.setFocusState.bind(this, false), "ref": "queryField", "autoFocus": this.props.autofocus, "onInput": this.onChange.bind(this)}), React.createElement("input", {"type": "submit", "value": "search", "className": block("action"), "data-qa": "submit"}), React.createElement("div", {"data-qa": "loader", "className": block("loader").mix("sk-spinning-loader").state({ hidden: !this.isLoading() })}))));
    };
    SearchBox.translations = {
        "searchbox.placeholder": "Search"
    };
    SearchBox.propTypes = _.defaults({
        searchOnChange: React.PropTypes.bool,
        queryFields: React.PropTypes.arrayOf(React.PropTypes.string),
        autofocus: React.PropTypes.bool,
        queryOptions: React.PropTypes.object,
        prefixQueryFields: React.PropTypes.arrayOf(React.PropTypes.string),
        translations: core_1.SearchkitComponent.translationsPropType(SearchBox.translations)
    }, core_1.SearchkitComponent.propTypes);
    return SearchBox;
})(core_1.SearchkitComponent);
exports.SearchBox = SearchBox;
//# sourceMappingURL=SearchBox.js.map