var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State = (function () {
    function State(defaultValue) {
        this.value = defaultValue;
    }
    State.prototype.setValue = function (value) {
        this.value = value;
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
    return ArrayState;
})(State);
exports.ArrayState = ArrayState;
var ObjectState = (function (_super) {
    __extends(ObjectState, _super);
    function ObjectState() {
        _super.apply(this, arguments);
    }
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