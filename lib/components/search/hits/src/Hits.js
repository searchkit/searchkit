var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var React = require("react");
var classNames = require('classnames');
var core_1 = require("../../../../core");
var Hits = (function (_super) {
    __extends(Hits, _super);
    function Hits() {
        _super.apply(this, arguments);
    }
    Hits.prototype.defineAccessor = function () {
        return new core_1.PageSizeAccessor("s", this.props.hitsPerPage);
    };
    Hits.prototype.renderResult = function (result) {
        return (React.createElement("div", {"className": "hit", "key": result._id}));
    };
    Hits.prototype.render = function () {
        var hits = _.get(this.searcher, "results.hits.hits", null);
        var className = classNames({
            "hits": true,
            "hits--is-loading": this.isLoading()
        });
        return (React.createElement("div", {"className": className}, _.map(hits, this.renderResult.bind(this))));
    };
    return Hits;
})(core_1.SearchkitComponent);
exports.Hits = Hits;
//# sourceMappingURL=Hits.js.map