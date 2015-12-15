var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State_1 = require("./State");
var ValueState = (function (_super) {
    __extends(ValueState, _super);
    function ValueState() {
        _super.apply(this, arguments);
    }
    ValueState.prototype.toggle = function (value) {
        if (this.is(value)) {
            return this.clear();
        }
        else {
            return this.setValue(value);
        }
    };
    ValueState.prototype.is = function (value) {
        return this.value === value;
    };
    return ValueState;
})(State_1.State);
exports.ValueState = ValueState;
//# sourceMappingURL=ValueState.js.map