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
var _1 = require("./");
var each = require("lodash/each");
var ResetSearchAccessor = /** @class */ (function (_super) {
    __extends(ResetSearchAccessor, _super);
    function ResetSearchAccessor(options) {
        if (options === void 0) { options = { query: true, filter: true, pagination: true }; }
        var _this = _super.call(this) || this;
        _this.options = options;
        return _this;
    }
    ResetSearchAccessor.prototype.canReset = function () {
        var query = this.searchkit.query;
        var options = this.options;
        return ((options.pagination && query.getFrom() > 0) ||
            (options.query && query.getQueryString().length > 0) ||
            (options.filter && query.getSelectedFilters().length > 0));
    };
    ResetSearchAccessor.prototype.performReset = function () {
        var query = this.searchkit.query;
        if (this.options.query) {
            this.searchkit.getQueryAccessor().resetState();
        }
        if (this.options.filter) {
            var filters = this.searchkit.getAccessorsByType(_1.FilterBasedAccessor);
            each(filters, function (accessor) { return accessor.resetState(); });
            each(query.getSelectedFilters() || [], function (f) { return f.remove(); });
        }
        var paginationAccessor = this.searchkit.getAccessorByType(_1.PaginationAccessor);
        if (this.options.pagination && paginationAccessor) {
            paginationAccessor.resetState();
        }
    };
    return ResetSearchAccessor;
}(_1.Accessor));
exports.ResetSearchAccessor = ResetSearchAccessor;
//# sourceMappingURL=ResetSearchAccessor.js.map