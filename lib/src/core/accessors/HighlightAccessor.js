var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Accessor_1 = require("./Accessor");
var mapValues = require("lodash/mapValues");
var zipObject = require("lodash/zipObject");
var constant = require("lodash/constant");
var HighlightAccessor = (function (_super) {
    __extends(HighlightAccessor, _super);
    function HighlightAccessor(fields) {
        _super.call(this);
        this.fields = fields;
        this.highlightFields = this.computeHighlightedFields(fields);
    }
    HighlightAccessor.prototype.computeHighlightedFields = function (fields) {
        return {
            fields: mapValues(zipObject(fields), constant({}))
        };
    };
    HighlightAccessor.prototype.buildOwnQuery = function (query) {
        return query.setHighlight(this.highlightFields);
    };
    return HighlightAccessor;
})(Accessor_1.Accessor);
exports.HighlightAccessor = HighlightAccessor;
//# sourceMappingURL=HighlightAccessor.js.map