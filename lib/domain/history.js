var history_1 = require('history');
var qs = require('qs');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = history_1.useQueries(history_1.createHistory)({
    parseQueryString: function (queryString) {
        return qs.parse(queryString, { allowDots: false });
    },
    stringifyQuery: function (query) {
        return qs.stringify(query);
    }
});
//# sourceMappingURL=history.js.map