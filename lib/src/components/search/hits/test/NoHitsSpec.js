var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var NoHits_1 = require("../src/NoHits");
var core_1 = require("../../../../core");
describe("NoHits component", function () {
    beforeEach(function () {
        _this.searchkit = new core_1.SearchkitManager("localhost:9200", { useHistory: false });
        _this.createWrapper = function () {
            _this.wrapper = enzyme_1.mount(React.createElement(NoHits_1.NoHits, {"searchkit": _this.searchkit, "translations": { "nohits.no_results": "no movies" }}));
        };
    });
    it('renders correctly', function () {
        _this.createWrapper();
        _this.searchkit.initialLoading = true;
        _this.wrapper.update();
        expect(_this.wrapper.find('[data-qa="no-hits"]').length).toBe(0);
        _this.searchkit.initialLoading = false;
        _this.searchkit.setResults({
            hits: {
                hits: [1, 2, 3],
                total: 3
            }
        });
        _this.wrapper.update();
        expect(_this.wrapper.find('[data-qa="no-hits"]').length).toBe(0);
        _this.searchkit.setResults({
            hits: {
                hits: [],
                total: 0
            }
        });
        _this.wrapper.update();
        expect(_this.wrapper.find('[data-qa="no-hits"]').length).toBe(1);
        expect(_this.wrapper.find('[data-qa="no-hits"]').text())
            .toBe("no movies");
    });
});
//# sourceMappingURL=NoHitsSpec.js.map