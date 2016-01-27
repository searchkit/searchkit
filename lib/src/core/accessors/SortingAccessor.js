var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var state_1 = require("../state");
var StatefulAccessor_1 = require("./StatefulAccessor");
var find = require("lodash/find");
var SortingAccessor = (function (_super) {
    __extends(SortingAccessor, _super);
    function SortingAccessor(key, options) {
        _super.call(this, key);
        this.state = new state_1.ValueState();
        this.options = options;
    }
    SortingAccessor.prototype.buildOwnQuery = function (query) {
        var selectedSortOption = find(this.options.options, { label: this.state.getValue() });
        if (selectedSortOption) {
            query = query.setSort([(_a = {}, _a[selectedSortOption.field] = selectedSortOption.order, _a)]);
        }
        return query;
        var _a;
    };
    return SortingAccessor;
})(StatefulAccessor_1.StatefulAccessor);
exports.SortingAccessor = SortingAccessor;
//# sourceMappingURL=SortingAccessor.js.map