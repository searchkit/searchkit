var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var State = (function () {
    function State(value) {
        if (value === void 0) { value = null; }
        this.value = value;
    }
    State.prototype.create = function (value) {
        return new this.constructor(value);
    };
    State.prototype.setValue = function (value) {
        return this.create(value);
    };
    State.prototype.clear = function () {
        return this.create(null);
    };
    State.prototype.getValue = function () {
        return this.value;
    };
    return State;
})();
exports.State = State;
var ArrayState = (function (_super) {
    __extends(ArrayState, _super);
    function ArrayState() {
        _super.apply(this, arguments);
    }
    ArrayState.prototype.lazyInit = function () {
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
        return this.create(_.without(this.lazyInit(), val));
    };
    ArrayState.prototype.add = function (val) {
        return this.create(this.lazyInit().concat(val));
    };
    ArrayState.prototype.contains = function (val) {
        return _.contains(this.value, val);
    };
    return ArrayState;
})(State);
exports.ArrayState = ArrayState;
var ObjectState = (function (_super) {
    __extends(ObjectState, _super);
    function ObjectState() {
        _super.apply(this, arguments);
    }
    ObjectState.prototype.lazyInit = function () {
        return this.value || {};
    };
    return ObjectState;
})(State);
exports.ObjectState = ObjectState;
var ValueState = (function (_super) {
    __extends(ValueState, _super);
    function ValueState() {
        _super.apply(this, arguments);
    }
    return ValueState;
})(State);
exports.ValueState = ValueState;
//# sourceMappingURL=State.js.map