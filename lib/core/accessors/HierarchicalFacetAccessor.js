var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State_1 = require("../state/State");
var Accessor_1 = require("./Accessor");
var HierarchicalFacetAccessor = (function (_super) {
    __extends(HierarchicalFacetAccessor, _super);
    function HierarchicalFacetAccessor(key, options) {
        _super.call(this, key);
        this.state = new State_1.ObjectState();
        this.options = options;
    }
    return HierarchicalFacetAccessor;
})(Accessor_1.Accessor);
exports.HierarchicalFacetAccessor = HierarchicalFacetAccessor;
//# sourceMappingURL=HierarchicalFacetAccessor.js.map