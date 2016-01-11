function RangeQuery(key, from, to) {
    return {
        range: (_a = {},
            _a[key] = {
                gte: from,
                lt: to
            },
            _a
        )
    };
    var _a;
}
exports.RangeQuery = RangeQuery;
//# sourceMappingURL=RangeQuery.js.map