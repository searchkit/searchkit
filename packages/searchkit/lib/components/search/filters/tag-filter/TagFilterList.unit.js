var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
;
var enzyme_1 = require("enzyme");
var TestHelpers_1 = require("../../../__test__/TestHelpers");
var _1 = require("./");
var core_1 = require("../../../../core");
;
describe("TagFilterList tests", function () {
    _this.createWrapper = function (component) {
        _this.wrapper = enzyme_1.mount(component);
        _this.searchkit.setResults({
            aggregations: {
                test1: {
                    test: {
                        buckets: [
                            { key: "test option 1", doc_count: 1 },
                            { key: "test option 2", doc_count: 2 },
                            { key: "test option 3", doc_count: 3 }
                        ]
                    },
                    "test_count": {
                        value: 4
                    }
                }
            }
        });
        _this.accessor = _this.searchkit.getAccessorByType(core_1.FacetAccessor);
    };
    beforeEach(function () {
        core_1.Utils.guidCounter = 0;
        _this.searchkit = core_1.SearchkitManager.mock();
        _this.searchkit.translateFunction = function (key) {
            return {
                "test option 1": "test option 1 translated"
            }[key];
        };
        _this.createWrapper(React.createElement("div", null,
            React.createElement(_1.TagFilterConfig, { field: "test", id: "testId", title: "test title", operator: "OR", searchkit: _this.searchkit }),
            React.createElement(_1.TagFilterList, { field: "testId", values: ["test option 1", "test option 2"], searchkit: _this.searchkit })));
    });
    it('renders correctly', function () {
        expect(_this.wrapper).toMatchSnapshot();
    });
    it('handles click', function () {
        var option = _this.wrapper.find(".sk-tag-filter").at(0);
        var option2 = _this.wrapper.find(".sk-tag-filter").at(1);
        TestHelpers_1.fastClick(option);
        expect(TestHelpers_1.hasClass(option, "is-active")).toBe(true);
        expect(TestHelpers_1.hasClass(option2, "is-active")).toBe(false);
        expect(_this.accessor.state.getValue()).toEqual(['test option 1']);
        TestHelpers_1.fastClick(option2);
        expect(TestHelpers_1.hasClass(option, "is-active")).toBe(true);
        expect(TestHelpers_1.hasClass(option2, "is-active")).toBe(true);
        TestHelpers_1.fastClick(option);
        expect(TestHelpers_1.hasClass(option, "is-active")).toBe(false);
        TestHelpers_1.fastClick(option2);
        expect(_this.accessor.state.getValue()).toEqual([]);
    });
});
//# sourceMappingURL=TagFilterList.unit.js.map