var _this = this;
var _1 = require("../../../");
describe("FacetAccessor", function () {
    beforeEach(function () {
        _this.options = {
            operator: "OR",
            title: "Genres",
            id: "GenreId",
            size: 20,
            translations: {
                "facets.view_more": "View more genres"
            }
        };
        _this.accessor = new _1.FacetAccessor("genre", _this.options);
    });
    it("constructor()", function () {
        expect(_this.accessor.options).toBe(_this.options);
        expect(_this.accessor.urlKey).toBe("GenreId");
        expect(_this.accessor.key).toBe("genre");
    });
    it("getBuckets()", function () {
        expect(_this.accessor.getBuckets()).toEqual([]);
        _this.accessor.results = {
            aggregations: {
                genre: {
                    genre: { buckets: [1, 2] }
                }
            }
        };
        expect(_this.accessor.getBuckets())
            .toEqual([1, 2]);
    });
    it("getCount()", function () {
        expect(_this.accessor.getCount()).toEqual(0);
        _this.accessor.results = {
            aggregations: {
                genre: {
                    genre_count: {
                        value: 99
                    }
                }
            }
        };
        expect(_this.accessor.getCount())
            .toEqual(99);
    });
    it("isOrOperator()", function () {
        expect(_this.accessor.isOrOperator())
            .toBe(true);
        _this.options.operator = "AND";
        expect(_this.accessor.isOrOperator())
            .toBe(false);
    });
    it("getBoolBuilder()", function () {
        expect(_this.accessor.getBoolBuilder())
            .toBe(_1.BoolShould);
        _this.options.operator = "AND";
        expect(_this.accessor.getBoolBuilder())
            .toBe(_1.BoolMust);
    });
    describe("view more options", function () {
        it("setViewMoreOption", function () {
            _this.accessor.setViewMoreOption({ size: 30 });
            expect(_this.accessor.size).toBe(30);
        });
        it("getMoreSizeOption - view more", function () {
            _this.accessor.getCount = function () {
                return 100;
            };
            expect(_this.accessor.getMoreSizeOption()).toEqual({ size: 70, label: "View more genres" });
        });
        it("getMoreSizeOption - view all", function () {
            _this.accessor.getCount = function () {
                return 30;
            };
            expect(_this.accessor.getMoreSizeOption()).toEqual({ size: 30, label: "View all" });
        });
        it("getMoreSizeOption - view less", function () {
            _this.accessor.getCount = function () {
                return 30;
            };
            _this.accessor.size = 30;
            expect(_this.accessor.getMoreSizeOption()).toEqual({ size: 20, label: "View less" });
        });
        it("getMoreSizeOption - no option", function () {
            _this.accessor.getCount = function () {
                return 15;
            };
            _this.accessor.size = 20;
            expect(_this.accessor.getMoreSizeOption()).toEqual(null);
        });
    });
    describe("buildSharedQuery", function () {
        beforeEach(function () {
            _this.accessor.translate = function (key) {
                return {
                    "1": "Games", "2": "Action",
                    "3": "Comedy", "4": "Horror"
                }[key];
            };
            _this.toPlainObject = function (ob) {
                return JSON.parse(JSON.stringify(ob));
            };
            _this.accessor.state = new _1.ArrayState([
                "1", "2"
            ]);
            _this.query = new _1.ImmutableQuery();
        });
        it("filter test", function () {
            _this.query = _this.accessor.buildSharedQuery(_this.query);
            var filters = _this.query.getFilters().bool.should;
            expect(_this.toPlainObject(filters)).toEqual([
                {
                    "term": {
                        "genre": "1"
                    }
                },
                {
                    "term": {
                        "genre": "2"
                    }
                }
            ]);
            var selectedFilters = _this.query.getSelectedFilters();
            expect(selectedFilters.length).toEqual(2);
            //
            expect(_this.accessor.state.getValue()).toEqual(["1", "2"]);
            selectedFilters[0].remove();
            expect(_this.accessor.state.getValue()).toEqual(["2"]);
            selectedFilters[1].remove();
            expect(_this.accessor.state.getValue()).toEqual([]);
        });
        it("AND filter", function () {
            _this.options.operator = "AND";
            _this.query = _this.accessor.buildSharedQuery(_this.query);
            expect(_this.query.getFilters().bool.should).toBeFalsy();
            expect(_this.query.getFilters().bool.must).toBeTruthy();
        });
        it("Empty state", function () {
            _this.accessor.state = new _1.ArrayState([]);
            var query = _this.accessor.buildSharedQuery(_this.query);
            expect(query).toBe(_this.query);
        });
    });
    describe("buildOwnQuery", function () {
        beforeEach(function () {
            _this.accessor.state = new _1.ArrayState([
                "1", "2"
            ]);
            _this.query = new _1.ImmutableQuery()
                .addFilter("rating_uuid", _1.BoolShould(["PG"]));
            _this.query = _this.accessor.buildSharedQuery(_this.query);
        });
        it("build own query - or", function () {
            var query = _this.accessor.buildOwnQuery(_this.query);
            expect(query.query.aggs).toEqual(_1.FilterBucket("genre", _1.BoolMust([
                _1.BoolShould(["PG"])
            ]), _1.TermsBucket("genre", "genre", { size: 20 }), _1.CardinalityMetric("genre_count", "genre")));
        });
        it("build own query - and", function () {
            _this.options.operator = "AND";
            var query = _this.accessor.buildOwnQuery(_this.query);
            expect(query.query.aggs).toEqual(_1.FilterBucket("genre", _1.BoolMust([
                _1.BoolShould(["PG"]),
                _1.BoolShould([
                    _1.TermQuery("genre", "1"),
                    _1.TermQuery("genre", "2")
                ])
            ]), _1.TermsBucket("genre", "genre", { size: 20 }), _1.CardinalityMetric("genre_count", "genre")));
        });
    });
});
//# sourceMappingURL=FacetAccessorSpec.js.map