import * as React from 'react'
import { mount } from 'enzyme'
import { SearchkitManager } from '../../../../core'

import { InitialLoader } from '../src/InitialLoader'

describe('InitialLoader', () => {
  beforeEach(() => {
    this.searchkit = SearchkitManager.mock()
    this.wrapper = mount(<InitialLoader searchkit={this.searchkit} />)
  })

  it('should render correctly', () => {
    expect(this.wrapper).toMatchSnapshot('initial loading')
    this.searchkit.initialLoading = false
    this.wrapper = mount(<InitialLoader searchkit={this.searchkit} />)
    expect(this.wrapper).toMatchSnapshot('no initial loader')
  })

  it('should render a custom component', () => {
    const higherOrderComp = ({ bemBlocks }) => <p className={bemBlocks.container('foo')}>Loading</p>
    const wrapper = mount(<InitialLoader searchkit={this.searchkit} component={higherOrderComp} />)
    expect(wrapper).toMatchSnapshot()
  })
})
