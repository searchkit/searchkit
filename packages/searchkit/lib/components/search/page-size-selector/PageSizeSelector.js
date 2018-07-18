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
var core_1 = require("../../../core");
var map = require("lodash/map");
var defaults = require("lodash/defaults");
var ui_1 = require("../../ui");
var PageSizeSelector = /** @class */ (function (_super) {
    __extends(PageSizeSelector, _super);
    function PageSizeSelector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PageSizeSelector.prototype.getPageSizeAccessor = function () {
        return this.searchkit.getAccessorByType(core_1.PageSizeAccessor);
    };
    PageSizeSelector.prototype.setSize = function (size) {
        var pageSizeAccessor = this.getPageSizeAccessor();
        if (size) {
            pageSizeAccessor.setSize(Number(size));
            this.searchkit.performSearch();
        }
    };
    PageSizeSelector.prototype.setItems = function (sizes) {
        this.setSize(sizes[0]);
    };
    PageSizeSelector.prototype.render = function () {
        var pageSizeAccessor = this.getPageSizeAccessor();
        if (pageSizeAccessor) {
            var options = map(this.props.options, function (option) {
                return { key: option, label: option };
            });
            var selectedSize = pageSizeAccessor.getSize();
            var _a = this.props, mod = _a.mod, className = _a.className;
            return core_1.renderComponent(this.props.listComponent, {
                mod: mod, className: className,
                disabled: !this.hasHits(),
                items: options,
                selectedItems: [selectedSize],
                toggleItem: this.setSize.bind(this),
                setItems: this.setItems.bind(this),
                urlBuilder: function (_item) { },
                translate: this.translate
            });
        }
        return null;
    };
    PageSizeSelector.defaultProps = {
        listComponent: ui_1.Select
    };
    PageSizeSelector.propTypes = defaults({
        listComponent: core_1.RenderComponentPropType,
        options: PropTypes.arrayOf(PropTypes.number).isRequired
    }, core_1.SearchkitComponent.propTypes);
    return PageSizeSelector;
}(core_1.SearchkitComponent));
exports.PageSizeSelector = PageSizeSelector;
//# sourceMappingURL=PageSizeSelector.js.map