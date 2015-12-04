var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State_1 = require("../state/State");
var Accessor_1 = require("./Accessor");
var PaginationAccessor = (function (_super) {
    __extends(PaginationAccessor, _super);
    function PaginationAccessor() {
        _super.apply(this, arguments);
        this.state = new State_1.ValueState();
    }
    PaginationAccessor.prototype.buildOwnQuery = function (query) {
        var from = query.size * Number(this.state.getValue()) - 1;
        return query.setFrom(from);
    };
    return PaginationAccessor;
})(Accessor_1.Accessor);
exports.PaginationAccessor = PaginationAccessor;
//# sourceMappingURL=PaginationAccessor.js.map