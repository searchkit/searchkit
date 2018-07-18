var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var NoHits_1 = require("../src/NoHits");
var core_1 = require("../../../../core");
var TestHelpers_1 = require("../../../__test__/TestHelpers");
var sinon = require("sinon");
describe("NoHits component", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        spyOn(_this.searchkit, "performSearch");
        _this.queryAccessor = _this.searchkit.getQueryAccessor();
        spyOn(_this.queryAccessor, "setQueryString");
        spyOn(_this.queryAccessor, "keepOnlyQueryState");
        _this.createWrapper = function () {
            _this.wrapper = enzyme_1.mount(React.createElement(NoHits_1.NoHits, { searchkit: _this.searchkit, translations: { "NoHits.NoResultsFound": "no movies", "NoHits.Error": "error" }, suggestionsField: "title" }));
        };
    });
    describe('renders correctly', function () {
        beforeEach(function () {
            _this.createWrapper();
            _this.hasRendered = function () {
                return _this.wrapper.find(".sk-no-hits").length == 1;
            };
        });
        it("doesn't render on initial load", function () {
            _this.searchkit.initialLoading = true;
            _this.wrapper.update();
            expect(_this.hasRendered()).toBeFalsy();
        });
        it("doesn't render on hits", function () {
            _this.searchkit.initialLoading = false;
            _this.searchkit.setResults({
                hits: {
                    hits: [1, 2, 3],
                    total: 3
                }
            });
            _this.wrapper.update();
            expect(_this.hasRendered()).toBeFalsy();
        });
        it("doesn't render on loading", function () {
            _this.searchkit.isLoading = function () { return true; };
            _this.wrapper.update();
            expect(_this.hasRendered()).toBeFalsy();
        });
        it("renders on no hits", function () {
            _this.searchkit.setResults({
                hits: {
                    hits: [],
                    total: 0
                }
            });
            _this.wrapper.update();
            expect(_this.hasRendered()).toBeTruthy();
            expect(_this.wrapper.find('.sk-no-hits__info').text())
                .toBe("no movies");
        });
    });
    describe("suggestions", function () {
        it("suggest text", function () {
            _this.createWrapper();
            _this.searchkit.query = _this.searchkit.query.setQueryString("matrixx");
            _this.searchkit.setResults({
                hits: {
                    hits: [],
                    total: 0
                },
                suggest: {
                    suggestions: [
                        {
                            options: [
                                {
                                    text: "matrix"
                                }
                            ]
                        }
                    ]
                }
            });
            _this.wrapper.update();
            expect(_this.wrapper.find(".sk-no-hits__info").text())
                .toEqual("No results found for matrixx. Did you mean matrix?");
            expect(_this.wrapper.find('.sk-no-hits__steps').text())
                .toEqual("Search for matrix instead");
            TestHelpers_1.fastClick(_this.wrapper.find(".sk-no-hits__step-action"));
            expect(_this.queryAccessor.setQueryString)
                .toHaveBeenCalledWith("matrix", true);
            expect(_this.searchkit.performSearch)
                .toHaveBeenCalledWith(true);
        });
        it("suggest remove filters", function () {
            _this.createWrapper();
            _this.searchkit.query = _this.searchkit.query.addFilter({}).setQueryString("matrix");
            _this.searchkit.setResults({
                aggregations: {
                    "no_filters_top_hits": {
                        hits: {
                            total: 1
                        }
                    }
                },
                hits: {
                    hits: [],
                    total: 0
                }
            });
            _this.wrapper.update();
            expect(_this.wrapper.find('.sk-no-hits__steps').text())
                .toBe("Search for matrix without filters");
            TestHelpers_1.fastClick(_this.wrapper.find(".sk-no-hits__step-action"));
            expect(_this.queryAccessor.keepOnlyQueryState)
                .toHaveBeenCalled();
            expect(_this.searchkit.performSearch).toHaveBeenCalled();
        });
        it("render error", function () {
            _this.createWrapper();
            sinon.stub(console, "error");
            _this.searchkit.query = _this.searchkit.query.addFilter({}).setQueryString("matrix");
            _this.searchkit.setError("simulated error");
            _this.wrapper.update();
            expect(_this.wrapper).toMatchSnapshot();
            console.error["restore"]();
        });
    });
});
//# sourceMappingURL=NoHitsSpec.js.map