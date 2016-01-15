import * as React from "react";
import {mount} from "enzyme";
import {NoHits} from "../src/NoHits";
import {SearchkitManager} from "../../../../core";
import * as _ from "lodash";
import * as sinon from "sinon";

describe("NoHits component", () => {

  beforeEach(() => {

    this.searchkit = new SearchkitManager("localhost:9200", {useHistory:false})

    this.createWrapper = () => {
      this.wrapper = mount(
        <NoHits searchkit={this.searchkit} translations={{"nohits.no_results":"no movies"}}/>
      )
    }

  });


  it('renders correctly', () => {
    this.createWrapper()
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
