var _1 = require("../../../../../");
it("FilteredQuery", function () {
    var filtered = {
        filter: {
            term: { color: "red" }
        },
        query: {
            match: {
                keywords: "sky"
            }
        }
    };
    expect(_1.FilteredQuery(filtered))
        .toEqual({ filtered: filtered });
});
//# sourceMappingURL=FilteredQuerySpec.js.map