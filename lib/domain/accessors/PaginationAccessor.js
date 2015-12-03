var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Accessor_ts_1 = require("./Accessor.ts");
var PaginationAccessor = (function (_super) {
    __extends(PaginationAccessor, _super);
    function PaginationAccessor() {
        _super.apply(this, arguments);
    }
    PaginationAccessor.prototype.setSearcher = function (searcher) {
        _super.prototype.setSearcher.call(this, searcher);
        this.searcher.stateManager.state.addAutoExpiryKey(this.key);
    };
    PaginationAccessor.prototype.searchReset = function () {
        this.state.clear();
    };
    PaginationAccessor.prototype.buildPostQuery = function (builder, page) {
        var from = builder.size * (page - 1);
        builder.setFrom(from);
    };
    return PaginationAccessor;
})(Accessor_ts_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PaginationAccessor;
//# sourceMappingURL=PaginationAccessor.js.map