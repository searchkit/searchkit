var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var state_1 = require("../state");
var StatefulAccessor_1 = require("./StatefulAccessor");
var PaginationAccessor = (function (_super) {
    __extends(PaginationAccessor, _super);
    function PaginationAccessor() {
        _super.apply(this, arguments);
        this.state = new state_1.ValueState();
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
})(StatefulAccessor_1.StatefulAccessor);
exports.PaginationAccessor = PaginationAccessor;
//# sourceMappingURL=PaginationAccessor.js.map