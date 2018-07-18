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
var FilterBasedAccessor_1 = require("./FilterBasedAccessor");
var query_1 = require("../query");
var assign = require("lodash/assign");
var CheckboxFilterAccessor = /** @class */ (function (_super) {
    __extends(CheckboxFilterAccessor, _super);
    function CheckboxFilterAccessor(key, options) {
        var _this = _super.call(this, key, options.id) || this;
        _this.state = new state_1.State(false);
        _this.options = options;
        _this.filter = options.filter;
        _this.state = _this.state.create(options.defaultValue);
        _this.translations = assign({}, options.translations);
        return _this;
    }
    CheckboxFilterAccessor.prototype.getDocCount = function () {
        return this.getAggregations([this.uuid, "doc_count"], 0);
    };
    CheckboxFilterAccessor.prototype.buildSharedQuery = function (query) {
        var _this = this;
        if (this.state.getValue()) {
            query = query.addFilter(this.uuid, this.filter)
                .addSelectedFilter({
                name: this.options.title || this.translate(this.key),
                value: this.options.label || this.translate("checkbox.on"),
                id: this.options.id,
                remove: function () { return _this.state = _this.state.setValue(false); }
            });
        }
        return query;
    };
    CheckboxFilterAccessor.prototype.buildOwnQuery = function (query) {
        var filters = query.getFilters();
        if (!this.state.getValue()) {
            if (filters)
                filters = query_1.BoolMust([filters, this.filter]);
            else
                filters = this.filter;
        }
        return query
            .setAggs(query_1.FilterBucket(this.uuid, filters));
    };
    CheckboxFilterAccessor.translations = {
        "checkbox.on": "active"
    };
    return CheckboxFilterAccessor;
}(FilterBasedAccessor_1.FilterBasedAccessor));
exports.CheckboxFilterAccessor = CheckboxFilterAccessor;
//# sourceMappingURL=CheckboxFilterAccessor.js.map