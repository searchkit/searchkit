var _1 = require("../../../../../");
describe("MatchQuery", function () {
    it("empty string empty field", function () {
        expect(_1.MatchQuery("color", null)).toBe(undefined);
        expect(_1.MatchQuery(null, "red")).toBe(undefined);
    });
    it("with string = options", function () {
        expect(_1.MatchQuery("color", "red yellow", {
            operator: "AND"
        })).toEqual({
            match: {
                color: {
                    query: "red yellow",
                    operator: "AND"
                }
            }
        });
    });
});
//# sourceMappingURL=MatchQuerySpec.js.map