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
var core_1 = require("../../../../../core");
var defaults = require("lodash/defaults");
var ResetFiltersDisplay = /** @class */ (function (_super) {
    __extends(ResetFiltersDisplay, _super);
    function ResetFiltersDisplay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResetFiltersDisplay.prototype.render = function () {
        var _a = this.props, bemBlock = _a.bemBlock, hasFilters = _a.hasFilters, resetFilters = _a.resetFilters, clearAllLabel = _a.clearAllLabel;
        return (React.createElement("div", null,
            React.createElement(core_1.FastClick, { handler: resetFilters },
                React.createElement("div", { className: bemBlock().state({ disabled: !hasFilters }) },
                    React.createElement("div", { className: bemBlock("reset") }, clearAllLabel)))));
    };
    return ResetFiltersDisplay;
}(React.PureComponent));
exports.ResetFiltersDisplay = ResetFiltersDisplay;
var ResetFilters = /** @class */ (function (_super) {
    __extends(ResetFilters, _super);
    function ResetFilters(props) {
        var _this = _super.call(this, props) || this;
        _this.translations = ResetFilters.translations;
        _this.resetFilters = _this.resetFilters.bind(_this);
        return _this;
    }
    ResetFilters.prototype.defineBEMBlocks = function () {
        return {
            container: (this.props.mod || "sk-reset-filters")
        };
    };
    ResetFilters.prototype.defineAccessor = function () {
        return new core_1.ResetSearchAccessor(this.props.options);
    };
    ResetFilters.prototype.resetFilters = function () {
        this.accessor.performReset();
        this.searchkit.performSearch();
    };
    ResetFilters.prototype.render = function () {
        var props = {
            bemBlock: this.bemBlocks.container,
            resetFilters: this.resetFilters,
            hasFilters: this.accessor.canReset(),
            translate: this.translate,
            clearAllLabel: this.translate("reset.clear_all")
        };
        return core_1.renderComponent(this.props.component, props);
    };
    ResetFilters.translations = {
        "reset.clear_all": "Clear all filters"
    };
    ResetFilters.propTypes = defaults({
        translations: core_1.SearchkitComponent.translationsPropType(ResetFilters.translations),
        component: PropTypes.func,
        options: PropTypes.object
    }, core_1.SearchkitComponent.propTypes);
    ResetFilters.defaultProps = {
        component: ResetFiltersDisplay
    };
    return ResetFilters;
}(core_1.SearchkitComponent));
exports.ResetFilters = ResetFilters;
//# sourceMappingURL=ResetFilters.js.map