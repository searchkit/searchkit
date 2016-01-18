var _1 = require("../../../../../");
it("HasParentQuery", function () {
    expect(_1.HasParentQuery("folder", "somequery")).toEqual({
        has_parent: {
            parent_type: "folder",
            query: "somequery"
        }
    });
});
//# sourceMappingURL=HasParentQuerySpec.js.map