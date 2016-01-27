var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State_1 = require("./State");
var contains = require("lodash/includes");
var without = require("lodash/without");
var ArrayState = (function (_super) {
    __extends(ArrayState, _super);
    function ArrayState() {
        _super.apply(this, arguments);
    }
    ArrayState.prototype.getValue = function () {
        return this.value || [];
    };
    ArrayState.prototype.toggle = function (val) {
        if (this.contains(val)) {
            return this.remove(val);
        }
        else {
            return this.add(val);
        }
    };
    ArrayState.prototype.clear = function () {
        return this.create([]);
    };
    ArrayState.prototype.remove = function (val) {
        return this.create(without(this.getValue(), val));
    };
    ArrayState.prototype.add = function (val) {
        return this.create(this.getValue().concat(val));
    };
    ArrayState.prototype.contains = function (val) {
        return contains(this.value, val);
    };
    return ArrayState;
})(State_1.State);
exports.ArrayState = ArrayState;
//# sourceMappingURL=ArrayState.js.map