import * as React from 'react'

import { mount } from 'enzyme'
import { SearchkitProvider, SearchkitManager, SearchkitComponent } from '../../../'

describe('SearchkitProvider', () => {
  beforeEach(() => {
    this.searchkit = SearchkitManager.mock()
    class SomeComponent extends SearchkitComponent<any, any> {
      render() {
        return <h1>Hello</h1>
      }
    }
    this.wrapper = mount(
      <SearchkitProvider searchkit={this.searchkit}>
        <SomeComponent />
      </SearchkitProvider>
    )
  })

  it('searchkit provider should work correctly', () => {
    expect(this.wrapper.html()).toBe('<h1>Hello</h1>')
    expect(this.wrapper.instance().props.searchkit).toBe(this.searchkit)
  })

  it('should call setupListeners()', () => {
    spyOn(this.searchkit, 'setupListeners')
    expect(this.searchkit.setupListeners).not.toHaveBeenCalled()
    this.wrapper.instance().componentDidMount()
    expect(this.searchkit.setupListeners).toHaveBeenCalled()
    this.searchkit.guidGenerator.counter = 10
    this.searchkit.unlistenHistory = jasmine.createSpy('unlisten')
    this.wrapper.instance().componentWillUnmount()
    expect(this.searchkit.unlistenHistory).toHaveBeenCalled()
    expect(this.searchkit.guidGenerator.counter).toEqual(0)
  })
})
