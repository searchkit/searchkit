import * as React from 'react'

import { mount } from 'enzyme'
import { SearchkitManager, LoadingComponent } from '../../../'

describe('SearchkitProvider', () => {
  beforeEach(() => {
    this.searchkit = SearchkitManager.mock()
    this.wrapper = mount(
      <LoadingComponent searchkit={this.searchkit}>
        <p>loading...</p>
      </LoadingComponent>
    )
  })

  it('display nothing when not loading', () => {
    expect(this.wrapper).toMatchSnapshot()
  })

  it('display children when loading', () => {
    this.searchkit.loading = true
    this.wrapper.instance().forceUpdate()
    expect(this.wrapper).toMatchSnapshot()
  })
})
