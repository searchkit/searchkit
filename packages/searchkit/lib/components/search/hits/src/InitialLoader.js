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
var React = require("react");
var PropTypes = require("prop-types");
var core_1 = require("../../../../core");
var defaults = require("lodash/defaults");
var InitialViewDisplay = /** @class */ (function (_super) {
    __extends(InitialViewDisplay, _super);
    function InitialViewDisplay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InitialViewDisplay.prototype.render = function () {
        return (React.createElement("div", { className: this.props.bemBlocks.container() },
            React.createElement("div", { "data-qa": "initial-loading", className: this.props.bemBlocks.container("initial-loading") })));
    };
    return InitialViewDisplay;
}(React.PureComponent));
exports.InitialViewDisplay = InitialViewDisplay;
var InitialLoader = /** @class */ (function (_super) {
    __extends(InitialLoader, _super);
    function InitialLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InitialLoader.prototype.defineBEMBlocks = function () {
        var block = (this.props.mod || "sk-initial-loader");
        return {
            container: block
        };
    };
    InitialLoader.prototype.render = function () {
        if (this.isInitialLoading()) {
            return core_1.renderComponent(this.props.component, {
                bemBlocks: this.bemBlocks
            });
        }
        return null;
    };
    InitialLoader.defaultProps = {
        component: InitialViewDisplay
    };
    InitialLoader.propTypes = defaults({
        component: PropTypes.func
    }, core_1.SearchkitComponent.propTypes);
    return InitialLoader;
}(core_1.SearchkitComponent));
exports.InitialLoader = InitialLoader;
//# sourceMappingURL=InitialLoader.js.map