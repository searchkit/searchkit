var _1 = require("../../../../../");
describe("AggsContainer", function () {
    it("should create correct aggs structure with children", function () {
        var aggs = _1.AggsContainer("Grandparent", { name: "GrandParent" }, [
            _1.AggsContainer("Parent1", { name: "Parent1" }),
            _1.AggsContainer("Parent2", { name: "Parent2" }, [
                _1.AggsContainer("Child1", { name: "Child1" }),
                _1.AggsContainer("Child2", { name: "Child2" })
            ])
        ]);
        expect(aggs).toEqual({
            "Grandparent": {
                "name": "GrandParent",
                "aggs": {
                    "Parent1": {
                        "name": "Parent1"
                    },
                    "Parent2": {
                        "name": "Parent2",
                        "aggs": {
                            "Child1": {
                                "name": "Child1"
                            },
                            "Child2": {
                                "name": "Child2"
                            }
                        }
                    }
                }
            }
        });
    });
});
//# sourceMappingURL=AggsContainerSpec.js.map