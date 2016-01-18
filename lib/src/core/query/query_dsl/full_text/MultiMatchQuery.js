function MultiMatchQuery(query, options) {
    if (!query) {
        return;
    }
    return {
        multi_match: _.extend({ query: query }, options)
    };
}
exports.MultiMatchQuery = MultiMatchQuery;
//# sourceMappingURL=MultiMatchQuery.js.map