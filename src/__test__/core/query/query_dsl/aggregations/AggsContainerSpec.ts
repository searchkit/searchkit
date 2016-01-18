import {
  AggsContainer
} from "../../../../../"

describe("AggsContainer", ()=> {

  it("should create correct aggs structure with children", ()=> {

    let aggs =
      AggsContainer("Grandparent", {name:"GrandParent"}, [
        AggsContainer("Parent1", {name:"Parent1"}),
        AggsContainer("Parent2", {name:"Parent2"}, [
          AggsContainer("Child1", {name:"Child1"}),
          AggsContainer("Child2", {name:"Child2"})
        ])
      ])

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
    })


  })


})
