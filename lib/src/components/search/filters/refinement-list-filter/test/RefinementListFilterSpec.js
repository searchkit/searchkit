var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var RefinementListFilter_tsx_1 = require("../src/RefinementListFilter.tsx");
var core_1 = require("../../../../../core");
var bem = require("bem-cn");
var _ = require("lodash");
var sinon = require("sinon");
describe("Refinement List Filter tests", function () {
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
        _this.accessor = _this.searchkit.accessors.getAccessors()[0];
        _this.getContainer = function (label, index) {
            var container = _this.wrapper.find("." + _this.bemContainer(label));
            if (_.isNumber(index)) {
                return container.children().at(index);
            }
            else {
                return container;
            }
        };
    });
    it('renders correctly', function () {
        expect(_this.getContainer("header").text()).toBe("test title");
        expect(_this.getContainer("options").children().map(function (n) {
            return {
                label: n.find("." + _this.bemOption("text")).text(),
                count: n.find("." + _this.bemOption("count")).text()
            };
        })).toEqual([{ label: 'test option 1 translated', count: "1" }, { label: 'test option 2', count: "2" }, { label: 'test option 3', count: "3" }]);
    });
    it('clicks options', function () {
        var option = _this.getContainer("options", 0);
        var option2 = _this.getContainer("options", 1);
        option.simulate("click");
        option2.simulate("click");
        expect(option.hasClass("is-selected")).toBe(true);
        expect(option2.hasClass("is-selected")).toBe(true);
        expect(_this.accessor.state.getValue()).toEqual(['test option 1', 'test option 2']);
        option2.simulate("click");
        expect(_this.accessor.state.getValue()).toEqual(['test option 1']);
    });
    it("show more options", function () {
        var option = { label: "view more", size: 20 };
        _this.accessor.getMoreSizeOption = function () { return option; };
        _this.accessor.setViewMoreOption = sinon.spy();
        _this.wrapper.update();
        expect(_this.getContainer("view-more-action").text()).toBe("view more");
        _this.getContainer("view-more-action").simulate("click");
        expect(_this.accessor.setViewMoreOption.calledOnce).toBe(true);
        expect(_this.accessor.setViewMoreOption.calledWith(option)).toBe(true);
    });
    it("show no options", function () {
        _this.accessor.getMoreSizeOption = function () { return null; };
        _this.wrapper.update();
        expect(_this.getContainer("view-more-action").length).toBe(0);
    });
    it("should configure accessor correctly", function () {
        expect(_this.accessor.key).toBe("test");
        var options = _this.accessor.options;
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