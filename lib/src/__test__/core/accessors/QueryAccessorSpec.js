var _this = this;
var _1 = require("../../../");
describe("QueryAccessor", function () {
    describe("prefix", function () {
        beforeEach(function () {
            _this.accessor = new _1.QueryAccessor("q", {
                queryFields: ["title^10", "keywords"],
                prefixQueryFields: ["title^10", "keywords"]
            });
        });
        it("buildSharedQuery()", function () {
            var query = new _1.ImmutableQuery();
            _this.accessor.state = new _1.ValueState("some query");
            query = _this.accessor.buildSharedQuery(query);
            expect(query.query.query).toEqual(_1.BoolMust([
                _1.BoolShould([
                    _1.SimpleQueryString("some query", { fields: ["title^10", "keywords"] }),
                    _1.MultiMatchQuery("some query", {
                        type: "phrase_prefix",
                        fields: ["title^10", "keywords"]
                    })
                ])
            ]));
            expect(query.getQueryString()).toBe("some query");
        });
        it("buildSharedQuery() - empty query", function () {
            _this.accessor.state = new _1.ValueState("");
            var query = new _1.ImmutableQuery();
            var newQuery = _this.accessor.buildSharedQuery(query);
            expect(newQuery).toBe(query);
        });
    });
    describe("queryOptions", function () {
        it("extend options", function () {
            _this.accessor = new _1.QueryAccessor("q", {
                queryFields: ["_all"],
                queryOptions: {
                    type: "best_fields",
                    x: "y"
                }
            });
            var query = new _1.ImmutableQuery();
            _this.accessor.state = new _1.ValueState("some query");
            query = _this.accessor.buildSharedQuery(query);
            expect(query.query.query).toEqual(_1.BoolMust([
                _1.BoolShould([
                    _1.SimpleQueryString("some query", { fields: ["_all"], type: "best_fields", x: "y" })
                ])
            ]));
        });
    });
    describe("queryFields", function () {
        beforeEach(function () {
            _this.createAccessor = function (fields) {
                _this.accessor = new _1.QueryAccessor("q", {
                    queryFields: fields
                });
            };
        });
        it("queryFields specified", function () {
            _this.createAccessor(["title^10", "_all"]);
            var query = new _1.ImmutableQuery();
            _this.accessor.state = new _1.ValueState("some query");
            query = _this.accessor.buildSharedQuery(query);
            expect(query.query.query).toEqual(_1.BoolMust([
                _1.BoolShould([
                    _1.SimpleQueryString("some query", { fields: ["title^10", "_all"] })
                ])
            ]));
        });
        it("queryFields not specified", function () {
            _this.createAccessor(null);
            var query = new _1.ImmutableQuery();
            _this.accessor.state = new _1.ValueState("some query");
            query = _this.accessor.buildSharedQuery(query);
            expect(query.query.query).toEqual(_1.BoolMust([
                _1.BoolShould([
                    _1.SimpleQueryString("some query", { fields: ["_all"] })
                ])
            ]));
        });
    });
});
//# sourceMappingURL=QueryAccessorSpec.js.map