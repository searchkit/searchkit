var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var NoHits_1 = require("../src/NoHits");
var core_1 = require("../../../../core");
xdescribe("NoHits component", function () {
    beforeEach(function () {
        _this.searchkit = new core_1.SearchkitManager("localhost:9200", { useHistory: false });
        _this.createWrapper = function () {
            _this.wrapper = enzyme_1.mount(React.createElement(NoHits_1.NoHits, {"searchkit": _this.searchkit, "translations": { "nohits.no_results": "no movies" }}));
        };
    });
    it('renders correctly', function () {
        _this.createWrapper();
        //   this.searchkit.initialLoading = true
        //   this.wrapper.update()
        //   expect(this.wrapper.find('[data-qa="no-hits"]').length).toBe(0)
        //   this.searchkit.initialLoading = false
        //   this.searchkit.setResults({
        //     hits:{
        //       hits:[1,2,3],
        //       total:3
        //     }
        //   })
        //   this.wrapper.update()
        //   expect(this.wrapper.find('[data-qa="no-hits"]').length).toBe(0)
        //
        //   this.searchkit.setResults({
        //     hits:{
        //       hits:[],
        //       total:0
        //     }
        //   })
        //   this.wrapper.update()
        //
        //   expect(this.wrapper.find('[data-qa="no-hits"]').length).toBe(1)
        //   expect(this.wrapper.find('[data-qa="no-hits"]').text())
        //     .toBe("no movies")
        //
    });
});
//# sourceMappingURL=NoHitsSpec.js.map