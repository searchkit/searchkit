var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Accessor_1 = require("./Accessor");
var PageSizeAccessor = (function (_super) {
    __extends(PageSizeAccessor, _super);
    function PageSizeAccessor(size) {
        _super.call(this);
        this.size = size;
    }
    PageSizeAccessor.prototype.buildSharedQuery = function (query) {
        return query.setSize(this.size);
    };
    return PageSizeAccessor;
})(Accessor_1.Accessor);
exports.PageSizeAccessor = PageSizeAccessor;
//# sourceMappingURL=PageSizeAccessor.js.map