var _1 = require("../../../../../");
describe("MatchPhrasePrefix", function () {
    it("empty string", function () {
        expect(_1.MatchPhrasePrefix("", "title^5")).toBe(undefined);
    });
    it("with string + options", function () {
        expect(_1.MatchPhrasePrefix("foo", "title^5")).toEqual({
            match_phrase_prefix: {
                title: {
                    query: "foo",
                    boost: 5
                }
            }
        });
        expect(_1.MatchPhrasePrefix("foo", "title")).toEqual({
            match_phrase_prefix: {
                title: {
                    query: "foo",
                    boost: 1
                }
            }
        });
    });
});
//# sourceMappingURL=MatchPhrasePrefixSpec.js.map