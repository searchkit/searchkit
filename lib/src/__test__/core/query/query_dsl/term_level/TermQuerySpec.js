var _1 = require("../../../../../");
it("TermQuery", function () {
    expect(_1.TermQuery("color", "red")).toEqual({
        term: {
            color: "red"
        }
    });
});
//# sourceMappingURL=TermQuerySpec.js.map