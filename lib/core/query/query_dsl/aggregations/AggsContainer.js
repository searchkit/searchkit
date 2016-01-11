var _ = require("lodash");
function AggsContainer(key, inner, aggsArray) {
    if (aggsArray === void 0) { aggsArray = []; }
    aggsArray = _.compact(aggsArray);
    if (aggsArray.length > 0) {
        inner.aggs = _.reduce(aggsArray, _.extend, {});
    }
    return (_a = {},
        _a[key] = inner,
        _a
    );
    var _a;
}
exports.AggsContainer = AggsContainer;
//# sourceMappingURL=AggsContainer.js.map