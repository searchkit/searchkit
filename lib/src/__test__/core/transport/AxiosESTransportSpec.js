var _this = this;
var _1 = require("../../../");
require("jasmine-ajax");
describe("AxiosESTransport", function () {
    beforeEach(function () {
        jasmine.Ajax.install();
        _this.host = "http://search:9200/";
        _this.transport = new _1.AxiosESTransport(_this.host);
    });
    afterEach(function () {
        jasmine.Ajax.uninstall();
    });
    it("constructor()", function () {
        expect(_this.transport.host).toBe(_this.host);
        expect(_this.transport.options.headers).toEqual({});
        var axiosConfig = _this.transport.axios.defaultConfig;
        expect(axiosConfig.baseURL).toBe(_this.host);
        expect(axiosConfig.timeout).toBe(_1.AxiosESTransport.timeout);
        expect(axiosConfig.headers).toBe(_this.transport.options.headers);
        expect(_this.transport instanceof _1.ESTransport).toBe(true);
    });
    it("constructor() - headers", function () {
        var transport = new _1.AxiosESTransport(_this.host, {
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
    it("search()", function (done) {
        var mockResults = { hits: [1, 2, 3] };
        jasmine.Ajax.stubRequest(_this.host + "_search").andReturn({
            "responseText": JSON.stringify(mockResults)
        });
        _this.transport.search({
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
    it("test timeout", function () {
        _1.AxiosESTransport.timeout = 10;
        _this.transport = new _1.AxiosESTransport(_this.host);
        expect(_this.transport.axios.defaultConfig.timeout)
            .toEqual(10);
    });
});
//# sourceMappingURL=AxiosESTransportSpec.js.map