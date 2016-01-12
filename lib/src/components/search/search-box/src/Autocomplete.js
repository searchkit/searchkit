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
var Autocomplete = (function (_super) {
    __extends(Autocomplete, _super);
    function Autocomplete() {
        _super.apply(this, arguments);
    }
    Autocomplete.prototype.defineBEMBlocks = function () {
        return { container: (this.props.mod || "autocomplete") };
    };
    Autocomplete.prototype.componentWillMount = function () {
        _super.prototype.componentWillMount.call(this);
        this.suggestSearcher = new core_1.ESTransport(this.searchkit.host);
    };
    Autocomplete.prototype.processSuggestions = function (results) {
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
    Autocomplete.prototype.getSuggestionQueryObject = function (query) {
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
    Autocomplete.prototype.querySuggestions = function (query, callback) {
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
    Autocomplete.prototype.suggestionRenderer = function (suggestion, input) {
        return (React.createElement("div", {"ref": suggestion.text, "dangerouslySetInnerHTML": { __html: suggestion.highlighted || suggestion.text }}));
    };
    Autocomplete.prototype.render = function () {
        var block = this.bemBlocks.container;
        return (React.createElement("div", {"className": block()}));
    };
    return Autocomplete;
})(core_1.SearchkitComponent);
exports.Autocomplete = Autocomplete;
//# sourceMappingURL=Autocomplete.js.map