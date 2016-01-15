var _this = this;
var _1 = require("../../");
describe("AccessorManager", function () {
    beforeEach(function () {
        _this.searchkit = new _1.SearchkitManager("/", { useHistory: false });
        _this.accessor1 = new _1.PaginationAccessor("p1");
        _this.accessor2 = new _1.PaginationAccessor("p2");
        _this.searchkit.addAccessor(_this.accessor1);
        _this.searchkit.addAccessor(_this.accessor2);
        _this.accessor3 = new _1.PaginationAccessor("p3");
        _this.accessor4 = new _1.PaginationAccessor("p4");
        _this.accessor4b = new _1.PaginationAccessor("p4");
        _this.searchkit.addAccessor(_this.accessor3);
        _this.searchkit.addAccessor(_this.accessor4);
        _this.searchkit.addAccessor(_this.accessor4b);
        _this.accessor5 = new _1.PageSizeAccessor(50);
        _this.searchkit.addAccessor(_this.accessor5);
        _this.accessors = _this.searchkit.accessors;
    });
    it("constructor()", function () {
        expect(_this.accessors.accessors).toEqual([
            _this.accessor1, _this.accessor2,
            _this.accessor3, _this.accessor4,
            _this.accessor5
        ]);
        expect(new _1.AccessorManager().accessors)
            .toEqual([]);
    });
    it("getAccessors()", function () {
        expect(_this.accessors.getAccessors()).toEqual([
            _this.accessor1, _this.accessor2,
            _this.accessor3, _this.accessor4, _this.accessor5
        ]);
    });
    it("getActiveAccessors()", function () {
        _this.accessor2.setActive(false);
        _this.accessor3.setActive(false);
        expect(_this.accessors.getActiveAccessors()).toEqual([
            _this.accessor1, _this.accessor4, _this.accessor5
        ]);
    });
    it("getStatefulAccessors()", function () {
        expect(_this.accessors.getStatefulAccessors()).toEqual([
            _this.accessor1, _this.accessor2,
            _this.accessor3, _this.accessor4
        ]);
    });
    it("add()", function () {
        var accessors = new _1.AccessorManager();
        expect(accessors.add(_this.accessor1))
            .toEqual(_this.accessor1);
        expect(accessors.getAccessors())
            .toEqual([_this.accessor1]);
    });
    it("adding accessor with same statefulKey", function () {
        var accessors = new _1.AccessorManager();
        expect(accessors.add(_this.accessor4))
            .toEqual(_this.accessor4);
        expect(accessors.add(_this.accessor4b))
            .toEqual(_this.accessor4);
        expect(accessors.getAccessors())
            .toEqual([_this.accessor4]);
    });
    it("add() - QueryAccessor", function () {
        var accessors = new _1.AccessorManager();
        var queryAccessor = new _1.QueryAccessor("q");
        expect(accessors.add(queryAccessor)).toBe(queryAccessor);
        expect(accessors.getQueryAccessor()).toBe(queryAccessor);
    });
    it("getState()", function () {
        _this.accessor1.state = new _1.ValueState("a1state");
        _this.accessor4.state = new _1.ValueState("a4state");
        expect(_this.accessors.getState()).toEqual({
            p1: "a1state", p4: "a4state"
        });
    });
    it("setState()", function () {
        _this.accessors.setState({
            p2: "a2state", p3: "a3state" });
        expect(_this.accessor1.state.getValue()).toBe(null);
        expect(_this.accessor2.state.getValue()).toBe("a2state");
        expect(_this.accessor3.state.getValue()).toBe("a3state");
        expect(_this.accessor4.state.getValue()).toBe(null);
    });
    it("notifyStateChange", function () {
        var stateChanges = [];
        var oldState = {};
        spyOn(_1.PaginationAccessor.prototype, "onStateChange");
        _this.accessors.notifyStateChange(oldState);
        expect(_1.PaginationAccessor.prototype.onStateChange)
            .toHaveBeenCalledWith(oldState);
        expect(_1.PaginationAccessor.prototype.onStateChange["calls"].count())
            .toBe(4);
    });
    // it("setQueryString()", ()=> {
    //   let queryAccessor = new QueryAccessor("s")
    //   let accessorManager = new AccessorManager()
    //   accessorManager.add(queryAccessor)
    //   accessorManager.setQueryString("foo")
    //   expect(queryAccessor.state.getValue()).toBe('foo')
    // })
    //
    // it("resetFilters()", ()=> {
    //   let facetAccessor = new FacetAccessor("f", {size:10})
    //   facetAccessor.state.setValue(["foo", "bar"])
    //   let accessorManager = new AccessorManager()
    //   accessorManager.add(facetAccessor)
    //   accessorManager.resetFilters()
    //   expect(facetAccessor.state.getValue()).toEqual([])
    // })
    it("buildSharedQuery()", function () {
        var query = new _1.ImmutableQuery();
        var sharedQuery = _this.accessors.buildSharedQuery(query);
        _this.accessor1.buildSharedQuery = function (query) { return query.setSize(25); };
        _this.accessor2.buildSharedQuery = function (query) { return query.setSize(26); };
        _this.accessor2.setActive(false);
        _this.accessor5.setActive(false);
        var newSharedQuery = _this.accessors.buildSharedQuery(query);
        expect(newSharedQuery).not.toBe(query);
        expect(newSharedQuery.getSize()).toBe(25);
    });
    it("buildQuery()", function () {
        var query = new _1.ImmutableQuery();
        expect(_this.accessors.buildQuery(query).getSize())
            .toEqual(50);
        _this.accessor5.setActive(false);
        expect(_this.accessors.buildQuery(query).getSize())
            .toBe(0);
    });
    it("setResults()", function () {
        _this.accessors.setResults("someResults");
        expect(_this.accessor1.results).toBe("someResults");
        expect(_this.accessor4.results).toBe("someResults");
    });
    it("resetState()", function () {
        _this.accessor1.state = new _1.ValueState("a1state");
        _this.accessor3.state = new _1.ValueState("a3state");
        _this.accessors.resetState();
        expect(_this.accessor1.state.getValue()).toBe(null);
        expect(_this.accessor3.state.getValue()).toBe(null);
    });
});
//# sourceMappingURL=AccessorManagerSpec.js.map