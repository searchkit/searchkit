var _1 = require("../../../../../");
it("RangeQuery", function () {
    expect(_1.RangeQuery("prices", { gte: 0, lt: 10 })).toEqual({
        range: {
            prices: {
                gte: 0, lt: 10
            }
        }
    });
});
//# sourceMappingURL=RangeQuerySpec.js.map