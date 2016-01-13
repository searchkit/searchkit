var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SearchkitComponent_1 = require("./SearchkitComponent");
var block = require('bem-cn');
var SearchkitFilterComponent = (function (_super) {
    __extends(SearchkitFilterComponent, _super);
    function SearchkitFilterComponent(props) {
        _super.call(this, props);
        this.state["collapsed"] = !!this.props.collapsed;
    }
    return SearchkitFilterComponent;
})(SearchkitComponent_1.SearchkitComponent);
exports.SearchkitFilterComponent = SearchkitFilterComponent;
//# sourceMappingURL=SearchkitFilterComponent.js.map