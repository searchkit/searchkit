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
var indexOf = require("lodash/indexOf");
var without = require("lodash/without");
var ArrayState = /** @class */ (function (_super) {
    __extends(ArrayState, _super);
    function ArrayState() {
        return _super !== null && _super.apply(this, arguments) || this;
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
        return indexOf(this.value, val) !== -1;
    };
    return ArrayState;
}(State_1.State));
exports.ArrayState = ArrayState;
//# sourceMappingURL=ArrayState.js.map