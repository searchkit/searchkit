var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Accessor_1 = require("./Accessor");
var AnonymousAccessor = (function (_super) {
    __extends(AnonymousAccessor, _super);
    function AnonymousAccessor(buildSharedQuery) {
        _super.call(this);
        if (buildSharedQuery) {
            this.buildSharedQuery = buildSharedQuery;
        }
    }
    return AnonymousAccessor;
})(Accessor_1.Accessor);
exports.AnonymousAccessor = AnonymousAccessor;
//# sourceMappingURL=AnonymousAccessor.js.map