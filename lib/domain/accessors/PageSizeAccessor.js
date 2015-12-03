var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Accessor_ts_1 = require("./Accessor.ts");
var PageSizeAccessor = (function (_super) {
    __extends(PageSizeAccessor, _super);
    function PageSizeAccessor() {
        _super.apply(this, arguments);
    }
    PageSizeAccessor.prototype.buildPostQuery = function (builder, pageSize) {
        builder.setSize(pageSize);
    };
    return PageSizeAccessor;
})(Accessor_ts_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PageSizeAccessor;
//# sourceMappingURL=PageSizeAccessor.js.map