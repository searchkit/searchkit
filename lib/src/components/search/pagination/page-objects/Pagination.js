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
var Pagination = (function (_super) {
    __extends(Pagination, _super);
    function Pagination() {
        _super.apply(this, arguments);
    }
    __decorate([
        xenon_1.field(xenon_1.Component, { qa: "prev" }), 
        __metadata('design:type', xenon_1.Component)
    ], Pagination.prototype, "prevLink", void 0);
    __decorate([
        xenon_1.field(xenon_1.Component, { qa: "next" }), 
        __metadata('design:type', xenon_1.Component)
    ], Pagination.prototype, "nextLink", void 0);
    Pagination = __decorate([
        xenon_1.defaults({ qa: "pagination" }), 
        __metadata('design:paramtypes', [])
    ], Pagination);
    return Pagination;
})(xenon_1.Component);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Pagination;
//# sourceMappingURL=Pagination.js.map