var _this = this;
var StateManager_ts_1 = require("../state/StateManager.ts");
var FacetAccessor_ts_1 = require("../accessors/FacetAccessor.ts");
var SimpleQueryAccessor_ts_1 = require("../accessors/SimpleQueryAccessor.ts");
var PaginationAccessor_ts_1 = require("../accessors/PaginationAccessor.ts");
var PageSizeAccessor_ts_1 = require("../accessors/PageSizeAccessor.ts");
describe("StateManager", function () {
    beforeEach(function () {
        _this.stateAccessors = new StateManager_ts_1.default(null);
        _this.printJson = function (ob) {
            console.log(JSON.stringify(ob, null, 2));
        };
    });
    xit("FacetAccessor", function () {
        var genreAccessor = _this.stateAccessors.registerAccessor(new FacetAccessor_ts_1.default("genres"));
        var authorAccessor = _this.stateAccessors.registerAccessor(new FacetAccessor_ts_1.default("authors", { operator: "OR" }));
        _this.stateAccessors.state.add("genres", "action");
        genreAccessor.state.add("action");
        _this.stateAccessors.state.add("authors", "joe");
        authorAccessor.state.add('ash');
        _this.printJson(_this.stateAccessors.getData().getJSON());
    });
    it("queryAccessor", function () {
        var queryAccessor = _this.stateAccessors.registerAccessor(new SimpleQueryAccessor_ts_1.default("q"));
        _this.stateAccessors.state.set("q", "test");
        var result = _this.stateAccessors.getData().getJSON();
        expect(result.query.simple_query_string.query).toBe("test");
    });
    it("paginationAccessor", function () {
        var paginationAccessor = _this.stateAccessors.registerAccessor(new PaginationAccessor_ts_1.default("page"));
        _this.stateAccessors.state.set("page", 1);
        expect(_this.stateAccessors.getData().getJSON()).toEqual({ size: 10, from: 0 });
        _this.stateAccessors.state.set("page", 2);
        expect(_this.stateAccessors.getData().getJSON()).toEqual({ size: 10, from: 10 });
    });
    it("pageSizeAccessor", function () {
        var pageSizeAccessor = _this.stateAccessors.registerAccessor(new PageSizeAccessor_ts_1.default("size"));
        _this.stateAccessors.state.set("size", 100);
        expect(_this.stateAccessors.getData().getJSON()).toEqual({ size: 100 });
    });
});
//# sourceMappingURL=NewAccessorsSpec.js.map