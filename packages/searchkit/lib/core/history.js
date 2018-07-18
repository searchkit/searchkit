Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = require("history");
var qs = require("qs");
exports.encodeObjUrl = function (obj) {
    return qs.stringify(obj, { encode: true, encodeValuesOnly: true });
};
exports.decodeObjString = function (str) {
    return qs.parse(str);
};
exports.supportsHistory = function () {
    return typeof window !== 'undefined' && !!window.history;
};
exports.createHistoryInstance = function () {
    return exports.supportsHistory() ? history_1.createBrowserHistory() : history_1.createMemoryHistory();
};
//# sourceMappingURL=history.js.map