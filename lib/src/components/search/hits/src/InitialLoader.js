var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
require("../styles/index.scss");
var core_1 = require("../../../../core");
var renderInitialView = function (_a) {
    var bemBlocks = _a.bemBlocks;
    return (React.createElement("div", {"className": bemBlocks.container()}, React.createElement("div", {"data-qa": "initial-loading", "className": bemBlocks.container("initial-loading")})));
};
var InitialLoader = (function (_super) {
    __extends(InitialLoader, _super);
    function InitialLoader() {
        _super.apply(this, arguments);
    }
    InitialLoader.prototype.defineBEMBlocks = function () {
        var block = (this.props.mod || "initial-loader");
        return {
            container: block
        };
    };
    InitialLoader.prototype.render = function () {
        var initialViewComponent = this.props.component || renderInitialView;
        if (this.isInitialLoading()) {
            return React.createElement(initialViewComponent, { bemBlocks: this.bemBlocks });
        }
        return null;
    };
    return InitialLoader;
})(core_1.SearchkitComponent);
exports.InitialLoader = InitialLoader;
//# sourceMappingURL=InitialLoader.js.map