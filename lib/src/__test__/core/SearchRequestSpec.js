var _this = this;
var _1 = require("../../");
describe("SearchRequest", function () {
    beforeEach(function () {
        _this.searchers = new _1.SearcherCollection([]);
        _this.transport = new _1.ESTransport("http://localhost:9200");
        _this.request = new _1.SearchRequest(_this.transport, _this.searchers);
        _this.searchers.getQueries = function () {
            return [1, 2, 3];
        };
        _this.searchers.setResponses = function (responses) {
            _this.responses = responses;
        };
        _this.searchers.setError = function (error) {
            _this.error = error;
        };
    });
    it("constructor()", function () {
        expect(_this.request.active)
            .toBe(true);
        expect(_this.request.transport)
            .toBe(_this.transport);
        expect(_this.request.searchers).toBe(_this.searchers);
    });
    it("run() - success", function (done) {
        spyOn(_this.request.transport, "search")
            .and.returnValue(Promise.resolve([
            "r1", "r2", "r2"
        ]));
        _this.request.run().then(function () {
            expect(_this.responses)
                .toEqual(["r1", "r2", "r2"]);
            done();
        });
    });
    it("run() - error", function () {
        var error = new Error("oh no");
        spyOn(_this.request.transport, "search")
            .and.returnValue(Promise.reject(error));
        _this.request.run().then(function () {
            expect(_this.error).toBe(error);
        });
    });
    it("deactivate()", function () {
        _this.request.deactivate();
        expect(_this.request.active).toBe(false);
    });
    it("setResponses()", function () {
        _this.request.setResponses("responses");
        expect(_this.responses).toBe("responses");
        delete _this.responses;
        _this.request.deactivate();
        _this.request.setResponses("responses");
        expect(_this.responses).toBe(undefined);
    });
    it("setError()", function () {
        var error = new Error("oh no");
        _this.request.setError(error);
        expect(_this.error).toBe(error);
        delete _this.error;
        _this.request.deactivate();
        _this.request.setError(error);
        expect(_this.error).toBe(undefined);
    });
});
//# sourceMappingURL=SearchRequestSpec.js.map