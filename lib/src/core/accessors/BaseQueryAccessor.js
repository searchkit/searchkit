var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var state_1 = require("../state");
var StatefulAccessor_1 = require("./StatefulAccessor");
var BaseQueryAccessor = (function (_super) {
    __extends(BaseQueryAccessor, _super);
    function BaseQueryAccessor(key) {
        _super.call(this, key);
        this.state = new state_1.ValueState();
    }
    BaseQueryAccessor.prototype.keepOnlyQueryState = function () {
        this.setQueryString(this.getQueryString(), true);
    };
    BaseQueryAccessor.prototype.setQueryString = function (queryString, withReset) {
        if (withReset === void 0) { withReset = false; }
        if (withReset) {
            this.searchkit.resetState();
        }
        this.state = this.state.setValue(queryString);
    };
    BaseQueryAccessor.prototype.getQueryString = function () {
        return this.state.getValue();
    };
    return BaseQueryAccessor;
})(StatefulAccessor_1.StatefulAccessor);
exports.BaseQueryAccessor = BaseQueryAccessor;
//# sourceMappingURL=BaseQueryAccessor.js.map