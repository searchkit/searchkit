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
var FieldContext_1 = require("./FieldContext");
var EmbeddedFieldContext = /** @class */ (function (_super) {
    __extends(EmbeddedFieldContext, _super);
    function EmbeddedFieldContext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EmbeddedFieldContext.prototype.getAggregationPath = function () {
        return undefined;
    };
    EmbeddedFieldContext.prototype.wrapAggregations = function () {
        var aggregations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            aggregations[_i] = arguments[_i];
        }
        return aggregations;
    };
    EmbeddedFieldContext.prototype.wrapFilter = function (filter) {
        return filter;
    };
    return EmbeddedFieldContext;
}(FieldContext_1.FieldContext));
exports.EmbeddedFieldContext = EmbeddedFieldContext;
//# sourceMappingURL=EmbeddedFieldContext.js.map