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
var PaginationAccessor = /** @class */ (function (_super) {
    __extends(PaginationAccessor, _super);
    function PaginationAccessor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = new state_1.ValueState();
        return _this;
    }
    PaginationAccessor.prototype.onStateChange = function (oldState) {
        if (oldState === void 0) { oldState = {}; }
        if (oldState[this.urlKey] == this.state.getValue()) {
            this.state = this.state.clear();
        }
    };
    PaginationAccessor.prototype.buildOwnQuery = function (query) {
        var from = (query.getSize() || 20) * (Number(this.state.getValue()) - 1);
        if (from > 0) {
            return query.setFrom(from);
        }
        return query;
    };
    return PaginationAccessor;
}(StatefulAccessor_1.StatefulAccessor));
exports.PaginationAccessor = PaginationAccessor;
//# sourceMappingURL=PaginationAccessor.js.map