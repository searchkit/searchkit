var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Accessor_1 = require("./Accessor");
var get = require("lodash/get");
var SuggestionsAccessor = (function (_super) {
    __extends(SuggestionsAccessor, _super);
    function SuggestionsAccessor(field) {
        _super.call(this);
        this.field = field;
    }
    SuggestionsAccessor.prototype.getSuggestion = function () {
        return get(this.searchkit.getSuggestions(), [0, "options", 0, "text"], false);
    };
    SuggestionsAccessor.prototype.buildOwnQuery = function (query) {
        var queryText = query.getQueryString();
        if (queryText.length > 3) {
            return query.setSuggestions({
                text: queryText,
                suggestions: {
                    phrase: {
                        field: this.field,
                        real_word_error_likelihood: 0.95,
                        max_errors: 1,
                        gram_size: 4,
                        direct_generator: [{
                                field: "_all",
                                suggest_mode: "always",
                                min_word_length: 1
                            }]
                    }
                }
            });
        }
        return query;
    };
    return SuggestionsAccessor;
})(Accessor_1.Accessor);
exports.SuggestionsAccessor = SuggestionsAccessor;
//# sourceMappingURL=SuggestionsAccessor.js.map