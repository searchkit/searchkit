var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var Pagination_tsx_1 = require("../src/Pagination.tsx");
var core_1 = require("../../../../core");
describe("Pagination tests", function () {
    beforeEach(function () {
        _this.searchkit = new core_1.SearchkitManager("localhost:9200", { useHistory: true });
        _this.createWrapper = function () {
            _this.wrapper = enzyme_1.mount(React.createElement(Pagination_tsx_1.Pagination, {"searchkit": _this.searchkit, "translations": { "pagination.previous": "Previous Page" }}));
            _this.accessor = _this.searchkit.accessors.getAccessors()[0];
        };
        _this.searchkit.query = new core_1.ImmutableQuery().setSize(10);
        _this.searchkit.setResults({
            hits: {
                total: 40
            }
        });
    });
    describe("rendering", function () {
        beforeEach(function () {
            _this.checkActionStates = function (page, prevDisabled, nextDisabled) {
                _this.createWrapper();
                _this.accessor.state = _this.accessor.state.setValue(page);
                _this.wrapper.update();
                expect(_this.wrapper.find(".pagination-navigation-item__prev")
                    .hasClass("is-disabled")).toBe(prevDisabled);
                expect(_this.wrapper.find(".pagination-navigation-item__next")
                    .hasClass("is-disabled")).toBe(nextDisabled);
            };
        });
        it("renders text", function () {
            _this.createWrapper();
            expect(_this.wrapper.find(".pagination-navigation-item__prev").text()).toBe("Previous Page");
            expect(_this.wrapper.find(".pagination-navigation-item__next").text()).toBe("Next");
        });
        it('renders first page options', function () {
            _this.checkActionStates(null, true, false);
        });
        it('renders second page options', function () {
            _this.checkActionStates(2, false, false);
        });
        it('renders forth page options', function () {
            _this.checkActionStates(4, false, true);
        });
        it("renders no pagination on no results", function () {
            _this.searchkit.setResults({ hits: { total: 0 } });
            _this.createWrapper();
            expect(_this.wrapper.find(".pagination-navigation").length).toBe(0);
        });
        it("both disabled on only one total page", function () {
            _this.searchkit.setResults({ hits: { total: 10 } });
            _this.createWrapper();
            expect(_this.wrapper.find(".pagination-navigation").length).toBe(1);
            _this.checkActionStates(1, true, true);
        });
    });
    describe("interacting", function () {
        it("interact prev disabled", function () {
            _this.createWrapper();
            _this.accessor.state = _this.accessor.state.setValue(1);
            _this.wrapper
                .find(".pagination-navigation-item__prev")
                .simulate("mouseDown", { button: 0 });
            expect(_this.accessor.state.getValue()).toBe(1);
        });
    });
});
//# sourceMappingURL=PaginationSpec.js.map