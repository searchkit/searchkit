var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var Hits_1 = require("../src/Hits");
var core_1 = require("../../../../core");
describe("Hits component", function () {
    beforeEach(function () {
        _this.searchkit = new core_1.SearchkitManager("localhost:9200", { useHistory: false });
        _this.createWrapper = function () {
            _this.wrapper = enzyme_1.mount(React.createElement(Hits_1.Hits, {"searchkit": _this.searchkit, "hitsPerPage": 10}));
        };
    });
    describe('renders correctly', function () {
        beforeEach(function () {
            _this.createWrapper();
            _this.hasRendered = function () {
                return _this.wrapper.find(".hits").length == 1;
            };
        });
        it("does render", function () {
            _this.searchkit.initialLoading = false;
            _this.searchkit.setResults({
                hits: {
                    hits: [{ _id: 1, title: 1 }, { _id: 2, title: 2 }],
                    total: 2
                }
            });
            _this.wrapper.update();
            expect(_this.hasRendered()).toBeTruthy();
        });
        it("does not render on no hits", function () {
            _this.searchkit.initialLoading = false;
            _this.searchkit.setResults({
                hits: {
                    hits: [],
                    total: 0
                }
            });
            _this.wrapper.update();
            expect(_this.hasRendered()).toBeFalsy();
        });
        it("does render on initial view", function () {
            _this.searchkit.initialLoading = true;
            _this.wrapper.update();
            expect(_this.hasRendered()).toBeTruthy();
            expect(_this.wrapper.find(".hits__initial-loading").length).toBe(1);
        });
    });
});
//# sourceMappingURL=HitSpec.js.map