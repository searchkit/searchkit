import * as React from 'react'
import { mount } from 'enzyme'
import * as _ from 'lodash'
import { fastClick } from '../../../__test__/TestHelpers'
import { SearchkitManager, Utils, FacetAccessor } from '../../../../core'
import { Toggle, ItemComponent } from '../../../ui'
import { FacetFilter } from './FacetFilter'
import { RefinementListFilter } from './RefinementListFilter'

describe('Facet Filter tests', () => {
  this.createWrapper = (component) => {
    this.wrapper = mount(component)

    this.searchkit.setResults({
      aggregations: {
        testId1: {
          test: {
            buckets: [
              { key: 'test option 1', doc_count: 1 },
              { key: 'test option 2', doc_count: 2 },
              { key: 'test option 3', doc_count: 3 }
            ]
          },
          test_count: {
            value: 4
          }
        }
      }
    })

    this.accessor = this.searchkit.getAccessorByType(FacetAccessor)
  }

  beforeEach(() => {
    Utils.guidCounter = 0

    this.searchkit = SearchkitManager.mock()
    this.searchkit.translateFunction = (key) =>
      ({
        'test option 1': 'test option 1 translated'
      }[key])

    this.mountComponent = () => {
      this.createWrapper(
        <FacetFilter
          field="test"
          id="testId"
          title="test title"
          size={3}
          countFormatter={(count) => '#' + count}
          include="title"
          exclude={['bad', 'n/a']}
          operator="OR"
          orderKey="_count"
          orderDirection="desc"
          translations={{ 'facets.view_all': 'View all facets' }}
          searchkit={this.searchkit}
          bucketsTransform={_.identity}
        />
      )
    }
    this.mountComponent()

    this.getViewMore = () => this.wrapper.find('.sk-refinement-list__view-more-action')
  })

  it('renders correctly', () => {
    expect(this.wrapper).toMatchSnapshot()
  })

  it('clicks options', () => {
    this.wrapper.update()
    const option = this.wrapper
      .find('.sk-item-list')
      .children()
      .at(0)
    const option2 = this.wrapper
      .find('.sk-item-list')
      .children()
      .at(1)
    fastClick(option)
    fastClick(option2)
    expect(this.wrapper).toMatchSnapshot()
    expect(this.accessor.state.getValue()).toEqual(['test option 1', 'test option 2'])
    fastClick(option2)
    expect(this.wrapper).toMatchSnapshot()
    expect(this.accessor.state.getValue()).toEqual(['test option 1'])
  })

  it('show more options', () => {
    const option = { label: 'view more', size: 20 }
    this.accessor.getMoreSizeOption = jest.fn(() => option)
    this.accessor.setViewMoreOption = jest.fn()
    this.mountComponent()
    const viewMore = this.getViewMore()
    expect(viewMore.text()).toBe('view more')
    fastClick(viewMore)
    this.wrapper.update()
    expect(this.accessor.setViewMoreOption).toBeCalledWith(option)
  })

  it('show no options', () => {
    this.accessor.getMoreSizeOption = () => null
    this.mountComponent()
    expect(this.getViewMore()).toHaveLength(0)
  })

  it('should configure accessor correctly', () => {
    expect(this.accessor.key).toBe('testId')
    const options = this.accessor.options

    expect(options).toEqual(
      jasmine.objectContaining({
        id: 'testId',
        field: 'test',
        title: 'test title',
        size: 3,
        facetsPerPage: 50,
        operator: 'OR',
        translations: { 'facets.view_all': 'View all facets' },
        orderKey: '_count',
        orderDirection: 'desc',
        include: 'title',
        exclude: ['bad', 'n/a'],
        fieldOptions: {
          type: 'embedded',
          field: 'test'
        }
      })
    )
  })

  it('should work with a custom itemComponent', () => {
    this.createWrapper(
      <FacetFilter
        itemComponent={({ label, count }) => (
          <div className="option">
            {label} ({count})
          </div>
        )}
        field="test"
        id="testId"
        title="test title"
        searchkit={this.searchkit}
      />
    )
    expect(this.wrapper.find('.sk-panel__header').text()).toBe('test title')
    expect(this.wrapper.find('.option').map((e) => e.text())).toEqual([
      'test option 1 translated (1)',
      'test option 2 (2)',
      'test option 3 (3)'
    ])
  })

  it('operator can be updated', () => {
    spyOn(this.searchkit, 'performSearch')
    this.wrapper.setProps({ operator: 'AND' })
    expect(this.accessor.options.operator).toBe('AND')
    expect(this.searchkit.performSearch).toHaveBeenCalled()
  })

  it('setFilters', () => {
    spyOn(this.searchkit, 'performSearch')
    this.wrapper.instance().setFilters(['foo'])
    expect(this.accessor.state.getValue()).toEqual(['foo'])
    expect(this.searchkit.performSearch).toHaveBeenCalled()
  })

  it('should work with custom components', () => {
    const container = (props) => <div {...props}>{props.children}</div>

    this.createWrapper(
      <RefinementListFilter
        containerComponent={container}
        listComponent={Toggle}
        itemComponent={(props) => <ItemComponent {...props} showCount={true} />}
        field="test"
        id="testId"
        title="test title"
        bucketsTransform={(buckets) => _.reverse(buckets)}
        searchkit={this.searchkit}
      />
    )
    expect(this.wrapper).toMatchSnapshot()
  })
})
