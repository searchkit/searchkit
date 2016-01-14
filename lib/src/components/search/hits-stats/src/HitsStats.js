var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var React = require("react");
require("../styles/index.scss");
var core_1 = require("../../../../core");
var HitsStats = (function (_super) {
    __extends(HitsStats, _super);
    function HitsStats() {
        _super.apply(this, arguments);
        this.translations = HitsStats.translations;
    }
    HitsStats.prototype.defineBEMBlocks = function () {
        return {
            container: (this.props.mod || "hits-stats")
        };
    };
    HitsStats.prototype.getHitCount = function () {
        return _.get(this.getResults(), "hits.total", 0);
    };
    HitsStats.prototype.getTime = function () {
        return _.get(this.getResults(), "took", 0);
    };
    HitsStats.prototype.renderText = function () {
        return (React.createElement("div", {"className": this.bemBlocks.container("info"), "data-qa": "info"}, this.getHitCount(), " ", this.translate("ResultsFound")));
    };
    HitsStats.prototype.render = function () {
        return (React.createElement("div", {"className": this.bemBlocks.container(), "data-qa": "hits-stats"}, this.renderText()));
    };
    HitsStats.translations = {
        "ResultsFound": "results found"
    };
    HitsStats.propTypes = _.defaults({
        translations: core_1.SearchkitComponent.translationsPropType(HitsStats.translations)
    }, core_1.SearchkitComponent.propTypes);
    return HitsStats;
})(core_1.SearchkitComponent);
exports.HitsStats = HitsStats;
//# sourceMappingURL=HitsStats.js.map