var _1 = require("../../../../../");
it("TermsQuery", function () {
    expect(_1.TermsQuery("color", ["red", "blue"])).toEqual({
        terms: {
            color: ["red", "blue"]
        }
    });
});
//# sourceMappingURL=TermsQuerySpec.js.map