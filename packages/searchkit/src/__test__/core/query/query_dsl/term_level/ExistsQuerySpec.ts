import {
    ExistsQuery
} from "../../../../../"

it("RangeQuery", () => {
    expect(ExistsQuery("prices")).toEqual({
        exists: {
            field: "prices"                
        }
    })
})
