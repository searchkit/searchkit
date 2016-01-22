var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ESTransport_1 = require("./ESTransport");
var MockESTransport = (function (_super) {
    __extends(MockESTransport, _super);
    function MockESTransport() {
        _super.apply(this, arguments);
    }
    MockESTransport.prototype.search = function (query) {
        return Promise.resolve(query);
    };
    return MockESTransport;
})(ESTransport_1.ESTransport);
exports.MockESTransport = MockESTransport;
//# sourceMappingURL=MockESTransport.js.map