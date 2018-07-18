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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require("prop-types");
var defaults = require("lodash/defaults");
var core_1 = require("../../../core");
var _1 = require("../../");
var ViewSwitcherHits = /** @class */ (function (_super) {
    __extends(ViewSwitcherHits, _super);
    function ViewSwitcherHits() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ViewSwitcherHits.prototype.defineAccessor = function () {
        return new core_1.ViewOptionsAccessor("view", this.props.hitComponents);
    };
    ViewSwitcherHits.prototype.render = function () {
        var selectedOption = this.accessor.getSelectedOption();
        var props = __assign({}, this.props, { itemComponent: selectedOption.itemComponent, listComponent: selectedOption.listComponent, mod: 'sk-hits-' + selectedOption.key });
        return (React.createElement(_1.Hits, __assign({}, props)));
    };
    ViewSwitcherHits.propTypes = defaults({
        hitComponents: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            itemComponent: core_1.RenderComponentPropType,
            listComponent: core_1.RenderComponentPropType,
            defaultOption: PropTypes.bool
        }))
    }, _1.Hits.propTypes);
    return ViewSwitcherHits;
}(core_1.SearchkitComponent));
exports.ViewSwitcherHits = ViewSwitcherHits;
//# sourceMappingURL=ViewSwitcherHits.js.map