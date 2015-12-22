var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var React = require("react");
require("../styles/index.scss");
var core_1 = require("../../../../core");
var Hits = (function (_super) {
    __extends(Hits, _super);
    function Hits() {
        _super.apply(this, arguments);
    }
    Hits.prototype.defineAccessor = function () {
        return new core_1.PageSizeAccessor("s", this.props.hitsPerPage);
    };
    Hits.prototype.defineBEMBlocks = function () {
        var block = (this.props.mod || "hits");
        return {
            container: block,
            item: block + "-hit"
        };
    };
    Hits.prototype.renderResult = function (result) {
        return (React.createElement("div", {"className": this.bemBlocks.item().mix(this.bemBlocks.container("item")), "key": result._id}));
    };
    Hits.prototype.renderNoResults = function () {
        return (React.createElement("div", {"className": this.bemBlocks.container("no-results")}, "No results"));
    };
    Hits.prototype.render = function () {
        var hits = _.get(this.searcher, "results.hits.hits", []);
        var results = (_.size(hits)) ? _.map(hits, this.renderResult.bind(this)) : this.renderNoResults();
        return (React.createElement("div", {"className": this.bemBlocks.container()}, results));
    };
    return Hits;
})(core_1.SearchkitComponent);
exports.Hits = Hits;
//# sourceMappingURL=Hits.js.map