var isArray = require("lodash/isArray");
function boolHelper(val, operator) {
    var isArr = isArray(val);
    if (isArr && val.length === 1) {
        return val[0];
    }
    else if (isArr && val.length === 0) {
        return {};
    }
    return {
        bool: (_a = {},
            _a[operator] = val,
            _a
        )
    };
    var _a;
}
function BoolMust(val) {
    return boolHelper(val, "must");
}
exports.BoolMust = BoolMust;
function BoolMustNot(val) {
    return boolHelper(val, "must_not");
}
exports.BoolMustNot = BoolMustNot;
function BoolShould(val) {
    return boolHelper(val, "should");
}
exports.BoolShould = BoolShould;
//# sourceMappingURL=BoolQueries.js.map