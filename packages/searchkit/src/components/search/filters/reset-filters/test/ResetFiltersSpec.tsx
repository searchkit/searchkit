import * as React from 'react'
import { mount } from 'enzyme'
import { ResetFilters } from '../src/ResetFilters'
import { SearchkitManager, ResetSearchAccessor } from '../../../../../core'
import { fastClick } from '../../../../__test__/TestHelpers'

describe('Reset Filter tests', () => {
  beforeEach(() => {
    this.searchkit = SearchkitManager.mock()
    this.options = { query: true, filter: true }
    this.createWrapper = () => {
      this.wrapper = mount(
        <ResetFilters
          searchkit={this.searchkit}
          translations={{ 'reset.clear_all': 'reset filters' }}
          options={this.options}
        />
      )
      this.accessor = this.searchkit.getAccessorsByType(ResetSearchAccessor)[0]
    }
  })

  it('should create accessor correctly', () => {
    this.createWrapper()
    expect(this.accessor).toBeTruthy()
    expect(this.accessor.options).toBe(this.options)
  })

  it('renders correctly', () => {
    this.searchkit.query.getSelectedFilters = () => []
    this.wrapper = this.wrapper.update()

    expect(this.wrapper).toMatchSnapshot('filter disabled')

    this.searchkit.query.getSelectedFilters = () => [1]
    this.createWrapper()
    expect(this.wrapper).toMatchSnapshot('filter enabled')
  })

  it('handles reset click', () => {
    this.searchkit.query.getSelectedFilters = () => [1]
    this.createWrapper()
    spyOn(this.accessor, 'performReset')
    spyOn(this.searchkit, 'performSearch')
    const elem = this.wrapper.find('.sk-reset-filters')
    expect(this.accessor.performReset).not.toHaveBeenCalled()
    expect(this.searchkit.performSearch).not.toHaveBeenCalled()
    fastClick(elem)
    expect(this.accessor.performReset).toHaveBeenCalled()
    expect(this.searchkit.performSearch).toHaveBeenCalled()
  })
})
