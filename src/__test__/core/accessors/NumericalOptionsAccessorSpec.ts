import {
  NumericOptionsAccessor, ImmutableQuery, Searcher,
  BoolMust, BoolShould, ArrayState
} from "../../../"
import * as _ from "lodash"

describe("NumericOptionsAccessor", ()=> {

  beforeEach(()=> {
    this.searcher = new Searcher()
    this.accessor = new NumericOptionsAccessor("categories", {
      field:"price",
      id:"price_id",
      title:"”Price",
      options:[
        {title:"Cheap", from:1, to:11},
        {title:"Affordable", from:11, to:21},
        {title:"Pricey", from:21, to:101}
      ]
    })
    this.accessor.setSearcher(this.searcher)
    this.query = new ImmutableQuery()
    this.toPlainObject = (ob)=> {
      return JSON.parse(JSON.stringify(ob))
    }
  })


})
