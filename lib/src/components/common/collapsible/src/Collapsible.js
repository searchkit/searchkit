var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
require("../styles/index.scss");
var core_1 = require("../../../../core");
var Collapsible = (function (_super) {
    __extends(Collapsible, _super);
    function Collapsible(props) {
        _super.call(this, props);
        this.state = {
            collapsed: this.props.collapsed
        };
    }
    Collapsible.prototype.defineBEMBlocks = function () {
        return {
            "collapsible": "collapsible"
        };
    };
    Collapsible.prototype.toggleCollapsed = function () {
        this.state = {
            collapsed: !this.state.collapsed
        };
    };
    Collapsible.prototype.render = function () {
        var block = this.bemBlocks.collapsible;
        return (React.createElement("div", {"className": block().state({ collapsed: this.state.collapsed })}, React.createElement(core_1.FastClick, {"handler": this.toggleCollapsed.bind(this)}, this.props.children)));
    };
    return Collapsible;
})(core_1.SearchkitComponent);
exports.Collapsible = Collapsible;
//# sourceMappingURL=Collapsible.js.map