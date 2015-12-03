var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ESClient_ts_1 = require("../domain/ESClient.ts");
var SearchkitComponent = (function (_super) {
    __extends(SearchkitComponent, _super);
    function SearchkitComponent() {
        _super.apply(this, arguments);
    }
    SearchkitComponent.prototype.defineAccessor = function () {
        return null;
    };
    SearchkitComponent.prototype.componentWillMount = function () {
        this.searcher = this.context["searcher"];
        this.accessor = this.defineAccessor();
        if (this.accessor) {
            this.searcher.stateManager.registerAccessor(this.accessor);
        }
    };
    SearchkitComponent.contextTypes = {
        searcher: React.PropTypes.instanceOf(ESClient_ts_1.default)
    };
    return SearchkitComponent;
})(React.Component);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchkitComponent;
//# sourceMappingURL=SearchkitComponent.js.map