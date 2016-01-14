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
        _this.searchkit = new core_1.SearchkitManager("localhost:9200", { useHistory: true });
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
    });
    it('renders correctly', function () {
        _this.searchkit.query.getSelectedFilters = function () {
            return [
                {
                    name: "test name",
                    value: "test value",
                    remove: sinon.spy()
                }
            ];
        };
        _this.createWrapper();
        expect(_this.getContainer(null, 0).children().map(function (n) {
            return n.find("." + _this.bemOption("name")).text();
        })).toBe("test name : test value");
        // this.searchkit.query.hasFiltersOrQuery = () => {return false}
        // let elem = this.wrapper.find(".reset-filters")
        //
        // this.wrapper.update()
        // expect(elem.hasClass("is-disabled")).toBe(true)
        //
        // this.searchkit.query.hasFiltersOrQuery = () => {return true}
        //
        // this.wrapper.update()
        // expect(elem.hasClass("is-disabled")).toBe(false)
        //
        // expect(elem.text()).toBe("reset filters")
    });
    //
    // it("handles reset click", () => {
    //   this.searchkit.query.hasFiltersOrQuery = () => {return true}
    //   this.searchkit.resetState = sinon.spy()
    //   this.searchkit.performSearch = sinon.spy()
    //   this.createWrapper()
    //   let elem = this.wrapper.find(".reset-filters")
    //   elem.simulate("mouseDown", {button:0})
    //   expect(this.searchkit.resetState.called).toBeTruthy()
    //   expect(this.searchkit.performSearch.called).toBeTruthy()
    // })
});
//# sourceMappingURL=SelectedFiltersSpec.js.map