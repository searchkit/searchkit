var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var core_1 = require("../../../../core");
var InitialLoader_1 = require("../src/InitialLoader");
describe("InitialLoader", function () {
    beforeEach(function () {
        _this.searchkit = core_1.SearchkitManager.mock();
        _this.wrapper = enzyme_1.mount(React.createElement(InitialLoader_1.InitialLoader, { searchkit: _this.searchkit }));
    });
    it("should render correctly", function () {
        expect(_this.wrapper).toMatchSnapshot();
        _this.searchkit.initialLoading = false;
        _this.wrapper.update();
        expect(_this.wrapper.children().length).toBe(0);
    });
    it("should render a custom component", function () {
        var higherOrderComp = function (_a) {
            var bemBlocks = _a.bemBlocks;
            return (React.createElement("p", { className: bemBlocks.container("foo") }, "Loading"));
        };
        var wrapper = enzyme_1.mount(React.createElement(InitialLoader_1.InitialLoader, { searchkit: _this.searchkit, component: higherOrderComp }));
        expect(_this.wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=InitialLoaderSpec.js.map