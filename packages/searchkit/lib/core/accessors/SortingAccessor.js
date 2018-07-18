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
var support_1 = require("../support");
var find = require("lodash/find");
var head = require("lodash/head");
var map = require("lodash/map");
var SortingAccessor = /** @class */ (function (_super) {
    __extends(SortingAccessor, _super);
    function SortingAccessor(key, options) {
        var _this = _super.call(this, key) || this;
        _this.state = new state_1.ValueState();
        _this.options = options;
        _this.options.options = support_1.Utils.computeOptionKeys(_this.options.options, ["field", "order"], "none");
        return _this;
    }
    SortingAccessor.prototype.getSelectedOption = function () {
        var options = this.options.options;
        return find(options, { key: "" + this.state.getValue() }) ||
            find(options, { defaultOption: true }) ||
            head(options);
    };
    SortingAccessor.prototype.getSortQuery = function (sortOption) {
        if (sortOption.fields) {
            return map(sortOption.fields, function (field) {
                return _a = {}, _a[field.field] = field.options || {}, _a;
                var _a;
            });
        }
        else if (sortOption.field && sortOption.order) {
            return [(_a = {}, _a[sortOption.field] = sortOption.order, _a)];
        }
        else if (sortOption.field) {
            return [sortOption.field];
        }
        return null;
        var _a;
    };
    SortingAccessor.prototype.buildOwnQuery = function (query) {
        var selectedSortOption = this.getSelectedOption();
        if (selectedSortOption) {
            var sortQuery = this.getSortQuery(selectedSortOption);
            if (sortQuery) {
                query = query.setSort(sortQuery);
            }
        }
        return query;
    };
    return SortingAccessor;
}(StatefulAccessor_1.StatefulAccessor));
exports.SortingAccessor = SortingAccessor;
//# sourceMappingURL=SortingAccessor.js.map