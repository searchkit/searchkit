var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
var SearchkitComponent_ts_1 = require("../../../SearchkitComponent.ts");
require("./../styles/index.scss");
var HitsStats = (function (_super) {
    __extends(HitsStats, _super);
    function HitsStats() {
        _super.apply(this, arguments);
    }
    HitsStats.prototype.getHitCount = function () {
        return _.get(this.searcher, "results.hits.total", 0);
    };
    HitsStats.prototype.render = function () {
        return (React.createElement("div", {"className": "hits-stats"}, React.createElement("div", {"className": "hits-stats__info"}, this.getHitCount(), " results found")));
    };
    return HitsStats;
})(SearchkitComponent_ts_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HitsStats;
//# sourceMappingURL=HitsStats.js.map