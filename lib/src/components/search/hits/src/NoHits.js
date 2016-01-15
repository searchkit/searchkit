var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
require("../styles/no-hits.scss");
var core_1 = require("../../../../core");
var NoHits = (function (_super) {
    __extends(NoHits, _super);
    function NoHits() {
        _super.apply(this, arguments);
    }
    NoHits.prototype.defineBEMBlocks = function () {
        var block = (this.props.mod || "no-hits");
        return {
            container: block
        };
    };
    NoHits.prototype.render = function () {
        if (this.hasHits())
            return null;
        return (React.createElement("div", {"data-qa": "no-hits", "className": this.bemBlocks.container()}, "no results found"));
    };
    return NoHits;
})(core_1.SearchkitComponent);
exports.NoHits = NoHits;
//# sourceMappingURL=NoHits.js.map