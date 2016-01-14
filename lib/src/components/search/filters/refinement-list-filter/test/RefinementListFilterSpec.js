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
        _this.searchkit = new core_1.SearchkitManager("localhost:9200");
        _this.wrapper = enzyme_1.mount(React.createElement(core_1.SearchkitProvider, {"searchkit": _this.searchkit}, React.createElement("div", null, React.createElement(RefinementListFilter_tsx_1.RefinementListFilter, {"field": "test", "id": "test", "title": "test", "size": 2}))));
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
        expect(_this.wrapper.find("." + _this.bemContainer("header")).text()).toBe("test");
        expect(_this.wrapper.find("." + _this.bemContainer("options")).children().map(function (n) {
            return {
                label: n.find("." + _this.bemOption("text")).text(),
                count: n.find("." + _this.bemOption("count")).text()
            };
        })).toEqual([{ label: 'test option 1', count: "1" }, { label: 'test option 2', count: "2" }, { label: 'test option 3', count: "3" }]);
    });
    // it("selects option", () => {
    //   let option1 = this.wrapper.ref("test option 1")
    //   // option1.simulate("click")
    //   expect(option1.text()).toEqual(true)
    // })
});
//# sourceMappingURL=RefinementListFilterSpec.js.map