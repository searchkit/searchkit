var _1 = require("../../../../../");
describe("SimpleQueryString", function () {
    it("empty string", function () {
        expect(_1.SimpleQueryString("")).toBe(undefined);
    });
    it("with string + options", function () {
        var sqs = _1.SimpleQueryString("foo", {
            analyzer: "english",
            fields: ["title"]
        });
        expect(sqs).toEqual({
            simple_query_string: {
                query: "foo",
                analyzer: "english",
                fields: ["title"]
            }
        });
    });
});
//# sourceMappingURL=SimpleQueryStringSpec.js.map