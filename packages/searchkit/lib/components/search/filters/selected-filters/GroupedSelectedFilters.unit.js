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
var GroupedSelectedFilters_1 = require("./GroupedSelectedFilters");
var core_1 = require("../../../../core");
;
var TestHelpers_1 = require("../../../__test__/TestHelpers");
describe("GroupedSelectedFilters tests", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        _this.searchkit.translateFunction = function (key) {
            return {
                "test name 2": "test name 2 translated",
                "test value 2": "test value 2 translated"
            }[key];
        };
        _this.createWrapper = function (props) {
            _this.wrapper = enzyme_1.mount(React.createElement(GroupedSelectedFilters_1.GroupedSelectedFilters, __assign({ searchkit: _this.searchkit }, props)));
        };
        _this.remove1 = jasmine.createSpy("remove_1");
        _this.remove2 = jasmine.createSpy("remove_2");
        _this.remove3 = jasmine.createSpy("remove_3");
        _this.searchkit.query = new core_1.ImmutableQuery()
            .addSelectedFilter({
            id: "test",
            name: "test name",
            value: "test value",
            remove: _this.remove1
        }).addSelectedFilter({
            id: "test2",
            name: "test name 2",
            value: "test value 2",
            remove: _this.remove2
        }).addSelectedFilter({
            id: "test",
            name: "test name",
            value: "test value 3",
            remove: _this.remove3
        });
    });
    it('renders correctly', function () {
        _this.createWrapper();
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("handles remove click", function () {
        _this.createWrapper();
        var elem = _this.wrapper.find(".sk-filter-group-items__value").at(0);
        TestHelpers_1.fastClick(elem);
        expect(_this.remove1).toHaveBeenCalled();
        expect(_this.remove2).not.toHaveBeenCalled();
        expect(_this.remove3).not.toHaveBeenCalled();
    });
    it("handles remove all click", function () {
        _this.createWrapper();
        var elem = _this.wrapper.find(".sk-filter-group__remove-action").at(0);
        TestHelpers_1.fastClick(elem);
        expect(_this.remove1).toHaveBeenCalled();
        expect(_this.remove2).not.toHaveBeenCalled();
        expect(_this.remove3).toHaveBeenCalled();
    });
});
//# sourceMappingURL=GroupedSelectedFilters.unit.js.map