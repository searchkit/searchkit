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
var Pagination_1 = require("../src/Pagination");
var core_1 = require("../../../../core");
var TestHelpers_1 = require("../../../__test__/TestHelpers");
describe("Pagination tests", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        _this.searchkit.addDefaultQuery(function (query) {
            return query.setSize(10);
        });
        _this.createWrapper = function (showNumbers, pageScope, props) {
            if (showNumbers === void 0) { showNumbers = true; }
            if (pageScope === void 0) { pageScope = 3; }
            if (props === void 0) { props = {}; }
            _this.wrapper = enzyme_1.mount(React.createElement(Pagination_1.Pagination, __assign({ searchkit: _this.searchkit, showNumbers: showNumbers, pageScope: pageScope }, props, { translations: { "pagination.previous": "Previous Page" } })));
            _this.accessor = _this.searchkit.accessors.statefulAccessors["p"];
        };
        _this.searchkit.query = new core_1.ImmutableQuery().setSize(10);
        _this.searchkit.setResults({
            hits: {
                total: 80
            }
        });
    });
    describe("rendering", function () {
        beforeEach(function () {
            _this.checkActionStates = function (page, prevDisabled, nextDisabled, pages) {
                _this.accessor.state = _this.accessor.state.setValue(page);
                _this.wrapper.update();
                expect(_this.wrapper.find(".sk-toggle__item").first()
                    .hasClass("is-disabled")).toBe(prevDisabled);
                expect(_this.wrapper.find(".sk-toggle__item").last()
                    .hasClass("is-disabled")).toBe(nextDisabled);
                var pageNumbers = _this.wrapper.find(".sk-toggle__item");
                var pageNumberTexts = pageNumbers.map(function (e) { return e.text(); });
                expect(pageNumberTexts).toEqual(pages);
            };
        });
        it("renders text", function () {
            _this.createWrapper();
            expect(_this.wrapper).toMatchSnapshot();
        });
        it("renders with pages", function () {
            _this.createWrapper(false);
            expect(_this.wrapper).toMatchSnapshot();
        });
        it('renders first page options', function () {
            _this.createWrapper();
            _this.checkActionStates(null, true, false, ['Previous Page', '1', '2', '3', '4', '...', 'Next']);
        });
        it('renders second page options', function () {
            _this.createWrapper();
            _this.checkActionStates(2, false, false, ['Previous Page', '1', '2', '3', '4', '5', '...', 'Next']);
        });
        it('renders eighth page options', function () {
            _this.createWrapper();
            _this.checkActionStates(8, false, true, ['Previous Page', '1', '...', '5', '6', '7', '8', 'Next']);
        });
        it("handles showNumbers prop", function () {
            _this.createWrapper(false);
            _this.checkActionStates(4, false, false, [
                'Previous Page', 'Next'
            ]);
        });
        it("handles pageScope prop", function () {
            _this.createWrapper(true, 1);
            _this.checkActionStates(4, false, false, ['Previous Page', '1', '...', '3', '4', '5', '...', 'Next']);
        });
        it("renders no pagination on no results", function () {
            _this.searchkit.setResults({ hits: { total: 0 } });
            _this.createWrapper();
            expect(_this.wrapper.find(".sk-toggle").length).toBe(0);
        });
        it("both disabled on only one total page", function () {
            _this.searchkit.setResults({ hits: { total: 10 } });
            _this.createWrapper();
            _this.checkActionStates(1, true, true, ['Previous Page', '1', 'Next']);
        });
    });
    describe("interacting", function () {
        it("interact prev disabled", function () {
            _this.createWrapper();
            _this.accessor.state = _this.accessor.state.setValue(1);
            TestHelpers_1.fastClick(_this.wrapper.find(".sk-toggle__item").first());
            expect(_this.accessor.state.getValue()).toBe(1);
        });
        it("click previous, next", function () {
            _this.createWrapper();
            _this.accessor.state = _this.accessor.state.setValue(3);
            _this.wrapper.update();
            TestHelpers_1.fastClick(_this.wrapper.find(".sk-toggle__item").first());
            expect(_this.accessor.state.getValue()).toBe(2);
            TestHelpers_1.fastClick(_this.wrapper.find(".sk-toggle__item").last());
            TestHelpers_1.fastClick(_this.wrapper.find(".sk-toggle__item").last());
            expect(_this.accessor.state.getValue()).toBe(4);
        });
        it("ability to click last page", function () {
            _this.createWrapper();
            _this.accessor.state = _this.accessor.state.setValue(7);
            _this.wrapper.update();
            TestHelpers_1.fastClick(_this.wrapper.find(".sk-toggle__item").last());
            expect(_this.accessor.state.getValue()).toBe(8);
            TestHelpers_1.fastClick(_this.wrapper.find(".sk-toggle__item").last());
            expect(_this.accessor.state.getValue()).toBe(8);
        });
        it("dividers should not alter state", function () {
            _this.createWrapper();
            _this.accessor.state = _this.accessor.state.setValue(2);
            _this.wrapper.update();
            TestHelpers_1.fastClick(_this.wrapper.find("[data-key='ellipsis-6']"));
            //this was NaN before bug fix
            expect(_this.accessor.state.getValue()).toBe(2);
        });
    });
    it("PaginationSelect", function () {
        _this.wrapper = enzyme_1.mount(React.createElement(Pagination_1.PaginationSelect, { searchkit: _this.searchkit }));
        _this.wrapper.update();
        expect(_this.wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=PaginationSpec.js.map