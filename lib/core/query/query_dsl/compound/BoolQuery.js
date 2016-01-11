function BoolMust(val) {
    return { bool: { must: val } };
}
exports.BoolMust = BoolMust;
function BoolMustNot(val) {
    return { bool: { must_not: val } };
}
exports.BoolMustNot = BoolMustNot;
function BoolShould(val) {
    return { bool: { should: val } };
}
exports.BoolShould = BoolShould;
//# sourceMappingURL=BoolQuery.js.map