var _1 = require("../../../../../");
it("NestedQuery", function () {
    expect(_1.NestedQuery("taxonomy", "somequery")).toEqual({
        nested: {
            path: "taxonomy",
            filter: "somequery"
        }
    });
});
//# sourceMappingURL=NestedQuerySpec.js.map