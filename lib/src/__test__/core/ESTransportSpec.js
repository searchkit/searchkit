var _this = this;
var _1 = require("../../");
require("jasmine-ajax");
describe("ESTransport", function () {
    beforeEach(function () {
        jasmine.Ajax.install();
        _this.host = "http://search:9200/";
        _this.transport = new _1.ESTransport(_this.host);
    });
    afterEach(function () {
        jasmine.Ajax.uninstall();
    });
    it("constructor()", function () {
        expect(_this.transport.host).toBe(_this.host);
        expect(_this.transport.options.headers).toEqual({});
        var axiosConfig = _this.transport.axios.defaultConfig;
        expect(axiosConfig.baseURL).toBe(_this.host);
        expect(axiosConfig.timeout).toBe(_1.ESTransport.timeout);
        expect(axiosConfig.headers).toBe(_this.transport.options.headers);
    });
    it("constructor() - headers", function () {
        var transport = new _1.ESTransport(_this.host, {
            headers: {
                "Content-Type": "application/json",
            },
            basicAuth: "key:val"
        });
        expect(transport.options.headers).toEqual({
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa("key:val")
        });
    });
    it("_search()", function (done) {
        var mockResults = { hits: [1, 2, 3] };
        jasmine.Ajax.stubRequest(_this.host + "_search").andReturn({
            "responseText": JSON.stringify(mockResults)
        });
        _this.transport._search({
            size: 10,
            from: 0
        }).then(function (result) {
            expect(result.hits).toEqual([1, 2, 3]);
            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.method).toBe("POST");
            expect(request["data"]()).toEqual({ size: 10, from: 0 });
            done();
        });
    });
    it("_search()", function (done) {
        var mockResults = { responses: [1, 2, 3] };
        jasmine.Ajax.stubRequest(_this.host + "_msearch").andReturn({
            "responseText": JSON.stringify(mockResults)
        });
        _this.transport._msearch(["a", "b", "c"]).then(function (result) {
            expect(result).toEqual([1, 2, 3]);
            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.method).toBe("POST");
            expect(request["data"]()).toEqual(["a", "b", "c"]);
            done();
        });
    });
    it("search() - single query", function (done) {
        spyOn(_this.transport, "_search")
            .and.returnValue(Promise.resolve("singleSearchResponse"));
        var queries = ["query1"];
        _this.transport.search(queries)
            .then(function (result) {
            expect(result).toEqual(["singleSearchResponse"]);
            expect(_this.transport._search)
                .toHaveBeenCalledWith("query1");
            done();
        });
    });
    it("search() - multiple query", function (done) {
        spyOn(_this.transport, "_msearch")
            .and.returnValue(Promise.resolve([
            "r1", "r2"
        ]));
        var queries = ["q1", "q2"];
        _this.transport.search(queries)
            .then(function (result) {
            expect(result).toEqual(["r1", "r2"]);
            expect(_this.transport._msearch)
                .toHaveBeenCalledWith(["q1", "q2"]);
            done();
        });
    });
    it("test timeout", function () {
        _1.ESTransport.timeout = 10;
        _this.transport = new _1.ESTransport(_this.host);
        expect(_this.transport.axios.defaultConfig.timeout)
            .toEqual(10);
    });
});
//# sourceMappingURL=ESTransportSpec.js.map