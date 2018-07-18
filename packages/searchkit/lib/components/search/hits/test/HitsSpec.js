var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var Hits_1 = require("../src/Hits");
var core_1 = require("../../../../core");
var sinon = require("sinon");
describe("Hits component", function () {
    describe('renders correctly', function () {
        beforeEach(function () {
            _this.searchkit = core_1.SearchkitManager.mock();
            var customHighlight = { "fields": {} };
            _this.wrapper = enzyme_1.mount(React.createElement(Hits_1.Hits, { searchkit: _this.searchkit, hitsPerPage: 10, highlightFields: ["title"], customHighlight: customHighlight, sourceFilter: ["title"] }));
            _this.pageSizeAccessor = _this.searchkit.getAccessorByType(core_1.PageSizeAccessor);
            _this.highlightAccessor = _this.searchkit.getAccessorByType(core_1.HighlightAccessor);
            _this.customHighlightAccessor = _this.searchkit.getAccessorByType(core_1.CustomHighlightAccessor);
            _this.sourceFilterAccessor = _this.searchkit.getAccessorByType(core_1.SourceFilterAccessor);
            _this.hasRendered = function () {
                return _this.wrapper.find(".sk-hits").length == 1;
            };
        });
        it("initalize accessors correctly", function () {
            expect(_this.pageSizeAccessor.defaultSize).toBe(10);
            expect(_this.customHighlightAccessor.highlightRequest).toEqual({ "fields": {} });
            expect(_this.highlightAccessor.highlightFields)
                .toEqual({
                fields: { title: {} }
            });
            expect(_this.sourceFilterAccessor.source).toEqual(["title"]);
        });
        it("does render", function () {
            _this.searchkit.initialLoading = false;
            _this.searchkit.setResults({
                hits: {
                    hits: [{ _id: 1, title: 1 }, { _id: 2, title: 2 }],
                    total: 2
                }
            });
            _this.wrapper.update();
            expect(_this.hasRendered()).toBeTruthy();
            expect(_this.wrapper).toMatchSnapshot();
        });
        it("does not render on no hits", function () {
            _this.searchkit.initialLoading = false;
            _this.searchkit.setResults({
                hits: {
                    hits: [],
                    total: 0
                }
            });
            _this.wrapper.update();
            expect(_this.hasRendered()).toBeFalsy();
        });
        it("no longer renders initial view", function () {
            _this.searchkit.initialLoading = true;
            _this.wrapper.update();
            expect(_this.hasRendered()).toBeFalsy();
            expect(_this.wrapper.find(".sk-hits__initial-loading").length).toBe(0);
        });
        it("custom higher order component", function () {
            _this.searchkit.setResults({
                hits: {
                    hits: [{ _id: 1, title: 1 }, { _id: 2, title: 2 }],
                    total: 2
                }
            });
            var hit = function (props) {
                return React.createElement("div", { className: props.bemBlocks.item() }, props.result.title);
            };
            var wrapper = enzyme_1.mount(React.createElement(Hits_1.Hits, { searchkit: _this.searchkit, itemComponent: hit, hitsPerPage: 10 }));
            expect(_this.wrapper).toMatchSnapshot();
        });
    });
    describe("hits scrollTo", function () {
        beforeEach(function () {
            _this.stub = sinon.stub(document, "querySelector");
            _this.addHits = function (scrollTo) {
                _this.searchkit = core_1.SearchkitManager.mock();
                _this.wrapper = enzyme_1.mount(React.createElement(Hits_1.Hits, { searchkit: _this.searchkit, scrollTo: scrollTo, hitsPerPage: 10 }));
            };
            _this.setupTest = function (selector) {
                _this.element = {
                    scrollTop: 100
                };
                _this.stub.returns(_this.element);
                _this.addHits(selector);
                _this.searchkit.setResults({
                    hits: {
                        hits: [{ _id: 1, title: 1 }, { _id: 2, title: 2 }],
                        total: 2
                    }
                });
            };
        });
        afterEach(function () {
            _this.stub.restore();
        });
        it("should scroll to body", function () {
            _this.setupTest(true);
            expect(_this.element.scrollTop).toBe(0);
            expect(_this.stub.calledWith("body")).toBe(true);
        });
        it("should scroll to .element", function () {
            _this.setupTest(".element");
            expect(_this.element.scrollTop).toBe(0);
            expect(_this.stub.calledWith(".element")).toBe(true);
        });
        it("no scroll", function () {
            _this.setupTest(false);
            expect(_this.stub.called).toBe(false);
            expect(_this.element.scrollTop).toBe(100);
        });
        it("wont scroll on same results", function () {
            _this.setupTest(true);
            expect(_this.stub.callCount).toBe(1);
            _this.searchkit.setResults({
                hits: {
                    hits: [{ _id: 1, title: 1 }, { _id: 2, title: 2 }],
                    total: 2
                }
            });
            expect(_this.stub.callCount).toBe(1);
        });
        it("will scroll on new results", function () {
            _this.setupTest(true);
            expect(_this.stub.callCount).toBe(1);
            _this.searchkit.setResults({
                hits: {
                    hits: [{ _id: 3, title: 1 }, { _id: 4, title: 2 }],
                    total: 2
                }
            });
            expect(_this.stub.callCount).toBe(2);
            //should not scroll on rerender
            _this.searchkit.emitter.trigger();
            expect(_this.stub.callCount).toBe(2);
        });
        it("wont scroll on outside update", function () {
            _this.setupTest(true);
            expect(_this.stub.callCount).toBe(1);
            _this.searchkit.setResults({
                hits: {
                    hits: [{ _id: 3, title: 1 }, { _id: 4, title: 2 }],
                    total: 2
                }
            });
            expect(_this.stub.callCount).toBe(2);
            // Update with the same props
            _this.wrapper.setProps({
                searchkit: _this.seachkit,
                scrollTo: true,
                hitsPerPage: 10
            });
            expect(_this.stub.callCount).toBe(2);
        });
    });
});
//# sourceMappingURL=HitsSpec.js.map