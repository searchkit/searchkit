import * as React from "react";
import {mount} from "enzyme";
import {Layout, LayoutBody, SideBar, ActionBar, ActionBarRow, TopBar, LayoutResults } from "./Layout"
import {fastClick, hasClass, printPrettyHtml} from "../../__test__/TestHelpers"

describe("Layout components", ()=> {

  it("should render correctly", ()=> {

    this.wrapper = mount(
      <div>
      <Layout size="m">
        <TopBar>search bar</TopBar>

        <LayoutBody>
          <SideBar>
            filters
          </SideBar>

          <LayoutResults>
            <ActionBar>
              <ActionBarRow>row 1</ActionBarRow>
              <ActionBarRow>row 2</ActionBarRow>
            </ActionBar>
            <p>hits</p>
          </LayoutResults>

        </LayoutBody>
      </Layout>
      </div>
    )

    expect(this.wrapper).toMatchSnapshot()

  })

  it("layout - no size prop", () => {
    this.wrapper = mount(
      <div>
        <Layout>
          content
        </Layout>
      </div>
    )

    expect(this.wrapper).toMatchSnapshot()

  })


})
