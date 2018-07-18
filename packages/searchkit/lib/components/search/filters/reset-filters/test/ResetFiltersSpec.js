var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var ResetFilters_1 = require("../src/ResetFilters");
var core_1 = require("../../../../../core");
var TestHelpers_1 = require("../../../../__test__/TestHelpers");
describe("Reset Filter tests", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        _this.options = { query: true, filter: true };
        _this.createWrapper = function () {
            _this.wrapper = enzyme_1.mount(React.createElement(ResetFilters_1.ResetFilters, { searchkit: _this.searchkit, translations: { "reset.clear_all": "reset filters" }, options: _this.options }));
            _this.accessor = _this.searchkit.getAccessorsByType(core_1.ResetSearchAccessor)[0];
        };
    });
    it("should create accessor correctly", function () {
        _this.createWrapper();
        expect(_this.accessor).toBeTruthy();
        expect(_this.accessor.options).toBe(_this.options);
    });
    it('renders correctly', function () {
        _this.createWrapper();
        _this.searchkit.query.getSelectedFilters = function () { return []; };
        var elem = _this.wrapper.find(".sk-reset-filters");
        _this.wrapper.update();
        expect(elem.hasClass("is-disabled")).toBe(true);
        _this.searchkit.query.getSelectedFilters = function () { return [1]; };
        _this.wrapper.update();
        expect(elem.hasClass("is-disabled")).toBe(false);
        expect(elem.text()).toBe("reset filters");
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("handles reset click", function () {
        _this.searchkit.query.getSelectedFilters = function () { return [1]; };
        _this.createWrapper();
        spyOn(_this.accessor, "performReset");
        spyOn(_this.searchkit, "performSearch");
        var elem = _this.wrapper.find(".sk-reset-filters");
        expect(_this.accessor.performReset).not.toHaveBeenCalled();
        expect(_this.searchkit.performSearch).not.toHaveBeenCalled();
        TestHelpers_1.fastClick(elem);
        expect(_this.accessor.performReset).toHaveBeenCalled();
        expect(_this.searchkit.performSearch).toHaveBeenCalled();
    });
});
//# sourceMappingURL=ResetFiltersSpec.js.map