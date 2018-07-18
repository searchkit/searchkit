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
var map = require("lodash/map");
var defaults = require("lodash/defaults");
var HitItem = /** @class */ (function (_super) {
    __extends(HitItem, _super);
    function HitItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HitItem.prototype.render = function () {
        return (React.createElement("div", { "data-qa": "hit", className: this.props.bemBlocks.item().mix(this.props.bemBlocks.container("item")) }, this.props.result._id));
    };
    return HitItem;
}(React.PureComponent));
exports.HitItem = HitItem;
var HitsList = /** @class */ (function (_super) {
    __extends(HitsList, _super);
    function HitsList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HitsList.prototype.render = function () {
        var _a = this.props, hits = _a.hits, mod = _a.mod, className = _a.className, itemComponent = _a.itemComponent;
        var bemBlocks = {
            container: core_1.block(mod).el,
            item: core_1.block(mod + "-hit").el
        };
        return (React.createElement("div", { "data-qa": "hits", className: bemBlocks.container().mix(className) }, map(hits, function (result, index) {
            return core_1.renderComponent(itemComponent, {
                key: result._id, result: result, bemBlocks: bemBlocks, index: index
            });
        })));
    };
    HitsList.defaultProps = {
        mod: "sk-hits",
        itemComponent: HitItem
    };
    HitsList.propTypes = {
        mod: PropTypes.string,
        className: PropTypes.string,
        itemComponent: core_1.RenderComponentPropType,
        hits: PropTypes.any
    };
    return HitsList;
}(React.PureComponent));
exports.HitsList = HitsList;
var Hits = /** @class */ (function (_super) {
    __extends(Hits, _super);
    function Hits() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Hits.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        if (this.props.hitsPerPage) {
            this.searchkit.getAccessorByType(core_1.PageSizeAccessor)
                .defaultSize = this.props.hitsPerPage;
        }
        if (this.props.highlightFields) {
            this.searchkit.addAccessor(new core_1.HighlightAccessor(this.props.highlightFields));
        }
        if (this.props.customHighlight) {
            this.searchkit.addAccessor(new core_1.CustomHighlightAccessor(this.props.customHighlight));
        }
        if (this.props.sourceFilter) {
            this.searchkit.addAccessor(new core_1.SourceFilterAccessor(this.props.sourceFilter));
        }
        this.hitsAccessor = new core_1.HitsAccessor({ scrollTo: this.props.scrollTo });
        this.searchkit.addAccessor(this.hitsAccessor);
    };
    Hits.prototype.render = function () {
        var hits = this.getHits();
        var hasHits = hits.length > 0;
        if (!this.isInitialLoading() && hasHits) {
            var _a = this.props, listComponent = _a.listComponent, mod = _a.mod, className = _a.className, itemComponent = _a.itemComponent;
            return core_1.renderComponent(listComponent, {
                hits: hits, mod: mod, className: className, itemComponent: itemComponent
            });
        }
        return null;
    };
    Hits.propTypes = defaults({
        hitsPerPage: PropTypes.number,
        highlightFields: PropTypes.arrayOf(PropTypes.string),
        sourceFilterType: PropTypes.oneOf([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.bool
        ]),
        itemComponent: core_1.RenderComponentPropType,
        listComponent: core_1.RenderComponentPropType
    }, core_1.SearchkitComponent.propTypes);
    Hits.defaultProps = {
        listComponent: HitsList,
        scrollTo: "body"
    };
    return Hits;
}(core_1.SearchkitComponent));
exports.Hits = Hits;
//# sourceMappingURL=Hits.js.map