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
var React = require("react");
var assign = require("lodash/assign");
var MockRange = /** @class */ (function (_super) {
    __extends(MockRange, _super);
    function MockRange(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            items: [
                { key: 0, doc_count: 0 },
                { key: 1, doc_count: 0 },
                { key: 2, doc_count: 0 },
                { key: 3, doc_count: 6 },
                { key: 4, doc_count: 7 },
                { key: 5, doc_count: 8 },
                { key: 6, doc_count: 0 },
                { key: 7, doc_count: 10 },
                { key: 8, doc_count: 0 },
                { key: 9, doc_count: 0 },
                { key: 10, doc_count: 0 },
            ],
            min: 0, max: 10,
            minValue: 2, maxValue: 5,
            onChange: jasmine.createSpy("onChange"),
            onFinished: jasmine.createSpy("onFinished")
        };
        return _this;
    }
    MockRange.prototype.render = function () {
        return React.createElement(this.props.rangeComponent, assign({}, this.state, this.props));
    };
    return MockRange;
}(React.Component));
exports.MockRange = MockRange;
//# sourceMappingURL=MockRange.js.map