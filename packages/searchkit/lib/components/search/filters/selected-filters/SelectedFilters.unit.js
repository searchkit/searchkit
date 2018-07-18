var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var SelectedFilters_1 = require("./SelectedFilters");
var core_1 = require("../../../../core");
var _ = require("lodash");
var sinon = require("sinon");
var TestHelpers_1 = require("../../../__test__/TestHelpers");
describe("SelectedFilters tests", function () {
    beforeEach(function () {
        _this.bemContainer = core_1.block("sk-selected-filters").el;
        _this.bemOption = core_1.block("sk-selected-filters-option").el;
        _this.searchkit = core_1.SearchkitManager.mock();
        _this.searchkit.translateFunction = function (key) {
            return {
                "test name 2": "test name 2 translated",
                "test value 2": "test value 2 translated"
            }[key];
        };
        _this.createWrapper = function (props) {
            _this.wrapper = enzyme_1.mount(React.createElement(SelectedFilters_1.SelectedFilters, __assign({ searchkit: _this.searchkit }, props)));
        };
        _this.sinonSpy = sinon.spy();
        _this.searchkit.query = new core_1.ImmutableQuery()
            .addSelectedFilter({
            id: "test",
            name: "test name",
            value: "test value",
            remove: _this.sinonSpy
        }).addSelectedFilter({
            id: "test2",
            name: "test name 2",
            value: "test value 2",
            remove: _.identity
        });
    });
    it('renders correctly', function () {
        _this.createWrapper();
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("handles remove click", function () {
        _this.createWrapper();
        var elem = _this.wrapper.find(".sk-selected-filters-option").at(0).find("." + _this.bemOption("remove-action"));
        TestHelpers_1.fastClick(elem);
        expect(_this.sinonSpy.called).toBeTruthy();
    });
    it("overrides", function () {
        var FilterItem = function (props) { return (React.createElement("div", { className: props.bemBlocks.option() },
            React.createElement("div", { className: props.bemBlocks.option("override-name") }, props.labelValue),
            React.createElement(core_1.FastClick, { handler: props.removeFilter },
                React.createElement("div", { className: props.bemBlocks.option("remove-action") }, "x")))); };
        _this.createWrapper({ itemComponent: FilterItem });
        expect(_this.wrapper).toMatchSnapshot();
        // click element to be removed
        var elem = _this.wrapper.find(".sk-selected-filters-option").at(0).find("." + _this.bemOption("remove-action"));
        TestHelpers_1.fastClick(elem);
        expect(_this.sinonSpy.called).toBeTruthy();
    });
    it("handles duplicate values", function () {
        _this.searchkit.query = new core_1.ImmutableQuery()
            .addSelectedFilter({
            id: "test",
            name: "test name",
            value: "test value",
            remove: _this.sinonSpy
        }).addSelectedFilter({
            id: "test2",
            name: "test name 2",
            value: "test value 2",
            remove: _.identity
        }).addSelectedFilter({
            id: "test2",
            name: "test name 2",
            value: "test value",
            remove: _.identity
        });
        _this.createWrapper();
        var elems = _this.wrapper.find(".sk-selected-filters-option");
        expect(elems.length).toEqual(3);
    });
});
//# sourceMappingURL=SelectedFilters.unit.js.map