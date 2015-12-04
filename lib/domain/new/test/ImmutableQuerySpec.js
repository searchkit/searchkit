var _this = this;
var ImmutableQuery_1 = require("../ImmutableQuery");
var QueryBuilders_1 = require("../QueryBuilders");
var update = require("react-addons-update");
fdescribe("ImmutableQuery Test", function () {
    beforeEach(function () {
        _this.immutableQuery = new ImmutableQuery_1.ImmutableQuery();
        _this.printJSON = function (ob) {
            console.log(JSON.stringify(ob, null, 2));
        };
    });
    it("update lib check", function () {
        // console.log(update)
    });
    it("size", function () {
        var newQuery = _this.immutableQuery.setSize(10);
        expect(newQuery == _this.immutableQuery).toEqual(false);
        expect(newQuery.query.size).toEqual(10);
    });
    it("addFilter", function () {
        var filter = { term: { genre: "action" } };
        var newQuery = _this.immutableQuery.addFilter("genre", filter);
        // this.printJSON(newQuery.query)
        expect(newQuery.query).toEqual({
            "filter": QueryBuilders_1.BoolMust([filter]),
            "query": QueryBuilders_1.BoolMust()
        });
        expect(newQuery.index).toEqual({
            filters: {
                genre: filter
            }
        });
        expect(newQuery.getFilters()).toEqual({
            bool: { must: [filter] }
        });
        expect(newQuery.getFilters("genre"))
            .toEqual(QueryBuilders_1.BoolMust());
        expect(newQuery.getFilters("author"))
            .toEqual(QueryBuilders_1.BoolMust([filter]));
    });
    it("addQuery", function () {
        var query = QueryBuilders_1.SimpleQueryString("hi", {
            default_operator: "and"
        });
        var newQuery = _this.immutableQuery.addQuery(query);
        expect(newQuery.query.query).toEqual(QueryBuilders_1.BoolMust([query]));
        expect(newQuery.query.query.bool.must[0]).toEqual({
            simple_query_string: {
                default_operator: 'and',
                query: 'hi'
            }
        });
    });
    it("setAggs", function () {
        var newAggs = {
            genres: {
                terms: {
                    field: "genre"
                }
            }
        };
        var newQuery = _this.immutableQuery.setAggs(newAggs);
        expect(newQuery.query.aggs).toEqual(newAggs);
    });
    it("areQueriesDifferent", function () {
        var a = new ImmutableQuery_1.ImmutableQuery();
        var b = new ImmutableQuery_1.ImmutableQuery();
        expect(ImmutableQuery_1.ImmutableQuery.areQueriesDifferent(a, b)).toEqual(false);
        a = a.setSize(10);
        expect(ImmutableQuery_1.ImmutableQuery.areQueriesDifferent(a, b)).toEqual(true);
        b = b.setSize(10);
        expect(ImmutableQuery_1.ImmutableQuery.areQueriesDifferent(a, b)).toEqual(false);
        a = a.addFilter("genre", { term: { genre: "action" } });
        expect(ImmutableQuery_1.ImmutableQuery.areQueriesDifferent(a, b)).toEqual(true);
        b = b.addFilter("genre", { term: { genre: "action" } });
        expect(ImmutableQuery_1.ImmutableQuery.areQueriesDifferent(a, b)).toEqual(false);
    });
});
//# sourceMappingURL=ImmutableQuerySpec.js.map