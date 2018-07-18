var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var TestHelpers_1 = require("../../../__test__/TestHelpers");
var core_1 = require("../../../../core");
var ui_1 = require("../../../ui");
var MenuFilter_1 = require("./MenuFilter");
describe("MenuFilter", function () {
    beforeEach(function () {
        core_1.Utils.guidCounter = 0;
        _this.searchkit = core_1.SearchkitManager.mock();
        spyOn(_this.searchkit, "performSearch");
        _this.wrapper = enzyme_1.mount(React.createElement(MenuFilter_1.MenuFilter, { searchkit: _this.searchkit, translations: { "Red": "Red Translated" }, field: "color", title: "Color", orderKey: "_term", orderDirection: "asc", include: "title", exclude: ["n/a"], id: "color", size: 10 }));
        _this.getOptionAt = function (at) {
            return _this.wrapper.find(".sk-item-list")
                .children().at(at);
        };
        _this.accessor = _this.searchkit.getAccessorByType(core_1.FacetAccessor);
        _this.searchkit.setResults({
            aggregations: {
                color1: {
                    color: {
                        buckets: [
                            { key: "Red", doc_count: 10 },
                            { key: "Blue", doc_count: 11 },
                            { key: "Green", doc_count: 12 }
                        ]
                    },
                    doc_count: 33
                }
            }
        });
    });
    it("expect accessor options to be correct", function () {
        expect(_this.wrapper.node.props.listComponent).toBe(ui_1.ItemList);
        expect(_this.accessor.options).toEqual(jasmine.objectContaining({
            id: "color", field: "color", title: "Color", operator: "OR",
            translations: { "Red": "Red Translated" },
            size: 10, facetsPerPage: 50, orderKey: "_term",
            orderDirection: "asc", include: "title", exclude: ["n/a"],
            "fieldOptions": {
                type: "embedded",
                field: "color"
            }
        }));
    });
    it("getSelectedItems", function () {
        _this.accessor.state = new core_1.ArrayState([]);
        expect(_this.wrapper.node.getSelectedItems())
            .toEqual(['$all']);
        _this.accessor.state = new core_1.ArrayState([false]);
        expect(_this.wrapper.node.getSelectedItems())
            .toEqual([false]);
        _this.accessor.state = new core_1.ArrayState(["foo", "bar"]);
        expect(_this.wrapper.node.getSelectedItems())
            .toEqual(["foo"]);
    });
    it("should render correctly", function () {
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("should handle selection correctly", function () {
        var all = _this.getOptionAt(0);
        var blue = _this.getOptionAt(2);
        var green = _this.getOptionAt(3);
        TestHelpers_1.fastClick(blue);
        expect(_this.accessor.state.getValue()).toEqual(["Blue"]);
        TestHelpers_1.fastClick(green);
        expect(_this.accessor.state.getValue()).toEqual(["Green"]);
        expect(_this.searchkit.performSearch).toHaveBeenCalled();
        //should clear if button clicked
        TestHelpers_1.fastClick(green);
        expect(_this.accessor.state.getValue()).toEqual([]);
        TestHelpers_1.fastClick(blue);
        expect(_this.accessor.state.getValue()).toEqual(["Blue"]);
        TestHelpers_1.fastClick(all);
        expect(_this.accessor.state.getValue()).toEqual([]);
        TestHelpers_1.fastClick(all);
        expect(_this.accessor.state.getValue()).toEqual([]);
    });
});
//# sourceMappingURL=MenuFilter.unit.js.map