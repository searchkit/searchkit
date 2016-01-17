var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var NoHits_1 = require("../src/NoHits");
var core_1 = require("../../../../core");
describe("NoHits component", function () {
    beforeEach(function () {
        _this.searchkit = new core_1.SearchkitManager("localhost:9200", { useHistory: false });
        _this.createWrapper = function () {
            _this.wrapper = enzyme_1.mount(React.createElement(NoHits_1.NoHits, {"searchkit": _this.searchkit, "translations": { "NoHits.NoResultsFound": "no movies" }, "suggestionsField": "title"}));
        };
    });
    describe('renders correctly', function () {
        beforeEach(function () {
            _this.createWrapper();
            _this.hasRendered = function () {
                return _this.wrapper.find(".no-hits").length == 1;
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
            expect(_this.wrapper.find('.no-hits__info').text())
                .toBe("no movies");
        });
    });
    describe("suggestions", function () {
        it("suggest text", function () {
            _this.createWrapper();
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
            expect(_this.wrapper.find('.no-hits__steps').text())
                .toEqual("Search for matrix");
        });
        it("suggest remove filters", function () {
            _this.createWrapper();
            _this.searchkit.getSelectedFilters = function () {
                return [{}];
            };
            _this.searchkit.query.getQueryString = function () {
                return "matrix";
            };
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
            expect(_this.wrapper.find('.no-hits__steps').text())
                .toBe("Search for matrix without filters");
        });
    });
});
//# sourceMappingURL=NoHitsSpec.js.map