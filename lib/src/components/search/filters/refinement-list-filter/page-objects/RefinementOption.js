var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var xenon_1 = require("xenon");
var RefinementOption = (function (_super) {
    __extends(RefinementOption, _super);
    function RefinementOption() {
        _super.apply(this, arguments);
    }
    __decorate([
        xenon_1.field(xenon_1.Component, { qa: "checkbox" }), 
        __metadata('design:type', xenon_1.Component)
    ], RefinementOption.prototype, "checkbox", void 0);
    __decorate([
        xenon_1.field(xenon_1.Component, { qa: "label" }), 
        __metadata('design:type', xenon_1.Component)
    ], RefinementOption.prototype, "label", void 0);
    __decorate([
        xenon_1.field(xenon_1.Component, { qa: "count" }), 
        __metadata('design:type', xenon_1.Component)
    ], RefinementOption.prototype, "count", void 0);
    return RefinementOption;
})(xenon_1.Component);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RefinementOption;
//# sourceMappingURL=RefinementOption.js.map