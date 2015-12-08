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
        this.showAutoSuggest = false;
        this.searchkit.performSearch();
    };
    SearchBox.prototype.processSuggestions = function (results) {
        var suggestOptions = _.map(_.get(results.suggest, "suggestions[0].options", []), function (option) { return option.text; });
        var quickJumpOptions = _.map(_.get(results.suggest, "completion[0].options", []), function (option) { return option.text; });
        return [
            {
                suggestions: suggestOptions
            },
            {
                sectionName: "Images",
                suggestions: quickJumpOptions
            }
        ];
    };
    SearchBox.prototype.querySuggestions = function (query, callback) {
        var _this = this;
        if (query.length > 0) {
            this.showAutoSuggest = true;
            var queryObject = {
                size: 0,
                suggest: {
                    text: query,
                    "suggestions": {
                        term: {
                            field: "_all"
                        }
                    },
                    "completion": {
                        completion: {
                            field: "suggest"
                        }
                    }
                }
            };
            this.suggestSearcher
                .search(queryObject)
                .then(function (results) {
                callback(null, _this.processSuggestions(results));
            });
        }
        else {
            callback(null, []);
            this.showAutoSuggest = false;
        }
    };
    SearchBox.prototype.suggestionRenderer = function (suggestion, input) {
        return (React.createElement("div", {"ref": suggestion}, suggestion));
    };
    SearchBox.prototype.getValue = function () {
        return (this.accessor.state.getValue() || "") + "";
    };
    SearchBox.prototype.onChange = function (value) {
        this.accessor.state.setValue(value);
    };
    SearchBox.prototype.onSuggestionSelected = function (value) {
        this.accessor.state.setValue(value);
        this.searchkit.search();
    };
    SearchBox.prototype.render = function () {
        var inputAttributes = {
            className: "search-box__text",
            placeholder: "search",
            type: "text",
            ref: "queryField",
            onChange: this.onChange.bind(this)
        };
        return (React.createElement("div", {"className": "search-box"}, React.createElement("form", {"onSubmit": this.onSubmit.bind(this)}, React.createElement("div", {"className": "search-box__icon"}), React.createElement(Autosuggest, {"id": "autosuggest", "suggestions": this.querySuggestions.bind(this), "suggestionRenderer": this.suggestionRenderer.bind(this), "showWhen": this.showAutoSuggest, "onSuggestionSelected": this.onSuggestionSelected.bind(this), "value": this.getValue(), "inputAttributes": inputAttributes}), React.createElement("input", {"type": "submit", "value": "search", "className": "search-box__action"}))));
    };
    return SearchBox;
})(core_1.SearchkitComponent);
exports.SearchBox = SearchBox;
//# sourceMappingURL=SearchBox.js.map