var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _this = this;
var xenon_1 = require("xenon");
var SearchBox_ts_1 = require("../../../src/components/search/search-box/page-objects/SearchBox.ts");
var RefinementListFilter_ts_1 = require("../../../src/components/search/filters/refinement-list-filter/page-objects/RefinementListFilter.ts");
var HitsStats_ts_1 = require("../../../src/components/search/hits-stats/page-objects/HitsStats.ts");
var Hit = (function (_super) {
    __extends(Hit, _super);
    function Hit() {
        _super.apply(this, arguments);
    }
    __decorate([
        xenon_1.field(xenon_1.Component, { qa: "title" }), 
        __metadata('design:type', xenon_1.Component)
    ], Hit.prototype, "title");
    return Hit;
})(xenon_1.Component);
var MovieHits = (function (_super) {
    __extends(MovieHits, _super);
    function MovieHits() {
        _super.apply(this, arguments);
    }
    MovieHits = __decorate([
        xenon_1.defaults({ qa: "hits", itemQA: "hit", itemType: Hit }), 
        __metadata('design:paramtypes', [])
    ], MovieHits);
    return MovieHits;
})(xenon_1.List);
var SearchPage = (function (_super) {
    __extends(SearchPage, _super);
    function SearchPage() {
        _super.apply(this, arguments);
    }
    __decorate([
        xenon_1.field(MovieHits), 
        __metadata('design:type', MovieHits)
    ], SearchPage.prototype, "hits");
    __decorate([
        xenon_1.field(SearchBox_ts_1.default), 
        __metadata('design:type', SearchBox_ts_1.default)
    ], SearchPage.prototype, "searchbox");
    __decorate([
        xenon_1.field(HitsStats_ts_1.default), 
        __metadata('design:type', HitsStats_ts_1.default)
    ], SearchPage.prototype, "hitStats");
    __decorate([
        xenon_1.field(RefinementListFilter_ts_1.default, { id: "actors" }), 
        __metadata('design:type', RefinementListFilter_ts_1.default)
    ], SearchPage.prototype, "actorsFilter");
    return SearchPage;
})(xenon_1.Component);
describe("example", function () {
    beforeEach(function () {
        _this.searchPage = new SearchPage();
        browser.get("http://localhost:8080/test/e2e/movie-app");
    });
    it("should show hits", function () {
        expect(_this.searchPage.hits.isVisible(20000)).toBe(true);
        expect(_this.searchPage.hits.count()).toBe(10);
    });
    it("should find matrix", function () {
        _this.searchPage.searchbox.query.type("matrix");
        browser.sleep(100);
        expect(_this.searchPage.searchbox.loader.isNotVisible()).toBe(true);
        expect(_this.searchPage.hits.get(0).isVisible()).toBe(true);
        expect(_this.searchPage.hits.get(0).title.getText()).toBe("The Matrix");
        expect(_this.searchPage.hits.count()).toBe(3);
        expect(_this.searchPage.hitStats.info.getText()).toBe("3 results found");
    });
    it("should refine actors", function () {
        expect(_this.searchPage.actorsFilter.isVisible()).toBe(true);
        var firstOption = _this.searchPage.actorsFilter.options.get(0);
        expect(_this.searchPage.actorsFilter.options.count()).toBe(10);
        expect(firstOption.label.getText()).toBe("Naveen Andrews");
        firstOption.click();
        expect(_this.searchPage.searchbox.loader.isNotVisible()).toBe(true);
        var firstHit = _this.searchPage.hits.get(0);
        expect(firstHit.isVisible()).toBe(true);
        expect(firstHit.title.getText()).toBe("Lost");
        var secondOption = _this.searchPage.actorsFilter.options.get(1);
        expect(secondOption.label.getText()).toBe("Emilie de Ravin");
        secondOption.click();
        expect(_this.searchPage.searchbox.loader.isNotVisible()).toBe(true);
        firstHit = _this.searchPage.hits.get(0);
        expect(firstHit.isVisible()).toBe(true);
        expect(firstHit.title.getText()).toBe("Confirmed Dead");
        _this.searchPage.actorsFilter.options.get(0).click();
        expect(_this.searchPage.searchbox.loader.isNotVisible()).toBe(true);
        firstHit = _this.searchPage.hits.get(0);
        expect(firstHit.title.getText()).toBe("Lost");
        expect(_this.searchPage.hitStats.info.getText()).toBe("73 results found");
    });
});
//# sourceMappingURL=TestSpec.js.map