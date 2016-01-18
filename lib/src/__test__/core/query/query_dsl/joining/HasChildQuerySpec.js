var _1 = require("../../../../../");
it("HasChildQuery", function () {
    expect(_1.HasChildQuery("tags", "somequery")).toEqual({
        has_child: {
            type: "tags",
            query: "somequery"
        }
    });
});
//# sourceMappingURL=HasChildQuerySpec.js.map