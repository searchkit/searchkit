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
var state_1 = require("../state");
var StatefulAccessor_1 = require("./StatefulAccessor");
var BaseQueryAccessor = /** @class */ (function (_super) {
    __extends(BaseQueryAccessor, _super);
    function BaseQueryAccessor(key) {
        var _this = _super.call(this, key) || this;
        _this.state = new state_1.ValueState();
        return _this;
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
}(StatefulAccessor_1.StatefulAccessor));
exports.BaseQueryAccessor = BaseQueryAccessor;
var NoopQueryAccessor = /** @class */ (function (_super) {
    __extends(NoopQueryAccessor, _super);
    function NoopQueryAccessor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoopQueryAccessor.prototype.keepOnlyQueryState = function () {
        console.warn("keepOnlyQueryState called, No Query Accessor exists");
    };
    NoopQueryAccessor.prototype.setQueryString = function (_queryString, _withReset) {
        if (_withReset === void 0) { _withReset = false; }
        console.warn("setQueryString called, No Query Accessor exists");
    };
    NoopQueryAccessor.prototype.getQueryString = function () {
        console.warn("getQueryString called, No Query Accessor exists");
        return "";
    };
    return NoopQueryAccessor;
}(BaseQueryAccessor));
exports.NoopQueryAccessor = NoopQueryAccessor;
exports.noopQueryAccessor = new NoopQueryAccessor(null);
//# sourceMappingURL=BaseQueryAccessor.js.map