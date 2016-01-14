var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var RefinementListFilter_tsx_1 = require("../src/RefinementListFilter.tsx");
var core_1 = require("../../../../../core");
var bem = require("bem-cn");
fdescribe("Refinement List Filter tests", function () {
    beforeEach(function () {
        _this.bemContainer = bem("refinement-list");
        _this.bemOption = bem("refinement-list-option");
        _this.searchkit = new core_1.SearchkitManager("localhost:9200", { useHistory: true });
        _this.searchkit.translateFunction = function (key) {
            return {
                "test option 1": "test option 1 translated"
            }[key];
        };
        _this.wrapper = enzyme_1.mount(React.createElement(RefinementListFilter_tsx_1.RefinementListFilter, {"field": "test", "id": "test id", "title": "test title", "searchkit": _this.searchkit}));
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
                        value: 4
                    }
                }
            }
        });
    });
    it('renders correctly', function () {
        expect(_this.wrapper.find("." + _this.bemContainer("header")).text()).toBe("test title");
        expect(_this.wrapper.find("." + _this.bemContainer("options")).children().map(function (n) {
            return {
                label: n.find("." + _this.bemOption("text")).text(),
                count: n.find("." + _this.bemOption("count")).text()
            };
        })).toEqual([{ label: 'test option 1 translated', count: "1" }, { label: 'test option 2', count: "2" }, { label: 'test option 3', count: "3" }]);
    });
    it("should configure accessor correctly", function () {
        var facetAccessor = _this.searchkit.accessors.getAccessors()[0];
        expect(facetAccessor.key).toBe("test");
        var options = facetAccessor.options;
        expect(options).toEqual({
            "id": "test id",
            "title": "test title",
            "size": 50,
            "facetsPerPage": 50,
            "operator": undefined,
            "translations": undefined
        });
    });
});
//# sourceMappingURL=RefinementListFilterSpec.js.map