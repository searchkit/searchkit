var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var ESTransport_1 = require("./ESTransport");
var defaults = require("lodash/defaults");
var AxiosESTransport = /** @class */ (function (_super) {
    __extends(AxiosESTransport, _super);
    function AxiosESTransport(host, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.host = host;
        _this.options = defaults(options, {
            headers: {},
            searchUrlPath: "/_search",
            timeout: AxiosESTransport.timeout
        });
        var credentials = AxiosESTransport.parseCredentials(_this.options);
        var config = defaults(credentials, {
            baseURL: _this.host,
            timeout: _this.options.timeout,
            headers: _this.options.headers
        });
        _this.axios = axios_1.default.create(config);
        return _this;
    }
    AxiosESTransport.prototype.search = function (query) {
        return this.axios.post(this.options.searchUrlPath, query)
            .then(this.getData);
    };
    AxiosESTransport.prototype.getData = function (response) {
        return response.data;
    };
    AxiosESTransport.parseCredentials = function (options) {
        var credentials = {};
        if (options.basicAuth !== undefined) {
            var parsed = options.basicAuth.split(":");
            var auth = { username: parsed[0], password: parsed[1] };
            credentials['auth'] = auth;
        }
        if (options.withCredentials) {
            credentials['withCredentials'] = true;
        }
        return credentials;
    };
    AxiosESTransport.timeout = 5000;
    return AxiosESTransport;
}(ESTransport_1.ESTransport));
exports.AxiosESTransport = AxiosESTransport;
//# sourceMappingURL=AxiosESTransport.js.map