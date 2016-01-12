var _1 = require("../../../");
describe("QueryBuilders", function () {
    it("BoolMust", function () {
        expect(_1.BoolMust([1, 2])).toEqual({
            bool: { must: [1, 2] },
            $array: [1, 2]
        });
    });
    it("BoolMustNot", function () {
        expect(_1.BoolMustNot([1, 2])).toEqual({
            bool: { must_not: [1, 2] },
            $array: [1, 2]
        });
    });
    it("BoolShould", function () {
        expect(_1.BoolShould([1, 2])).toEqual({
            bool: { should: [1, 2] },
            $array: [1, 2]
        });
    });
    it("MatchPhrasePrefix", function () {
        expect(_1.MatchPhrasePrefix("foo", "bar^2")).toEqual({
            match_phrase_prefix: {
                bar: {
                    query: "foo",
                    boost: 2
                }
            }
        });
        expect(_1.MatchPhrasePrefix("foo", "bar")).toEqual({
            match_phrase_prefix: {
                bar: {
                    query: "foo",
                    boost: 1
                }
            }
        });
    });
    it("SimpleQueryString", function () {
        expect(_1.SimpleQueryString("")).toEqual(undefined);
        expect(_1.SimpleQueryString("foo", { size: 10 })).toEqual({
            simple_query_string: { size: 10, query: 'foo' }
        });
    });
    it("Term", function () {
        expect(_1.Term("genre", "games")).toEqual({
            term: {
                genre: 'games'
            },
            $disabled: true
        });
        var options = {
            $name: "Genre", $value: "Games",
            $id: "1", $disabled: false
        };
        expect(_1.Term("genre", "games", options)).toEqual({
            term: {
                genre: 'games'
            },
            $disabled: false,
            $name: "Genre",
            $value: "Games",
            $id: "1"
        });
    });
    it("Terms", function () {
        expect(_1.Terms("games", { size: 50 })).toEqual({
            terms: { field: 'games', size: 50 }
        });
    });
    it("AggsRange()", function () {
        expect(_1.AggsRange("price", [1, 2, 3])).toEqual({
            range: {
                field: "price",
                ranges: [1, 2, 3]
            }
        });
    });
    it("Aggs()", function () {
        var aggs = _1.Aggs("genre", ["filter1", "filter2"], _1.Terms("genre"));
        expect(aggs).toEqual({
            genre: {
                filter: ["filter1", "filter2"],
                aggs: {
                    genre: {
                        terms: {
                            field: "genre"
                        }
                    }
                }
            }
        });
    });
    it("AggsList()", function () {
        var aggsList = _1.AggsList("genre", ["filter1", "filter2"], { test: _1.Terms("genre") });
        expect(aggsList).toEqual({
            "genre": {
                filter: ["filter1", "filter2"],
                aggs: {
                    test: {
                        terms: {
                            field: "genre"
                        }
                    }
                }
            }
        });
    });
    it("NestedFilter()", function () {
        var nestedFilter = _1.NestedFilter("taxonomy", _1.BoolMust(["filter1", "filter2"]));
        expect(nestedFilter).toEqual({
            nested: {
                path: "taxonomy",
                filter: {
                    bool: {
                        must: ["filter1", "filter2"]
                    },
                    $array: ["filter1", "filter2"],
                },
            },
            $array: ["filter1", "filter2"]
        });
    });
});
//# sourceMappingURL=QueryBuildersSpec.js.map