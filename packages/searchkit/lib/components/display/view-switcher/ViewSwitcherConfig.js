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
var PropTypes = require("prop-types");
var defaults = require("lodash/defaults");
var core_1 = require("../../../core");
var ViewSwitcherConfig = /** @class */ (function (_super) {
    __extends(ViewSwitcherConfig, _super);
    function ViewSwitcherConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ViewSwitcherConfig.prototype.defineAccessor = function () {
        return new core_1.ViewOptionsAccessor("view", this.props.hitComponents);
    };
    ViewSwitcherConfig.prototype.render = function () {
        return null;
    };
    ViewSwitcherConfig.propTypes = defaults({
        hitComponents: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            itemComponent: core_1.RenderComponentPropType,
            listComponent: core_1.RenderComponentPropType,
            defaultOption: PropTypes.bool
        }))
    }, core_1.SearchkitComponent.propTypes);
    return ViewSwitcherConfig;
}(core_1.SearchkitComponent));
exports.ViewSwitcherConfig = ViewSwitcherConfig;
//# sourceMappingURL=ViewSwitcherConfig.js.map