import * as React from "react";
import {mount} from "enzyme";
import {Layout, LayoutBody, SideBar, ActionBar, ActionBarRow, TopBar, LayoutResults } from "./Layout"
import {fastClick, hasClass, jsxToHTML, printPrettyHtml} from "../../__test__/TestHelpers"

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

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div>
        <div className="sk-layout sk-layout__size-m">
          <div className="sk-layout__top-bar sk-top-bar">
            <div className="sk-top-bar__content">search bar</div>
          </div>
          <div className="sk-layout__body">
            <div className="sk-layout__filters">filters</div>
            <div className="sk-layout__results sk-results-list">
              <div className="sk-results-list__action-bar sk-action-bar">
                <div className="sk-action-bar-row">row 1</div>
                <div className="sk-action-bar-row">row 2</div>
              </div>
              <p>hits</p>
            </div>
          </div>
        </div>
      </div>
    ))
  })

  it("layout - no size prop", () => {
    this.wrapper = mount(
      <div>
        <Layout>
          content
        </Layout>
      </div>
    )

    expect(this.wrapper.html()).toEqual(jsxToHTML(
      <div>
        <div className="sk-layout">
          content
        </div>
      </div>
    ))
  })


})
