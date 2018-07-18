Object.defineProperty(exports, "__esModule", { value: true });
var without = require("lodash/without");
var each = require("lodash/each");
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.listeners = [];
    }
    EventEmitter.prototype.addListener = function (fn) {
        var _this = this;
        this.listeners.push(fn);
        return function () {
            _this.listeners = without(_this.listeners, fn);
        };
    };
    EventEmitter.prototype.trigger = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        each(this.listeners, function (fn) {
            fn.apply(null, args);
        });
    };
    EventEmitter.prototype.clear = function () {
        this.listeners = [];
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=EventEmitter.js.map