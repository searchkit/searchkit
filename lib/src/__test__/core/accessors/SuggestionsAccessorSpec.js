var _this = this;
var _1 = require("../../../");
describe("SuggestionsAccessor", function () {
    beforeEach(function () {
        _this.searchkit = _1.SearchkitManager.mock();
        _this.accessor = new _1.SuggestionsAccessor("title");
        _this.searchkit.addAccessor(_this.accessor);
    });
    it("getSuggestion()", function () {
        _this.searchkit.setResults({
            "suggest": {
                "suggestions": [
                    {
                        options: [
                            { text: "Some Suggestion" }
                        ]
                    }
                ]
            }
        });
        expect(_this.accessor.getSuggestion())
            .toBe("Some Suggestion");
    });
    it("buildOwnQuery() - query too short", function () {
        var query = new _1.ImmutableQuery();
        query = query.setQueryString("ab");
        var newQuery = _this.accessor.buildOwnQuery(query);
        expect(newQuery).toBe(query);
    });
    it("buildOwnQuery() -  with query ", function () {
        var query = new _1.ImmutableQuery().setQueryString("hello");
        var newQuery = _this.accessor.buildOwnQuery(query);
        expect(newQuery).not.toBe(query);
        expect(newQuery.query.suggest.text)
            .toBe("hello");
        expect(newQuery.query.suggest.suggestions.phrase.field)
            .toBe("title");
    });
});
//# sourceMappingURL=SuggestionsAccessorSpec.js.map