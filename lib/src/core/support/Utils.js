var _ = require("lodash");
var Utils = (function () {
    function Utils() {
    }
    Utils.guid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    Utils.collapse = function (collection, seed) {
        var reducer = function (current, fn) { return fn(current); };
        return _.reduce(collection, reducer, seed);
    };
    return Utils;
})();
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map