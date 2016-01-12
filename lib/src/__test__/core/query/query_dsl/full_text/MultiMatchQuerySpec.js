var _1 = require("../../../../../");
describe("MultiMatchQuery", function () {
    it("empty string", function () {
        expect(_1.MultiMatchQuery("", {
            fields: ["title"]
        })).toBe(undefined);
    });
    it("with string + options", function () {
        var query = _1.MultiMatchQuery("foo", {
            type: "phrase_prefix",
            fields: ["title"]
        });
        expect(query).toEqual({
            multi_match: {
                query: "foo",
                type: "phrase_prefix",
                fields: ["title"]
            }
        });
    });
});
//# sourceMappingURL=MultiMatchQuerySpec.js.map