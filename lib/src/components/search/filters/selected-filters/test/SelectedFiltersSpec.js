var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var SelectedFilters_tsx_1 = require("../src/SelectedFilters.tsx");
var core_1 = require("../../../../../core");
var bem = require("bem-cn");
var _ = require("lodash");
var sinon = require("sinon");
describe("SelectedFilters tests", function () {
    beforeEach(function () {
        _this.bemContainer = bem("selected-filters");
        _this.bemOption = bem("selected-filters-option");
        _this.searchkit = core_1.SearchkitManager.mock();
        _this.searchkit.translateFunction = function (key) {
            return {
                "test name 2": "test name 2 translated",
                "test value 2": "test value 2 translated"
            }[key];
        };
        _this.getContainer = function (label, index) {
            var container = _this.wrapper.find("." + _this.bemContainer(label));
            if (_.isNumber(index)) {
                return container.children().at(index);
            }
            else {
                return container;
            }
        };
        _this.createWrapper = function () {
            _this.wrapper = enzyme_1.mount(React.createElement(SelectedFilters_tsx_1.SelectedFilters, {"searchkit": _this.searchkit}));
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
        expect(_this.getContainer(null).children().map(function (n) {
            return n.children().at(0).text();
        })).toEqual([
            "test name: test value",
            "test name 2 translated: test value 2 translated"
        ]);
    });
    it("handles remove click", function () {
        _this.createWrapper();
        var elem = _this.getContainer(null, 0).find("." + _this.bemOption("remove-action"));
        elem.simulate("mouseDown", { button: 0 });
        expect(_this.sinonSpy.called).toBeTruthy();
    });
});
//# sourceMappingURL=SelectedFiltersSpec.js.map