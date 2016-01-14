var _1 = require("../../../");
describe("SearchkitComponent", function () {
    beforeEach(function () {
    });
    it("SearchkitComponent.translatePropType", function () {
        var translations = {
            continueButton: "Continue",
            cancelButton: "Cancel"
        };
        var handler = _1.SearchkitComponent
            .translationsPropType(translations);
        expect(handler({ translations: {
                continueButton: "Continue..."
            } }, "translations", "MyComponent")).toEqual(null);
        expect(handler({ translations: {
                unknown1: "",
                unknown2: ""
            } }, "translations", "MyComponent")).toEqual(new Error("MyComponent: incorrect translations, unknown1,unknown2 keys are not included in continueButton,cancelButton"));
    });
});
//# sourceMappingURL=SearchkitComponentSpec.js.map