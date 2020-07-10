import * as React from 'react'
import { mount } from 'enzyme'
import { NumericRefinementListFilter } from '../src/NumericRefinementListFilter'
import { fastClick } from '../../../../__test__/TestHelpers'
import { SearchkitManager, Utils, NumericOptionsAccessor } from '../../../../../core'
import { Select } from '../../../../ui'

describe('NumericRefinementListFilter tests', () => {
  beforeEach(() => {
    Utils.guidCounter = 0
    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, 'performSearch')
    this.setWrapper = (props = {}) => {
      this.wrapper = mount(
        <NumericRefinementListFilter
          {...props}
          searchkit={this.searchkit}
          id="score"
          title="Score"
          field="score"
          options={[
            { title: 'All', key: 'everything' },
            { title: 'up to 20', from: 0, to: 21 },
            { title: '21 to 40', from: 21, to: 41 }
          ]}
        />
      )
      this.accessor = this.searchkit.getAccessorByType(NumericOptionsAccessor)
    }
    this.setResults = () => {
      this.searchkit.setResults({
        aggregations: {
          score1: {
            score: {
              buckets: [
                { key: 'All', doc_count: 30 },
                { key: 'up to 20', doc_count: 10 },
                { key: '21 to 40', doc_count: 20 }
              ]
            }
          }
        }
      })
    }

    this.getOptionAt = (index) => this.wrapper.find('.sk-item-list-option').at(index)
  })

  it('should set accessor options correctly', () => {
    this.setWrapper()
    expect(this.accessor.key).toBe('score')
    expect(this.accessor.options).toEqual({
      id: 'score',
      field: 'score',
      title: 'Score',
      options: [
        { title: 'All', key: 'everything' },
        { title: 'up to 20', from: 0, to: 21, key: '0_21' },
        { title: '21 to 40', from: 21, to: 41, key: '21_41' }
      ],
      multiselect: false,
      fieldOptions: {
        type: 'embedded',
        field: 'score'
      }
    })
  })

  it('should render correctly()', () => {
    this.setWrapper()
    this.setResults()
    expect(this.wrapper).toMatchSnapshot()
  })

  it('should select correctly', () => {
    this.setWrapper()
    this.accessor.state = this.accessor.state.setValue(['21_41'])
    this.setResults()
    this.wrapper = this.wrapper.update()
    const lastOption = this.getOptionAt(2)
    expect(lastOption.hasClass('is-active')).toBe(true)
  })

  it('should handle clicking an option', () => {
    this.setWrapper()
    this.setResults()
    this.wrapper = this.wrapper.update()
    const secondOption = this.getOptionAt(1)
    const thirdOption = this.getOptionAt(2)
    fastClick(secondOption)
    expect(this.accessor.state.getValue()).toEqual(['0_21'])
    expect(this.searchkit.performSearch).toHaveBeenCalled()
    this.accessor.options.multiselect = true
    fastClick(thirdOption)
    this.accessor.options.multiselect = false
    fastClick(secondOption)
    fastClick(thirdOption)
    expect(this.accessor.state.getValue()).toEqual(['21_41'])
  })

  it('should deselect already selected option for single select', () => {
    this.setWrapper()
    this.setResults()
    this.wrapper = this.wrapper.update()
    const secondOption = this.getOptionAt(1)
    this.accessor.options.multiselect = false
    fastClick(secondOption)
    expect(this.accessor.state.getValue()).toEqual(['0_21'])
    expect(this.searchkit.performSearch).toHaveBeenCalled()
    fastClick(secondOption)
    expect(this.accessor.state.getValue()).toEqual([])
    expect(this.searchkit.performSearch).toHaveBeenCalled()
  })

  it('should be disabled for empty buckets', () => {
    this.setWrapper()
    expect(this.wrapper.find('.sk-panel.is-disabled')).toHaveLength(1)
  })

  it('should allow custom mod, className, listComponent, translations', () => {
    this.setWrapper({
      mod: 'my-numeric',
      className: 'my-class',
      listComponent: Select,
      translations: { All: 'Everything' },
      countFormatter: (count) => '#' + count
    })
    this.setResults()
    expect(this.wrapper).toMatchSnapshot()
  })
})
