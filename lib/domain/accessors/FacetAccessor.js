var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Accessor_ts_1 = require("./Accessor.ts");
var _ = require("lodash");
var BoolField_ts_1 = require("../builders/BoolField.ts");
var FacetAccessor = (function (_super) {
    __extends(FacetAccessor, _super);
    function FacetAccessor() {
        _super.apply(this, arguments);
    }
    FacetAccessor.prototype.getBuckets = function () {
        var results = this.getResults();
        var path = ['aggregations', this.key, this.key, 'buckets'];
        return _.get(results, path, []);
    };
    FacetAccessor.prototype.searchReset = function () {
        this.state.clear();
    };
    FacetAccessor.prototype.buildQuery = function (builder) {
        var _this = this;
        var stateValues = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            stateValues[_i - 1] = arguments[_i];
        }
        var boolField = new BoolField_ts_1.default();
        var makeTerm = function (value) {
            return { term: (_a = {}, _a[_this.key] = value, _a) };
            var _a;
        };
        var terms = _.map(stateValues, makeTerm);
        if (terms.length > 0) {
            if (this.isOrOperator()) {
                boolField.should(terms);
            }
            else {
                boolField.must(terms);
            }
            builder.addFilter(this.key, boolField);
        }
    };
    FacetAccessor.prototype.isOrOperator = function () {
        return this.options["operator"] === "OR";
    };
    FacetAccessor.prototype.buildPostQuery = function (builder) {
        var stateValues = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            stateValues[_i - 1] = arguments[_i];
        }
        var excludedKey = undefined;
        if (this.isOrOperator()) {
            excludedKey = this.key;
        }
        builder.setAggs(this.key, {
            filter: builder.getFilters(excludedKey),
            aggs: (_a = {},
                _a[this.key] = {
                    terms: {
                        field: this.key,
                        size: 100
                    }
                },
                _a
            )
        });
        var _a;
    };
    return FacetAccessor;
})(Accessor_ts_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FacetAccessor;
//# sourceMappingURL=FacetAccessor.js.map