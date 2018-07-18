Object.defineProperty(exports, "__esModule", { value: true });
var assign = require("lodash/assign");
var pick = require("lodash/pick");
var allowedOptions = ["score_mode", "inner_hits", "min_children", "max_children"];
function HasChildQuery(type, query, options) {
    if (options === void 0) { options = {}; }
    return {
        has_child: assign({
            type: type, query: query
        }, pick(options, allowedOptions))
    };
}
exports.HasChildQuery = HasChildQuery;
//# sourceMappingURL=HasChildQuery.js.map