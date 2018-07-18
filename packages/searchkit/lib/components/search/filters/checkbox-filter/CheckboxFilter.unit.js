var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
;
var enzyme_1 = require("enzyme");
var TestHelpers_1 = require("../../../__test__/TestHelpers");
var CheckboxFilter_1 = require("./CheckboxFilter");
var core_1 = require("../../../../core");
var core_2 = require("../../../../core");
describe("CheckboxFilter tests", function () {
    _this.createWrapper = function (component) {
        _this.wrapper = enzyme_1.mount(component);
        _this.searchkit.setResults({
            hits: {
                hits: [{ _id: 1, title: 1 }, { _id: 2, title: 2 }],
                total: 2
            },
            aggregations: {
                "test id1": {
                    doc_count: 50
                }
            }
        });
        _this.accessor = _this.searchkit.getAccessorByType(core_2.CheckboxFilterAccessor);
    };
    beforeEach(function () {
        core_1.Utils.guidCounter = 0;
        _this.searchkit = core_1.SearchkitManager.mock();
        _this.searchkit.translateFunction = function (key) {
            return {
                "test option 1": "test option 1 translated"
            }[key];
        };
        _this.createWrapper(React.createElement(CheckboxFilter_1.CheckboxFilter, { id: "test id", title: "test title", label: "test label", searchkit: _this.searchkit, filter: core_2.TermQuery("test-field", "test-value") }));
    });
    it('renders correctly', function () {
        expect(_this.wrapper).toMatchSnapshot();
    });
    it('clicks options', function () {
        expect(_this.accessor.state.getValue()).toEqual(null);
        var option = _this.wrapper.find(".sk-item-list").children().at(0);
        TestHelpers_1.fastClick(option);
        expect(TestHelpers_1.hasClass(option, "is-active")).toBe(true);
        expect(_this.accessor.state.getValue()).toEqual(true);
        TestHelpers_1.fastClick(option);
        expect(_this.accessor.state.getValue()).toEqual(false); // Back to null ?
    });
    it("should configure accessor correctly", function () {
        expect(_this.accessor.key).toBe("test id");
        var options = _this.accessor.options;
        expect(options).toEqual({
            "id": "test id",
            "title": "test title",
            "label": "test label",
            "translations": undefined,
            "filter": core_2.TermQuery("test-field", "test-value")
        });
    });
    it("can disable", function () {
        expect(TestHelpers_1.hasClass(_this.wrapper.find(".sk-panel"), "is-disabled")).toBe(false);
        _this.searchkit.setResults({
            hits: { total: 0 },
            aggregations: {
                "test id1": {
                    doc_count: 50
                }
            }
        });
        expect(TestHelpers_1.hasClass(_this.wrapper.find(".sk-panel"), "is-disabled")).toBe(true);
        expect(_this.accessor.state.getValue()).toEqual(null);
        var option = _this.wrapper.find(".sk-item-list").children().at(0);
        TestHelpers_1.fastClick(option);
        expect(_this.accessor.state.getValue()).toEqual(true);
        expect(TestHelpers_1.hasClass(_this.wrapper.find(".sk-panel"), "is-disabled")).toBe(false);
    });
});
//# sourceMappingURL=CheckboxFilter.unit.js.map