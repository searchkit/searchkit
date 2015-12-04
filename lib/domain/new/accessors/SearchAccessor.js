var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State_1 = require("../State");
var Accessor_1 = require("./Accessor");
var QueryBuilders_1 = require("../QueryBuilders");
var SearchAccessor = (function (_super) {
    __extends(SearchAccessor, _super);
    function SearchAccessor() {
        _super.apply(this, arguments);
        this.state = new State_1.ValueState();
    }
    SearchAccessor.prototype.buildSharedQuery = function (query) {
        return query.addQuery(QueryBuilders_1.SimpleQueryString(this.state.getValue()));
    };
    SearchAccessor.prototype.buildOwnQuery = function (query) {
        return query;
    };
    return SearchAccessor;
})(Accessor_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchAccessor;
//# sourceMappingURL=SearchAccessor.js.map