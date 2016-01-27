var _this = this;
var _1 = require("../../");
describe("SearchRequest", function () {
    beforeEach(function () {
        _this.searchkit = _1.SearchkitManager.mock();
        _this.transport = new _1.AxiosESTransport("http://localhost:9200");
        _this.query = new _1.ImmutableQuery().setSize(10);
        _this.request = new _1.SearchRequest(_this.transport, _this.query, _this.searchkit);
    });
    it("constructor()", function () {
        expect(_this.request.active)
            .toBe(true);
        expect(_this.request.transport)
            .toBe(_this.transport);
        expect(_this.request.searchkit).toBe(_this.searchkit);
        expect(_this.request.query).toBe(_this.query);
    });
    it("run() - success", function (done) {
        spyOn(_this.request.transport, "search")
            .and.returnValue(Promise.resolve([
            "r1", "r2", "r2"
        ]));
        _this.request.run().then(function () {
            expect(_this.searchkit.results)
                .toEqual(["r1", "r2", "r2"]);
            done();
        });
    });
    it("run() - error", function (done) {
        var error = new Error("oh no");
        spyOn(_this.request.transport, "search")
            .and.returnValue(Promise.reject(error));
        _this.request.run().then(function () {
            expect(_this.searchkit.error).toBe(error);
            done();
        });
    });
    it("deactivate()", function () {
        _this.request.deactivate();
        expect(_this.request.active).toBe(false);
    });
    it("setResponses()", function () {
        _this.request.setResults("results");
        expect(_this.searchkit.results).toBe("results");
        delete _this.searchkit.results;
        _this.request.deactivate();
        _this.request.setResults("results");
        expect(_this.searchkit.results).toBe(undefined);
    });
    it("setError()", function () {
        var error = new Error("oh no");
        _this.request.setError(error);
        expect(_this.searchkit.error).toBe(error);
        delete _this.searchkit.error;
        _this.request.deactivate();
        _this.request.setError(error);
        expect(_this.searchkit.error).toBe(undefined);
    });
});
//# sourceMappingURL=SearchRequestSpec.js.map