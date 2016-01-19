var _this = this;
var _1 = require("../../../");
var _ = require("lodash");
describe("ImmutableQuery", function () {
    beforeEach(function () {
        _this.query = new _1.ImmutableQuery();
        _this.addFilter = function () {
            return _this.query.addFilter("genres", _1.BoolShould([
                _1.TermQuery("genres", "comedy")
            ]));
        };
        _this.addQuery = function () {
            return _this.query.addQuery(_1.SimpleQueryString("foo"));
        };
    });
    afterEach(function () {
        //check immutability
        expect(_this.query.query).toEqual({
            size: 0
        });
        expect(_this.query.index).toEqual({
            queryString: "",
            filtersMap: {},
            filters: [],
            selectedFilters: [],
            queries: [],
            size: 0
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
        expect(query.query.query).toEqual(_1.SimpleQueryString("foo"));
        var unchangedQuery = new _1.ImmutableQuery();
        expect(unchangedQuery.addQuery(null))
            .toBe(unchangedQuery);
    });
    it("setQueryString()", function () {
        var query = _this.query.setQueryString("foo");
        expect(query.index.queryString).toBe("foo");
    });
    it("getQueryString()", function () {
        var query = _this.query.setQueryString("foo");
        expect(query.getQueryString()).toBe("foo");
    });
    it("addAnonymousFilter()", function () {
        var mockId = "123";
        var spy = spyOn(_1.Utils, "guid").and.returnValue(mockId);
        var filter = _1.BoolShould([1]);
        var query = _this.query.addAnonymousFilter(filter);
        expect(query.query.filter).toEqual(filter);
        expect(query.index.filtersMap).toEqual((_a = {},
            _a[mockId] = filter,
            _a
        ));
        var _a;
    });
    it("addFilter()", function () {
        var filter = _1.BoolShould([1]);
        var query = _this.query.addFilter("someKey", filter);
        expect(query.query.filter)
            .toEqual(filter);
        expect(query.index.filtersMap).toEqual({
            someKey: filter
        });
    });
    describe("SelectedFilter", function () {
        beforeEach(function () {
            _this.filter = {
                id: "foo",
                name: "Bar",
                value: "someValue",
                remove: _.identity
            };
        });
        it("addSelectedFilter()", function () {
            var query = _this.query.addSelectedFilter(_this.filter);
            expect(query.index.selectedFilters).toEqual([_this.filter]);
        });
        it("addSelectedFilters()", function () {
            var query = _this.query.addSelectedFilters([_this.filter]);
            expect(query.index.selectedFilters).toEqual([_this.filter]);
        });
        it("getSelectedFilters()", function () {
            var query = _this.query.addSelectedFilters([_this.filter, _this.filter]);
            expect(query.getSelectedFilters()).toEqual([
                _this.filter, _this.filter
            ]);
        });
    });
    it("setAggs()", function () {
        var genreAggs = _1.FilterBucket("genre_filter", {}, _1.TermsBucket("genre_terms", "genre"));
        var authorAggs = _1.FilterBucket("author_filter", {}, _1.TermsBucket("author_terms", "author"));
        var query = _this.query.setAggs(genreAggs).setAggs(authorAggs);
        expect(query.query.aggs).toEqual({
            "genre_filter": {
                "filter": {},
                "aggs": {
                    "genre_terms": {
                        "terms": {
                            "field": "genre"
                        }
                    }
                }
            },
            "author_filter": {
                "filter": {},
                "aggs": {
                    "author_terms": {
                        "terms": {
                            "field": "author"
                        }
                    }
                }
            }
        });
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
        expect(query.getFiltersWithKeys("b"))
            .toEqual(_1.BoolMust([bFilter]));
    });
    it("setSize()", function () {
        var query = _this.query.setSize(10);
        expect(query.getSize()).toEqual(10);
    });
    it("setFrom()", function () {
        var query = _this.query.setFrom(10);
        expect(query.getFrom()).toEqual(10);
    });
    it("setHighlight()", function () {
        var query = _this.query.setHighlight({
            "fields": {
                "title": {},
                "plot": {}
            }
        });
        query = query.setHighlight({
            "fields": {
                "description": {}
            }
        });
        expect(query.query.highlight).toEqual({
            "fields": {
                "title": {},
                "plot": {},
                "description": {}
            }
        });
    });
    it("setSuggestions()", function () {
        var query = _this.query.setSuggestions("suggestions");
        expect(query.query.suggest).toBe("suggestions");
    });
    it("getJSON()", function () {
        var query = _this.addFilter()
            .addQuery(_1.SimpleQueryString("Hi"));
        expect(query.getJSON()).toEqual({
            "query": {
                "simple_query_string": {
                    "query": "Hi"
                }
            },
            "filter": {
                "term": {
                    "genres": "comedy"
                }
            },
            "size": 0
        });
    });
    it("printJSON()", function () {
        spyOn(console, "log");
        _this.query.printJSON();
        expect(console.log).toHaveBeenCalledWith(JSON.stringify(_this.query.getJSON(), null, 2));
    });
});
//# sourceMappingURL=ImmutableQuerySpec.js.map