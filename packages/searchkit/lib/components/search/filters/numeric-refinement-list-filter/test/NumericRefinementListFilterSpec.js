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
var NumericRefinementListFilter_1 = require("../src/NumericRefinementListFilter");
var TestHelpers_1 = require("../../../../__test__/TestHelpers");
var core_1 = require("../../../../../core");
var ui_1 = require("../../../../ui");
;
describe("NumericRefinementListFilter tests", function () {
    beforeEach(function () {
        core_1.Utils.guidCounter = 0;
        _this.searchkit = core_1.SearchkitManager.mock();
        spyOn(_this.searchkit, "performSearch");
        _this.setWrapper = function (props) {
            if (props === void 0) { props = {}; }
            _this.wrapper = enzyme_1.mount(React.createElement(NumericRefinementListFilter_1.NumericRefinementListFilter, __assign({}, props, { searchkit: _this.searchkit, id: "score", title: "Score", field: "score", options: [
                    { title: "All", key: "everything" },
                    { title: "up to 20", from: 0, to: 21 },
                    { title: "21 to 40", from: 21, to: 41 }
                ] })));
            _this.accessor = _this.searchkit.getAccessorByType(core_1.NumericOptionsAccessor);
        };
        _this.setResults = function () {
            _this.searchkit.setResults({
                aggregations: {
                    score1: {
                        score: {
                            buckets: [
                                { key: "All", doc_count: 30 },
                                { key: "up to 20", doc_count: 10 },
                                { key: "21 to 40", doc_count: 20 }
                            ]
                        }
                    }
                }
            });
        };
        _this.getOptionAt = function (index) {
            return _this.wrapper.find(".sk-item-list-option").at(index);
        };
    });
    it("should set accessor options correctly", function () {
        _this.setWrapper();
        expect(_this.accessor.key).toBe("score");
        expect(_this.accessor.options).toEqual({
            id: 'score', field: "score", title: "Score", options: [
                { title: "All", key: "everything" },
                { title: "up to 20", from: 0, to: 21, key: "0_21" },
                { title: "21 to 40", from: 21, to: 41, key: "21_41" }
            ],
            multiselect: false,
            fieldOptions: {
                type: 'embedded', field: 'score'
            }
        });
    });
    it("should render correctly()", function () {
        _this.setWrapper();
        _this.setResults();
        expect(_this.wrapper).toMatchSnapshot();
    });
    it("should select correctly", function () {
        _this.setWrapper();
        _this.accessor.state = _this.accessor.state.setValue(["21_41"]);
        _this.setResults();
        var lastOption = _this.getOptionAt(2);
        expect(TestHelpers_1.hasClass(lastOption, "is-active")).toBe(true);
    });
    it("should handle clicking an option", function () {
        _this.setWrapper();
        _this.setResults();
        var secondOption = _this.getOptionAt(1);
        var thirdOption = _this.getOptionAt(2);
        TestHelpers_1.fastClick(secondOption);
        expect(_this.accessor.state.getValue()).toEqual(["0_21"]);
        expect(_this.searchkit.performSearch).toHaveBeenCalled();
        _this.accessor.options.multiselect = true;
        TestHelpers_1.fastClick(thirdOption);
        _this.accessor.options.multiselect = false;
        TestHelpers_1.fastClick(thirdOption);
        expect(_this.accessor.state.getValue()).toEqual(['21_41']);
    });
    it("should be disabled for empty buckets", function () {
        _this.setWrapper();
        expect(_this.wrapper.find(".sk-panel.is-disabled").length).toBe(1);
    });
    it("should allow custom mod, className, listComponent, translations", function () {
        _this.setWrapper({
            mod: "my-numeric", className: "my-class",
            listComponent: ui_1.Select, translations: { "All": "Everything" },
            countFormatter: function (count) { return "#" + count; }
        });
        _this.setResults();
        expect(_this.wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=NumericRefinementListFilterSpec.js.map