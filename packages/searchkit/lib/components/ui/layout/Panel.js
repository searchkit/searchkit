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
var core_1 = require("../../../core");
var Panel = /** @class */ (function (_super) {
    __extends(Panel, _super);
    function Panel(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            collapsed: props.defaultCollapsed
        };
        return _this;
    }
    Panel.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.defaultCollapsed != this.props.defaultCollapsed) {
            this.setState({
                collapsed: nextProps.defaultCollapsed
            });
        }
    };
    Panel.prototype.toggleCollapsed = function () {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };
    Panel.prototype.render = function () {
        var _a = this.props, title = _a.title, mod = _a.mod, className = _a.className, disabled = _a.disabled, children = _a.children, collapsable = _a.collapsable;
        var collapsed = collapsable && this.state.collapsed;
        var containerBlock = core_1.block(mod)
            .state({ disabled: disabled });
        var titleDiv;
        if (collapsable) {
            titleDiv = (React.createElement("div", { className: containerBlock.el("header").state({ collapsable: collapsable, collapsed: collapsed }), onClick: this.toggleCollapsed.bind(this) }, title));
        }
        else {
            titleDiv = React.createElement("div", { className: containerBlock.el("header") }, title);
        }
        return (React.createElement("div", { className: containerBlock.mix(className) },
            titleDiv,
            React.createElement("div", { className: containerBlock.el("content").state({ collapsed: collapsed }) }, children)));
    };
    Panel.propTypes = {
        title: PropTypes.string,
        disabled: PropTypes.bool,
        mod: PropTypes.string,
        className: PropTypes.string,
        collapsable: PropTypes.bool,
        defaultCollapsed: PropTypes.bool
    };
    Panel.defaultProps = {
        disabled: false,
        collapsable: false,
        defaultCollapsed: true,
        mod: "sk-panel"
    };
    return Panel;
}(React.PureComponent));
exports.Panel = Panel;
//# sourceMappingURL=Panel.js.map