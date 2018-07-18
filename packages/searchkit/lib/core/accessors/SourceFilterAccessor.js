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
var Accessor_1 = require("./Accessor");
var SourceFilterAccessor = /** @class */ (function (_super) {
    __extends(SourceFilterAccessor, _super);
    function SourceFilterAccessor(source) {
        var _this = _super.call(this) || this;
        _this.source = source;
        return _this;
    }
    SourceFilterAccessor.prototype.buildSharedQuery = function (query) {
        return query.setSource(this.source);
    };
    return SourceFilterAccessor;
}(Accessor_1.Accessor));
exports.SourceFilterAccessor = SourceFilterAccessor;
//# sourceMappingURL=SourceFilterAccessor.js.map