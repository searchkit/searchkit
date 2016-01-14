var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var RefinementListFilter_tsx_1 = require("../src/RefinementListFilter.tsx");
var core_1 = require("../../../../../core");
fdescribe("Refinement List Filter tests", function () {
    beforeEach(function () {
        _this.searchkit = new core_1.SearchkitManager("localhost:9200", { useHistory: true });
        _this.searchkit.translateFunction = function (key) {
            return {
                "test option 1": "test option 1 translated"
            }[key];
        };
        _this.wrapper = enzyme_1.mount(React.createElement(RefinementListFilter_tsx_1.RefinementListFilter, {"field": "test", "id": "test", "title": "test", "searchkit": _this.searchkit}));
        _this.searchkit.setResults({
            aggregations: {
                test: {
                    test: {
                        buckets: [
                            { key: "test option 1", doc_count: 1 },
                            { key: "test option 2", doc_count: 2 },
                            { key: "test option 3", doc_count: 3 }
                        ]
                    },
                    "test.count": {
                        value: 3
                    }
                }
            }
        });
    });
    it('renders correctly', function () {
        expect(_this.wrapper.find(".refinement-list__header").text()).toBe("test");
        expect(_this.wrapper.find(".refinement-list__options").children().map(function (n) {
            return n.find(".refinement-list-option__text").text();
        })).toEqual(['test option 1 translated', 'test option 2', 'test option 3']);
    });
});
//# sourceMappingURL=RefinementListFilterSpec.js.map