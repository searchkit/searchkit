var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Autosuggest = require('react-autosuggest');
var core_1 = require("../../../../core");
require("./../styles/index.scss");
var SearchBox = (function (_super) {
    __extends(SearchBox, _super);
    function SearchBox(props) {
        _super.call(this, props);
        this.createSuggestSearcher();
    }
    SearchBox.prototype.createSuggestSearcher = function () {
        this.suggestSearcher = new core_1.ESRequest("aetna");
    };
    SearchBox.prototype.defineAccessor = function () {
        return new core_1.SearchAccessor("q");
    };
    SearchBox.prototype.onSubmit = function (event) {
        event.preventDefault();
        var val = this.getValue();
        this.searchkit.resetState();
        this.accessor.state.setValue(val);
        this.searchkit.performSearch();
    };
    SearchBox.prototype.processSuggestions = function (results) {
        return _.pluck(results.suggest.suggestions[0].options, "text");
    };
    SearchBox.prototype.querySuggestions = function (query, callback) {
        var _this = this;
        if (query.length > 0) {
            var queryObject = {
                size: 0,
                suggest: {
                    text: query,
                    "suggestions": {
                        term: {
                            field: "_all"
                        }
                    }
                }
            };
            this.suggestSearcher
                .search(queryObject)
                .then(function (results) {
                var suggestions = _this.processSuggestions(results);
                callback(null, suggestions);
            });
        }
        else {
            callback(null, []);
        }
    };
    SearchBox.prototype.suggestionRenderer = function (suggestion, input) {
        return (React.createElement("div", null, suggestion));
    };
    SearchBox.prototype.getValue = function () {
        return (this.accessor.state.getValue() || "") + "";
    };
    SearchBox.prototype.onChange = function (event) {
        this.accessor.state.setValue(event.target.value);
        this.forceUpdate();
    };
    SearchBox.prototype.getSuggestionValue = function (suggestion) {
        return suggestion.text;
    };
    SearchBox.prototype.render = function () {
        var inputAttributes = {
            className: "search-box__text",
            placeholder: "search",
            type: "text",
            ref: "queryField"
        };
        return (React.createElement("div", {"className": "search-box"}, React.createElement("form", {"onSubmit": this.onSubmit.bind(this)}, React.createElement("div", {"className": "search-box__icon"}), React.createElement(Autosuggest, {"suggestions": this.querySuggestions.bind(this), "suggestionRenderer": this.suggestionRenderer.bind(this), "suggestionValue": this.getSuggestionValue.bind(this), "value": this.value, "inputAttributes": inputAttributes}), React.createElement("input", {"type": "submit", "value": "search", "className": "search-box__action"}))));
    };
    return SearchBox;
})(core_1.SearchkitComponent);
exports.SearchBox = SearchBox;
//# sourceMappingURL=SearchBox.js.map