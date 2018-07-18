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
var PropTypes = require("prop-types");
var core_1 = require("../../../../core");
var defaults = require("lodash/defaults");
var identity = require("lodash/identity");
var HitsStatsDisplay = function (props) {
    var resultsFoundLabel = props.resultsFoundLabel, bemBlocks = props.bemBlocks;
    return (React.createElement("div", { className: bemBlocks.container(), "data-qa": "hits-stats" },
        React.createElement("div", { className: bemBlocks.container("info"), "data-qa": "info" }, resultsFoundLabel)));
};
var HitsStats = /** @class */ (function (_super) {
    __extends(HitsStats, _super);
    function HitsStats() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.translations = HitsStats.translations;
        return _this;
    }
    HitsStats.prototype.defineBEMBlocks = function () {
        return {
            container: (this.props.mod || "sk-hits-stats")
        };
    };
    HitsStats.prototype.render = function () {
        var timeTaken = this.searchkit.getTime();
        var countFormatter = this.props.countFormatter;
        var hitsCount = countFormatter(this.searchkit.getHitsCount());
        var props = {
            bemBlocks: this.bemBlocks,
            translate: this.translate,
            timeTaken: timeTaken,
            hitsCount: hitsCount,
            resultsFoundLabel: this.translate("hitstats.results_found", {
                timeTaken: timeTaken,
                hitCount: hitsCount
            })
        };
        return core_1.renderComponent(this.props.component, props);
    };
    HitsStats.translations = {
        "hitstats.results_found": "{hitCount} results found in {timeTaken}ms"
    };
    HitsStats.propTypes = defaults({
        translations: core_1.SearchkitComponent.translationsPropType(HitsStats.translations),
        countFormatter: PropTypes.func
    }, core_1.SearchkitComponent.propTypes);
    HitsStats.defaultProps = {
        component: HitsStatsDisplay,
        countFormatter: identity
    };
    return HitsStats;
}(core_1.SearchkitComponent));
exports.HitsStats = HitsStats;
//# sourceMappingURL=HitsStats.js.map