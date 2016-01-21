var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State_1 = require("./State");
var isEmpty = require("lodash/isEmpty");
var ObjectState = (function (_super) {
    __extends(ObjectState, _super);
    function ObjectState() {
        _super.apply(this, arguments);
    }
    ObjectState.prototype.getValue = function () {
        return this.value || {};
    };
    ObjectState.prototype.hasValue = function () {
        return !isEmpty(this.value);
    };
    return ObjectState;
})(State_1.State);
exports.ObjectState = ObjectState;
//# sourceMappingURL=ObjectState.js.map