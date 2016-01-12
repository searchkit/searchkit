var _this = this;
var _1 = require("../../");
describe("SearcherCollection", function () {
    beforeEach(function () {
        _this.searcher1 = new _1.Searcher(null);
        _this.accessor1 = new _1.PageSizeAccessor("p1", 10);
        _this.accessor2 = new _1.PageSizeAccessor("p2", 20);
        _this.searcher1.addAccessor(_this.accessor1);
        _this.searcher1.addAccessor(_this.accessor2);
        _this.searcher2 = new _1.Searcher(null);
        _this.accessor3 = new _1.PageSizeAccessor("p3", 30);
        _this.accessor4 = new _1.PageSizeAccessor("p4", 40);
        _this.searcher2.addAccessor(_this.accessor3);
        _this.searcher2.addAccessor(_this.accessor4);
        _this.searchers = new _1.SearcherCollection([_this.searcher1, _this.searcher2]);
    });
    it("constructor()", function () {
        expect(_this.searchers.searchers).toEqual([_this.searcher1, _this.searcher2]);
        expect(new _1.SearcherCollection().searchers)
            .toEqual([]);
    });
    it("getAccessors()", function () {
        expect(_this.searchers.getAccessors()).toEqual([
            _this.accessor1, _this.accessor2,
            _this.accessor3, _this.accessor4
        ]);
    });
    it("add()", function () {
        var searchers = new _1.SearcherCollection();
        expect(searchers.add(_this.searcher1))
            .toEqual(_this.searcher1);
        expect(searchers.searchers).toEqual([_this.searcher1]);
    });
    it("size()", function () {
        expect(_this.searchers.size()).toBe(2);
    });
    it("getState()", function () {
        _this.accessor1.state = new _1.ValueState("a1state");
        _this.accessor4.state = new _1.ValueState("a4state");
        expect(_this.searchers.getState()).toEqual({
            p1: "a1state", p4: "a4state"
        });
    });
    it("setAccessorStates()", function () {
        _this.searchers.setAccessorStates({
            p2: "a2state", p3: "a3state" });
        expect(_this.accessor1.state.getValue()).toBe(null);
        expect(_this.accessor2.state.getValue()).toBe("a2state");
        expect(_this.accessor3.state.getValue()).toBe("a3state");
        expect(_this.accessor4.state.getValue()).toBe(null);
    });
    it("notifyStateChange", function () {
        var stateChanges = [];
        var oldState = {};
        _1.PageSizeAccessor.prototype["onStateChange"] = function (state) {
            expect(state).toBe(oldState);
            stateChanges.push(this.key);
        };
        _this.searchers.notifyStateChange(oldState);
        expect(stateChanges).toEqual(["p1", "p2", "p3", "p4"]);
    });
    it("getChangedSearchers()", function () {
        _this.searcher2.queryHasChanged = true;
        expect(_this.searchers.getChangedSearchers())
            .toEqual(new _1.SearcherCollection([_this.searcher2]));
    });
    it("buildSharedQuery()", function () {
        var query = new _1.ImmutableQuery();
        var sharedQuery = _this.searchers.buildSharedQuery(query);
        expect(query).toBe(sharedQuery);
        _this.accessor1.buildSharedQuery = function (query) {
            return query.setSize(25);
        };
        var newSharedQuery = _this.searchers.buildSharedQuery(query);
        expect(newSharedQuery).not.toBe(query);
        expect(newSharedQuery.getSize()).toBe(25);
    });
    it("buildQuery()", function () {
        var query = new _1.ImmutableQuery();
        _this.searchers.buildQuery(query);
        expect(_this.searcher1.query.getSize()).toBe(20);
        expect(_this.searcher1.queryHasChanged).toBe(true);
        expect(_this.searcher2.query.getSize()).toBe(40);
        expect(_this.searcher2.queryHasChanged).toBe(true);
    });
    it("getQueries()", function () {
        var query = new _1.ImmutableQuery();
        _this.searchers.buildQuery(query);
        var queries = _this.searchers.getQueries();
        expect(queries.length).toBe(2);
        expect(queries[0].size).toBe(20);
        expect(queries[1].size).toBe(40);
    });
    it("setResponses()", function () {
        var responses = [[1, 2], [3, 4]];
        _this.searchers.setResponses(responses);
        expect(_this.searcher1.getResults()).toEqual([1, 2]);
        expect(_this.searcher2.getResults()).toEqual([3, 4]);
    });
    it("setError()", function () {
        var error = new Error("oh no");
        _this.searchers.setError(error);
        expect(_this.searcher1.error).toBe(error);
        expect(_this.searcher2.error).toBe(error);
    });
    it("resetState()", function () {
        _this.accessor1.state = new _1.ValueState("a1state");
        _this.accessor3.state = new _1.ValueState("a3state");
        _this.searchers.resetState();
        expect(_this.accessor1.state.getValue()).toBe(null);
        expect(_this.accessor3.state.getValue()).toBe(null);
    });
});
//# sourceMappingURL=SearcherCollectionSpec.js.map