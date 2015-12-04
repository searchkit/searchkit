var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State_1 = require("../state/State");
var Accessor_1 = require("./Accessor");
var PageSizeAccessor = (function (_super) {
    __extends(PageSizeAccessor, _super);
    function PageSizeAccessor(key, size) {
        _super.call(this, key);
        this.state = new State_1.ValueState();
        this.size = size;
    }
    PageSizeAccessor.prototype.buildOwnQuery = function (query) {
        return query.setSize(this.size);
    };
    return PageSizeAccessor;
})(Accessor_1.Accessor);
exports.PageSizeAccessor = PageSizeAccessor;
//# sourceMappingURL=PageSizeAccessor.js.map