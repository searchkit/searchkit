function NestedQuery(path, filter) {
    return {
        nested: {
            path: path, filter: filter
        }
    };
}
exports.NestedQuery = NestedQuery;
//# sourceMappingURL=NestedQuery.js.map