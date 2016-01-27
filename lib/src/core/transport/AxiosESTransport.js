var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var axios = require("axios");
var ESTransport_1 = require("./ESTransport");
var defaults = require("lodash/defaults");
var AxiosESTransport = (function (_super) {
    __extends(AxiosESTransport, _super);
    function AxiosESTransport(host, options) {
        if (options === void 0) { options = {}; }
        _super.call(this);
        this.host = host;
        this.options = defaults(options, {
            headers: {}
        });
        if (this.options.basicAuth) {
            this.options.headers["Authorization"] = ("Basic " + btoa(this.options.basicAuth));
        }
        this.axios = axios.create({
            baseURL: this.host,
            timeout: AxiosESTransport.timeout,
            headers: this.options.headers
        });
    }
    AxiosESTransport.prototype.search = function (query) {
        return this.axios.post("/_search", query)
            .then(this.getData);
    };
    AxiosESTransport.prototype.getData = function (response) {
        return response.data;
    };
    AxiosESTransport.timeout = 5000;
    return AxiosESTransport;
})(ESTransport_1.ESTransport);
exports.AxiosESTransport = AxiosESTransport;
//# sourceMappingURL=AxiosESTransport.js.map