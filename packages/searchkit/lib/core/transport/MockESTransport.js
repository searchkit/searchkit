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
var ESTransport_1 = require("./ESTransport");
var MockESTransport = /** @class */ (function (_super) {
    __extends(MockESTransport, _super);
    function MockESTransport() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MockESTransport.prototype.search = function (query) {
        return Promise.resolve(query);
    };
    return MockESTransport;
}(ESTransport_1.ESTransport));
exports.MockESTransport = MockESTransport;
//# sourceMappingURL=MockESTransport.js.map