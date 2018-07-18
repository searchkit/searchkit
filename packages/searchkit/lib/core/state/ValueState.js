var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var State_1 = require("./State");
var ValueState = /** @class */ (function (_super) {
    __extends(ValueState, _super);
    function ValueState() {
        return _super !== null && _super.apply(this, arguments) || this;
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
}(State_1.State));
exports.ValueState = ValueState;
//# sourceMappingURL=ValueState.js.map