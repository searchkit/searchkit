Object.defineProperty(exports, "__esModule", { value: true });
var NestedFieldContext_1 = require("./NestedFieldContext");
var ChildrenFieldContext_1 = require("./ChildrenFieldContext");
var EmbeddedFieldContext_1 = require("./EmbeddedFieldContext");
exports.FieldContextFactory = function (fieldOptions) {
    switch (fieldOptions.type) {
        case "nested":
            return new NestedFieldContext_1.NestedFieldContext(fieldOptions);
        case "children":
            return new ChildrenFieldContext_1.ChildrenFieldContext(fieldOptions);
        case "embedded":
        default:
            return new EmbeddedFieldContext_1.EmbeddedFieldContext(fieldOptions);
    }
};
//# sourceMappingURL=FieldContextFactory.js.map