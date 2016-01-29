var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
require("../styles/index.scss");
var core_1 = require("../../../../core");
var map = require("lodash/map");
var defaults = require("lodash/defaults");
var Hits = (function (_super) {
    __extends(Hits, _super);
    function Hits() {
        _super.apply(this, arguments);
    }
    Hits.prototype.componentWillMount = function () {
        _super.prototype.componentWillMount.call(this);
        if (this.props.highlightFields) {
            this.searchkit.addAccessor(new core_1.HighlightAccessor(this.props.highlightFields));
        }
    };
    Hits.prototype.defineAccessor = function () {
        return new core_1.PageSizeAccessor(this.props.hitsPerPage);
    };
    Hits.prototype.defineBEMBlocks = function () {
        var block = (this.props.mod || "hits");
        return {
            container: block,
            item: block + "-hit"
        };
    };
    Hits.prototype.renderResult = function (result) {
        return (React.createElement("div", {"data-qa": "hit", "className": this.bemBlocks.item().mix(this.bemBlocks.container("item")), "key": result._id}));
    };
    Hits.prototype.render = function () {
        var hits = this.getHits();
        var hasHits = hits.length > 0;
        var results = null;
        if (!this.isInitialLoading() && hasHits) {
            results = map(hits, this.renderResult.bind(this));
            return (React.createElement("div", {"data-qa": "hits", "className": this.bemBlocks.container()}, results));
        }
        return null;
    };
    Hits.propTypes = defaults({
        hitsPerPage: React.PropTypes.number.isRequired,
        highlightFields: React.PropTypes.arrayOf(React.PropTypes.string)
    }, core_1.SearchkitComponent.propTypes);
    return Hits;
})(core_1.SearchkitComponent);
exports.Hits = Hits;
//# sourceMappingURL=Hits.js.map