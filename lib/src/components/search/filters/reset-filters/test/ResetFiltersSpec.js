var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var ResetFilters_tsx_1 = require("../src/ResetFilters.tsx");
var core_1 = require("../../../../../core");
var TestHelpers_1 = require("../../../../__test__/TestHelpers");
var sinon = require("sinon");
describe("Reset Filter tests", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        _this.createWrapper = function () {
            _this.wrapper = enzyme_1.mount(React.createElement(ResetFilters_tsx_1.ResetFilters, {"searchkit": _this.searchkit, "translations": { "reset.clear_all": "reset filters" }}));
        };
    });
    it('renders correctly', function () {
        _this.createWrapper();
        _this.searchkit.query.hasFiltersOrQuery = function () { return false; };
        var elem = _this.wrapper.find(".reset-filters");
        _this.wrapper.update();
        expect(elem.hasClass("is-disabled")).toBe(true);
        _this.searchkit.query.hasFiltersOrQuery = function () { return true; };
        _this.wrapper.update();
        expect(elem.hasClass("is-disabled")).toBe(false);
        expect(elem.text()).toBe("reset filters");
    });
    it("handles reset click", function () {
        _this.searchkit.query.hasFiltersOrQuery = function () { return true; };
        _this.searchkit.resetState = sinon.spy();
        _this.searchkit.performSearch = sinon.spy();
        _this.createWrapper();
        var elem = _this.wrapper.find(".reset-filters");
        expect(_this.searchkit.resetState.called).toBeFalsy();
        expect(_this.searchkit.performSearch.called).toBeFalsy();
        TestHelpers_1.fastClick(elem);
        expect(_this.searchkit.resetState.called).toBeTruthy();
        expect(_this.searchkit.performSearch.called).toBeTruthy();
    });
});
//# sourceMappingURL=ResetFiltersSpec.js.map