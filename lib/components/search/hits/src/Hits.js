var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var React = require("react");
var core_1 = require("../../../../core");
require("./../styles/index.scss");
var Hits = (function (_super) {
    __extends(Hits, _super);
    function Hits() {
        _super.apply(this, arguments);
    }
    Hits.prototype.renderResult = function (result) {
        if (_.get(this.props, "render") == "movies") {
            return (React.createElement("div", {"className": "hit", "key": result._id}, React.createElement("img", {"className": "hit__poster", "src": result._source.poster}), React.createElement("div", {"className": "hit__title"}, result._source.title)));
        }
        return (React.createElement("div", {"className": "hit", "key": result._id}, React.createElement("img", {"className": "hit__poster", "src": "/assets/" + result._source.imagePath}), React.createElement("div", {"className": "hit__title"}, result._source.title)));
    };
    Hits.prototype.render = function () {
        var hits = _.get(this.searcher, "results.hits.hits", null);
        return (React.createElement("div", {"className": "hits"}, _.map(hits, this.renderResult.bind(this))));
    };
    return Hits;
})(core_1.SearchkitComponent);
exports.Hits = Hits;
//# sourceMappingURL=Hits.js.map