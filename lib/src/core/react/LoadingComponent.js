var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var SearchkitComponent_1 = require("./SearchkitComponent");
var LoadingComponent = (function (_super) {
    __extends(LoadingComponent, _super);
    function LoadingComponent() {
        _super.apply(this, arguments);
    }
    LoadingComponent.prototype.render = function () {
        if (this.isLoading()) {
            return this.props.children;
        }
        return React.createElement("div", null);
    };
    return LoadingComponent;
})(SearchkitComponent_1.SearchkitComponent);
exports.LoadingComponent = LoadingComponent;
//# sourceMappingURL=LoadingComponent.js.map