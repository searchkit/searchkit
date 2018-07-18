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
var core_1 = require("../../../../../core");
var ui_1 = require("../../../../ui");
var defaults = require("lodash/defaults");
var get = require("lodash/get");
var RangeFilter = /** @class */ (function (_super) {
    __extends(RangeFilter, _super);
    function RangeFilter(props) {
        var _this = _super.call(this, props) || this;
        _this.sliderUpdate = _this.sliderUpdate.bind(_this);
        _this.sliderUpdateAndSearch = _this.sliderUpdateAndSearch.bind(_this);
        return _this;
    }
    RangeFilter.prototype.defineAccessor = function () {
        var _a = this.props, id = _a.id, title = _a.title, min = _a.min, max = _a.max, field = _a.field, fieldOptions = _a.fieldOptions, interval = _a.interval, showHistogram = _a.showHistogram, rangeFormatter = _a.rangeFormatter, translations = _a.translations;
        return new core_1.RangeAccessor(id, {
            id: id, min: min, max: max, title: title, field: field, rangeFormatter: rangeFormatter, translations: translations,
            interval: interval, loadHistogram: showHistogram, fieldOptions: fieldOptions
        });
    };
    RangeFilter.prototype.defineBEMBlocks = function () {
        var block = this.props.mod || "sk-range-filter";
        return {
            container: block,
            labels: block + "-value-labels"
        };
    };
    RangeFilter.prototype.sliderUpdate = function (newValues) {
        if ((newValues.min == this.props.min) && (newValues.max == this.props.max)) {
            this.accessor.state = this.accessor.state.clear();
        }
        else {
            this.accessor.state = this.accessor.state.setValue(newValues);
        }
        this.forceUpdate();
    };
    RangeFilter.prototype.sliderUpdateAndSearch = function (newValues) {
        this.sliderUpdate(newValues);
        this.searchkit.performSearch();
    };
    RangeFilter.prototype.getRangeComponent = function () {
        var _a = this.props, rangeComponent = _a.rangeComponent, showHistogram = _a.showHistogram;
        if (!showHistogram && (rangeComponent === ui_1.RangeSliderHistogram)) {
            return ui_1.RangeSlider;
        }
        else {
            return rangeComponent;
        }
    };
    RangeFilter.prototype.render = function () {
        var _a = this.props, id = _a.id, title = _a.title, containerComponent = _a.containerComponent;
        return core_1.renderComponent(containerComponent, {
            title: title,
            className: id ? "filter--" + id : undefined,
            disabled: this.accessor.isDisabled()
        }, this.renderRangeComponent(this.getRangeComponent()));
    };
    RangeFilter.prototype.renderRangeComponent = function (component) {
        var _a = this.props, min = _a.min, max = _a.max, rangeFormatter = _a.rangeFormatter, marks = _a.marks;
        var state = this.accessor.state.getValue();
        return core_1.renderComponent(component, {
            min: min, max: max,
            minValue: Number(get(state, "min", min)),
            maxValue: Number(get(state, "max", max)),
            items: this.accessor.getBuckets(),
            onChange: this.sliderUpdate,
            onFinished: this.sliderUpdateAndSearch,
            rangeFormatter: rangeFormatter, marks: marks
        });
    };
    RangeFilter.propTypes = defaults({
        field: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        containerComponent: core_1.RenderComponentPropType,
        rangeComponent: core_1.RenderComponentPropType,
        fieldOptions: PropTypes.shape({
            type: PropTypes.oneOf(["embedded", "nested", "children"]).isRequired,
            options: PropTypes.object
        }),
        rangeFormatter: PropTypes.func,
        marks: PropTypes.object
    }, core_1.SearchkitComponent.propTypes);
    RangeFilter.defaultProps = {
        containerComponent: ui_1.Panel,
        rangeComponent: ui_1.RangeSliderHistogram,
        showHistogram: true
    };
    return RangeFilter;
}(core_1.SearchkitComponent));
exports.RangeFilter = RangeFilter;
//# sourceMappingURL=RangeFilter.js.map