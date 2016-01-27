var reduce = require("lodash/reduce");
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
        return reduce(collection, reducer, seed);
    };
    Utils.instanceOf = function (klass) {
        return function (val) { return val instanceof klass; };
    };
    Utils.interpolate = function (str, interpolations) {
        return str.replace(/{([^{}]*)}/g, function (a, b) {
            var r = interpolations[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        });
    };
    Utils.translate = function (key, interpolations) {
        if (interpolations) {
            return Utils.interpolate(key, interpolations);
        }
        else {
            return key;
        }
    };
    return Utils;
})();
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map