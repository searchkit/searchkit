var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Accessor_ts_1 = require("./Accessor.ts");
var SimpleQueryField_ts_1 = require("../builders/SimpleQueryField.ts");
var SimpleQueryAccessor = (function (_super) {
    __extends(SimpleQueryAccessor, _super);
    function SimpleQueryAccessor() {
        _super.apply(this, arguments);
    }
    SimpleQueryAccessor.prototype.buildQuery = function (builder, query) {
        if (query) {
            var simpleQueryField = new SimpleQueryField_ts_1.default();
            simpleQueryField.set(query);
            builder.setQuery(simpleQueryField);
        }
    };
    return SimpleQueryAccessor;
})(Accessor_ts_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SimpleQueryAccessor;
//# sourceMappingURL=SimpleQueryAccessor.js.map