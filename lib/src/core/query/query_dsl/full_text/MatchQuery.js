function MatchQuery(field, query, options) {
    if (options === void 0) { options = {}; }
    if (!query || !field) {
        return;
    }
    return {
        match: (_a = {},
            _a[field] = _.extend({ query: query }, options),
            _a
        )
    };
    var _a;
}
exports.MatchQuery = MatchQuery;
//# sourceMappingURL=MatchQuery.js.map