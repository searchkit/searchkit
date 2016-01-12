var _ = require("lodash");
var EventEmitter = (function () {
    function EventEmitter() {
        this.listeners = [];
    }
    EventEmitter.prototype.addListener = function (fn) {
        var _this = this;
        this.listeners.push(fn);
        return function () {
            _this.listeners = _.without(_this.listeners, fn);
        };
    };
    EventEmitter.prototype.trigger = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        _.each(this.listeners, function (fn) {
            fn.apply(null, args);
        });
    };
    return EventEmitter;
})();
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=EventEmitter.js.map