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
var core_1 = require("../../../../core");
var ui_1 = require("../../../ui");
var defaults = require("lodash/defaults");
var SortingSelector = /** @class */ (function (_super) {
    __extends(SortingSelector, _super);
    function SortingSelector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SortingSelector.prototype.defineAccessor = function () {
        return new core_1.SortingAccessor("sort", { options: this.props.options });
    };
    SortingSelector.prototype.toggleItem = function (key) {
        this.accessor.state = this.accessor.state.setValue(key);
        this.searchkit.performSearch();
    };
    SortingSelector.prototype.setItems = function (keys) {
        this.toggleItem(keys[0]);
    };
    SortingSelector.prototype.render = function () {
        var _this = this;
        var listComponent = this.props.listComponent;
        var options = this.accessor.options.options;
        var selected = [this.accessor.getSelectedOption().key];
        var disabled = !this.hasHits();
        return core_1.renderComponent(listComponent, {
            mod: this.props.mod,
            className: this.props.className,
            items: options,
            selectedItems: selected,
            setItems: this.setItems.bind(this),
            toggleItem: this.toggleItem.bind(this),
            disabled: disabled,
            urlBuilder: function (item) { return _this.accessor.urlWithState(item.key); },
            translate: this.translate
        });
    };
    SortingSelector.propTypes = defaults({
        listComponent: core_1.RenderComponentPropType,
        options: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            field: PropTypes.string,
            order: PropTypes.string,
            defaultOption: PropTypes.bool
        }))
    }, core_1.SearchkitComponent.propTypes);
    SortingSelector.defaultProps = {
        listComponent: ui_1.Select
    };
    return SortingSelector;
}(core_1.SearchkitComponent));
exports.SortingSelector = SortingSelector;
//# sourceMappingURL=SortingSelector.js.map