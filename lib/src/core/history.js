var history_1 = require('history');
var qs = require("qs");
exports.createHistory = function () {
    return history_1.useQueries(history_1.createHistory)({
        stringifyQuery: function (ob) {
            return qs.stringify(ob, { encode: true });
        },
        parseQueryString: function (str) {
            return qs.parse(str);
        }
    });
};
//# sourceMappingURL=history.js.map