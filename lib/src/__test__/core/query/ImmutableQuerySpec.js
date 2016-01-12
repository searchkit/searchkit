var _this = this;
var _1 = require("../../../");
describe("ImmutableQuery", function () {
    beforeEach(function () {
        _this.query = new _1.ImmutableQuery();
        _this.addFilter = function () {
            return _this.query.addFilter("genres", _1.BoolShould([
                _1.Term("genres", "comedy")
            ]));
        };
        _this.addQuery = function () {
            return _this.query.addQuery(_1.SimpleQueryString("foo"));
        };
    });
    afterEach(function () {
        //check immutability
        expect(_this.query.query).toEqual({
            filter: _1.BoolMust([]),
            query: _1.BoolMust([]),
            size: 0
        });
        expect(_this.query.index).toEqual({
            filters: {}, filtersArray: []
        });
    });
    it("hasFilters()", function () {
        expect(_this.query.hasFilters()).toBe(false);
        var query = _this.addFilter();
        expect(query.hasFilters()).toBe(true);
        //immutability check
        expect(_this.query.hasFilters()).toBe(false);
    });
    it("hasFiltersOrQuery()", function () {
        expect(_this.query.hasFiltersOrQuery()).toBe(false);
        var query = _this.addFilter();
        expect(query.hasFiltersOrQuery()).toBe(true);
        var query2 = _this.addQuery();
        expect(query2.hasFiltersOrQuery()).toBe(true);
        expect(_this.query.setSort(1).hasFiltersOrQuery())
            .toBe(true);
    });
    it("addQuery()", function () {
        var query = _this.addQuery();
        expect(query.query.query.$array).toEqual([
            _1.SimpleQueryString("foo")
        ]);
    });
    it("addHiddenFilter()", function () {
        var mockId = "123";
        var spy = spyOn(_1.Utils, "guid").and.returnValue(mockId);
        var filter = _1.BoolShould([1]);
        var query = _this.query.addHiddenFilter(filter);
        expect(query.query.filter.$array)
            .toEqual([filter]);
        expect(query.index).toEqual({
            filters: (_a = {},
                _a[mockId] = filter,
                _a
            ),
            filtersArray: [1]
        });
        var _a;
    });
    it("addFilter()", function () {
        var filter = _1.BoolShould([1]);
        var query = _this.query.addFilter("someKey", filter);
        expect(query.query.filter.$array)
            .toEqual([filter]);
        expect(query.index).toEqual({
            filters: {
                someKey: filter
            },
            filtersArray: [1]
        });
    });
    it("getFiltersArray()", function () {
        expect(_this.query.getFiltersArray())
            .toBe(_this.query.index.filtersArray);
    });
    it("setAggs()", function () {
        var genreAggs = {
            "genre": {
                filter: {},
                aggs: {
                    "genre": _1.Terms("genre", {})
                }
            }
        };
        var authorAggs = {
            "author": {
                filter: {},
                aggs: {
                    "author": _1.Terms("author", {})
                }
            }
        };
        var query = _this.query.setAggs(genreAggs).setAggs(authorAggs);
        expect(query.query.aggs).toEqual(_.extend({}, genreAggs, authorAggs));
        expect(query.query.filter).toBeDefined();
    });
    it("getFilters()", function () {
        var aFilter = _1.BoolShould(["a"]);
        var bFilter = _1.BoolShould(["b"]);
        var cFilter = _1.BoolShould(["c"]);
        var query = _this.query
            .addFilter("a", aFilter)
            .addFilter("b", bFilter)
            .addFilter("c", cFilter);
        expect(query.getFilters())
            .toEqual(_1.BoolMust([aFilter, bFilter, cFilter]));
        expect(query.getFilters("d"))
            .toEqual(_1.BoolMust([aFilter, bFilter, cFilter]));
        expect(query.getFilters("a"))
            .toEqual(_1.BoolMust([bFilter, cFilter]));
        expect(query.getFilters("b"))
            .toEqual(_1.BoolMust([aFilter, cFilter]));
    });
    it("setSize()", function () {
        var query = _this.query.setSize(10);
        expect(query.getSize()).toEqual(10);
    });
    it("setFrom()", function () {
        var query = _this.query.setFrom(10);
        expect(query.getFrom()).toEqual(10);
    });
    it("areQueriesDifferent()", function () {
        var query1 = new _1.ImmutableQuery()
            .addQuery(_1.SimpleQueryString("foo"));
        var query2 = new _1.ImmutableQuery()
            .addQuery(_1.SimpleQueryString("bar"));
        var query3 = new _1.ImmutableQuery()
            .addQuery(_1.SimpleQueryString("bar"));
        expect(_1.ImmutableQuery.areQueriesDifferent(query1, query2)).toBe(true);
        expect(_1.ImmutableQuery.areQueriesDifferent(query2, query3)).toBe(false);
    });
    it("getJSON()", function () {
        var query = _this.addFilter()
            .addQuery(_1.SimpleQueryString("Hi"));
        expect(query.getJSON()).toEqual({
            "filter": {
                "bool": {
                    "must": [{
                            "bool": {
                                "should": [{
                                        "term": {
                                            "genres": "comedy"
                                        }
                                    }]
                            }
                        }]
                }
            },
            "query": {
                "bool": {
                    "must": [{
                            "simple_query_string": {
                                "query": "Hi"
                            }
                        }]
                }
            },
            "size": 0
        });
    });
});
//# sourceMappingURL=ImmutableQuerySpec.js.map