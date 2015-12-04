var _this = this;
var Searcher_1 = require("../Searcher");
var SearchkitManager_1 = require("../SearchkitManager");
var Accessor_1 = require("../accessors/Accessor");
var SearchAccessor_1 = require("../accessors/SearchAccessor");
fdescribe("Searcher Test", function () {
    beforeEach(function () {
        _this.searchkit = new SearchkitManager_1.default("assets");
        _this.searcher = new Searcher_1.default();
        _this.accessor = new SearchAccessor_1.default("q");
        _this.searcher.addAccessor(_this.accessor);
        _this.searchkit.addSearcher(_this.searcher);
        _this.accessor.state.setValue("hello");
        _this.printJSON = function (ob) {
            console.log(JSON.stringify(ob, null, 2));
        };
    });
    it("hello", function () {
        console.log("hello", Searcher_1.default, SearchkitManager_1.default, Accessor_1.default);
    });
    it("search", function () {
        _this.printJSON(_this.searchkit.makeQueryDef().queries);
        _this.printJSON(_this.searchkit.makeQueryDef().queries);
        _this.accessor.state.setValue("hello2");
        _this.printJSON(_this.searchkit.makeQueryDef().queries);
    });
});
//# sourceMappingURL=SearcherSpec.js.map