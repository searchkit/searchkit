var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Autosuggest = require('react-autosuggest');
require("../styles/index.scss");
var core_1 = require("../../../../core");
var SearchBox = (function (_super) {
    __extends(SearchBox, _super);
    function SearchBox(props) {
        _super.call(this, props);
    }
    SearchBox.prototype.componentWillMount = function () {
        _super.prototype.componentWillMount.call(this);
        this.suggestSearcher = this.searchkit.transport;
    };
    SearchBox.prototype.defineAccessor = function () {
        return new core_1.SearchAccessor("q", {
            prefixQueryFields: this.props.prefixQueryFields
        });
    };
    SearchBox.prototype.onSubmit = function (event) {
        event.preventDefault();
        this.searchQuery(this.getValue());
    };
    SearchBox.prototype.searchQuery = function (query) {
        this.searchkit.resetState();
        this.accessor.state = this.accessor.state.setValue(query);
        this.searchkit.performSearch();
    };
    SearchBox.prototype.processSuggestions = function (results) {
        var suggestOptions = _.map(_.get(results.suggest, "suggestions[0].options", []), function (option) { return option; });
        var quickJumpOptions = _.map(_.get(results.suggest, "completion[0].options", []), function (option) { return option; });
        return [
            {
                sectionName: "Search for",
                suggestions: suggestOptions
            },
            {
                sectionName: "Images",
                suggestions: quickJumpOptions
            }
        ];
    };
    SearchBox.prototype.getSuggestionQueryObject = function (query) {
        return {
            size: 0,
            suggest: {
                text: query,
                "suggestions": {
                    "phrase": {
                        field: "_all",
                        "real_word_error_likelihood": 0.95,
                        "max_errors": 1,
                        "gram_size": 4,
                        "direct_generator": [{
                                "field": "_all",
                                "suggest_mode": "always",
                                "min_word_length": 1
                            }],
                        "highlight": {
                            "pre_tag": "<em>",
                            "post_tag": "</em>"
                        }
                    }
                },
                "completion": {
                    completion: {
                        field: "suggest"
                    }
                }
            }
        };
    };
    SearchBox.prototype.querySuggestions = function (query, callback) {
        var _this = this;
        if (query.length > 0 && this.props.autocomplete) {
            this.suggestSearcher
                .search(this.getSuggestionQueryObject(query))
                .then(function (results) {
                callback(null, _this.processSuggestions(results));
            });
        }
        else {
            callback(null, []);
        }
    };
    SearchBox.prototype.suggestionRenderer = function (suggestion, input) {
        return (React.createElement("div", {"ref": suggestion.text, "dangerouslySetInnerHTML": { __html: suggestion.highlighted || suggestion.text }}));
    };
    SearchBox.prototype.getValue = function () {
        return (this.accessor.state.getValue() || "") + "";
    };
    SearchBox.prototype.onChange = function (e) {
        var value = e.target.value;
        this.accessor.state = this.accessor.state.setValue(value);
        if (this.props.searchOnChange) {
            this.searchQuery(this.getValue());
        }
    };
    SearchBox.prototype.suggestionValue = function (suggestion) {
        return suggestion.text;
    };
    SearchBox.prototype.onSuggestionSelected = function (value) {
        this.accessor.state = this.accessor.state.setValue(value.text || value);
        this.searchkit.search();
    };
    SearchBox.prototype.onKeyDown = function (target) {
        console.log(target.target.value, target);
    };
    SearchBox.prototype.render = function () {
        var inputAttributes = {
            className: "search-box__text",
            placeholder: "search",
            type: "text",
            ref: "queryField",
            onInput: this.onChange.bind(this)
        };
        return (React.createElement("div", {"className": "search-box"}, React.createElement("form", {"onSubmit": this.onSubmit.bind(this)}, React.createElement("div", {"className": "search-box__icon"}), React.createElement(Autosuggest, {"id": "autosuggest", "suggestions": this.querySuggestions.bind(this), "suggestionRenderer": this.suggestionRenderer.bind(this), "onSuggestionSelected": this.onSuggestionSelected.bind(this), "suggestionValue": this.suggestionValue, "value": this.getValue(), "inputAttributes": inputAttributes}), React.createElement("input", {"type": "submit", "value": "search", "className": "search-box__action"}))));
    };
    return SearchBox;
})(core_1.SearchkitComponent);
exports.SearchBox = SearchBox;
//# sourceMappingURL=SearchBox.js.map