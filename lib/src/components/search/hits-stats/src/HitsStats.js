var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
require("../styles/index.scss");
var core_1 = require("../../../../core");
var defaults = require("lodash/defaults");
var get = require("lodash/get");
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
    HitsStats.prototype.getTime = function () {
        return get(this.getResults(), "took", 0);
    };
    HitsStats.prototype.renderText = function () {
        return (React.createElement("div", {"className": this.bemBlocks.container("info"), "data-qa": "info"}, this.translate("hitstats.results_found", {
            timeTaken: this.getTime(),
            hitCount: this.searchkit.getHitsCount()
        })));
    };
    HitsStats.prototype.render = function () {
        return (React.createElement("div", {"className": this.bemBlocks.container(), "data-qa": "hits-stats"}, this.renderText()));
    };
    HitsStats.translations = {
        "hitstats.results_found": "{hitCount} results found in {timeTaken}ms"
    };
    HitsStats.propTypes = defaults({
        translations: core_1.SearchkitComponent.translationsPropType(HitsStats.translations)
    }, core_1.SearchkitComponent.propTypes);
    return HitsStats;
})(core_1.SearchkitComponent);
exports.HitsStats = HitsStats;
//# sourceMappingURL=HitsStats.js.map