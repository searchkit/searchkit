function HasParentQuery(parent_type, query) {
    return {
        has_parent: {
            parent_type: parent_type, query: query
        }
    };
}
exports.HasParentQuery = HasParentQuery;
//# sourceMappingURL=HasParentQuery.js.map