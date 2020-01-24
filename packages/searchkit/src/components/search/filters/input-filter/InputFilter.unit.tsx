import * as React from 'react'
import { mount } from 'enzyme'
import * as sinon from 'sinon'
import { SearchkitManager, QueryString, QueryAccessor } from '../../../../core'

import { Panel } from '../../../ui'
import { InputFilter } from './InputFilter'

describe('InputFilter tests', () => {
  beforeEach(() => {
    this.searchkit = SearchkitManager.mock()
    spyOn(this.searchkit, 'performSearch')

    this.searchkit.translateFunction = (key) =>
      ({
        'searchbox.placeholder': 'search placeholder',
        'searchbox.button': 'submit'
      }[key])

    this.createWrapper = (
      searchOnChange = false,
      queryFields = null,
      prefixQueryFields = null,
      otherProps = {}
    ) => {
      this.wrapper = mount(
        <InputFilter
          searchkit={this.searchkit}
          id="test_id"
          title="Test title"
          searchOnChange={searchOnChange}
          queryFields={queryFields}
          prefixQueryFields={prefixQueryFields}
          {...otherProps}
        />
      )
      this.accessor = this.searchkit.getAccessorByType(QueryAccessor)
    }

    this.setResults = () => {
      this.searchkit.setResults({
        hits: {
          hits: [
            { _id: 1, title: 1 },
            { _id: 2, title: 2 }
          ],
          total: 2
        }
      })
    }

    this.setEmptyResults = () => {
      this.searchkit.setResults({
        hits: {
          total: 0
        }
      })
    }

    this.typeSearch = (value) => {
      this.wrapper.find('.sk-input-filter__text').simulate('change', { target: { value } })
    }
  })

  it('render', () => {
    this.createWrapper()
    expect(this.wrapper).toMatchSnapshot()
  })

  it('toggles visibility', () => {
    const spy = sinon.spy()
    this.searchkit.performSearch = spy
    this.createWrapper(true)

    this.setEmptyResults()
    this.wrapper = this.wrapper.update()
    expect(this.wrapper.find('.sk-panel').hasClass('is-disabled')).toBe(true)

    this.setResults()
    this.wrapper = this.wrapper.update()
    expect(this.wrapper.find('.sk-panel').hasClass('is-disabled')).toBe(false)

    // Don't hide if active filter
    this.typeSearch('noresults')
    this.setEmptyResults()
    expect(this.wrapper.find('.sk-panel').hasClass('is-disabled')).toBe(false)
  })

  it('should allow custom mod and className', () => {
    this.createWrapper(false, null, null, {
      mod: 'my-input',
      className: 'my-class'
    })
    this.setResults()
    expect(this.wrapper).toMatchSnapshot()
  })

  it('search on change', () => {
    const spy = sinon.spy()
    this.searchkit.performSearch = spy
    this.createWrapper(true)
    this.typeSearch('m')
    expect(this.accessor.state.getValue()).toBe('m')
    expect(spy.callCount).toBe(1)
    this.typeSearch('ma')
    expect(this.accessor.state.getValue()).toBe('ma')
    expect(spy.callCount).toBe(1) // throttling should block it
    this.wrapper.instance().throttledSearch.flush()
    expect(spy.callCount).toBe(2)
  })

  it('search on change with clock', () => {
    const queries = []
    this.searchkit.performSearch = () => {
      queries.push(this.searchkit.buildQuery())
    }
    this.createWrapper(true)
    expect(this.wrapper.instance().props.searchThrottleTime).toBe(200)
    this.typeSearch('m')
    this.wrapper.instance().throttledSearch.flush()
    expect(queries).toHaveLength(1)
    expect(queries[0].getSelectedFilters()[0].value).toBe('m')
    this.typeSearch('ma')
    expect(queries).toHaveLength(1)
    this.wrapper.instance().throttledSearch.flush()
    expect(queries).toHaveLength(2)
    expect(queries[1].getSelectedFilters()[0].value).toBe('ma')
  })

  it('search on submit', () => {
    const spy = sinon.spy()
    this.searchkit.performSearch = spy

    this.createWrapper(false)
    this.typeSearch('m')
    this.typeSearch('ma')
    // State left in the component
    expect(this.accessor.state.getValue()).toBe(null)
    expect(spy.callCount).toBe(0)
    this.wrapper.find('form').simulate('submit')
    expect(this.accessor.state.getValue()).toBe('ma')
    expect(spy.callCount).toBe(1)
  })

  it('should have a working remove icon', () => {
    const spy = sinon.spy()
    this.searchkit.performSearch = spy

    this.createWrapper(false)
    this.setResults()

    expect(this.wrapper.find('.sk-input-filter__remove').hasClass('is-hidden')).toBe(true)
    this.typeSearch('ma')
    expect(this.wrapper.find('.sk-input-filter__remove').hasClass('is-hidden')).toBe(false)
    expect(spy.callCount).toBe(0)
    this.wrapper.find('form').simulate('submit')
    expect(spy.callCount).toBe(1)
    this.wrapper.find('.sk-input-filter__remove').simulate('click')
    expect(this.accessor.state.getValue()).toBe(null)
    expect(spy.callCount).toBe(2)
    expect(this.wrapper.find('.sk-input-filter__remove').hasClass('is-hidden')).toBe(true)
  })

  it('should configure accessor defaults correctly', () => {
    this.createWrapper(false, ['title'])

    expect(this.accessor.key).toBe('test_id')
    const options = this.accessor.options
    expect(options).toEqual({
      title: 'Test title',
      addToFilters: true,
      queryFields: ['title'],
      prefixQueryFields: null,
      queryOptions: {},
      prefixQueryOptions: {},
      queryBuilder: undefined,
      onQueryStateChange: jasmine.any(Function)
    })
  })

  it('should configure accessor search on change correctly', () => {
    this.createWrapper(true, ['title'])

    expect(this.accessor.key).toBe('test_id')
    const options = this.accessor.options
    expect(options).toEqual({
      title: 'Test title',
      addToFilters: true,
      prefixQueryFields: null,
      queryFields: ['title'],
      queryOptions: {},
      prefixQueryOptions: {},
      queryBuilder: undefined,
      onQueryStateChange: jasmine.any(Function)
    })
  })

  it('should configure accessor + prefix', () => {
    this.createWrapper(true, ['title'], ['prefix'], {
      queryOptions: { minimum_should_match: '60%' },
      prefixQueryOptions: { minimum_should_match: '70%' },
      queryBuilder: QueryString
    })

    expect(this.accessor.key).toBe('test_id')
    const options = this.accessor.options
    expect(options).toEqual({
      title: 'Test title',
      addToFilters: true,
      queryFields: ['title'],
      prefixQueryFields: ['prefix'],
      queryOptions: { minimum_should_match: '60%' },
      prefixQueryOptions: { minimum_should_match: '70%' },
      queryBuilder: QueryString,
      onQueryStateChange: jasmine.any(Function)
    })
  })

  it('should accept Panel elements as containerComponent', () => {
    this.createWrapper(true, ['title'], ['prefix'], {
      containerComponent: <Panel collapsable={true} />
    })
    expect(this.wrapper.find('.sk-panel__header').hasClass('is-collapsable')).toBe(true)
  })

  describe('url change + blurAction', () => {
    it('blurAction:restore', () => {
      this.createWrapper(false, ['title'], ['prefix'], {
        blurAction: 'restore'
      })
      this.typeSearch('la')
      expect(this.wrapper.instance().getValue()).toEqual('la')
      this.accessor.fromQueryObject({
        test_id: 'foo'
      })
      expect(this.wrapper.instance().getValue()).toEqual('foo')

      this.typeSearch('bar')
      expect(this.wrapper.instance().getValue()).toEqual('bar')
      this.wrapper.find('.sk-input-filter__text').simulate('blur')

      // should be restored to previous value
      expect(this.wrapper.instance().getValue()).toEqual('foo')
      expect(this.searchkit.performSearch).not.toHaveBeenCalled()
    })

    it('blurAction:search', () => {
      this.createWrapper(false, ['title'], ['prefix'], {
        blurAction: 'search'
      })
      this.typeSearch('la')
      expect(this.wrapper.instance().getValue()).toEqual('la')
      this.accessor.fromQueryObject({
        test_id: 'foo'
      })
      expect(this.wrapper.instance().getValue()).toEqual('foo')

      this.typeSearch('bar')
      expect(this.wrapper.instance().getValue()).toEqual('bar')
      this.wrapper.find('.sk-input-filter__text').simulate('blur')

      // should flush value + search
      expect(this.wrapper.instance().getValue()).toEqual('bar')
      expect(this.searchkit.performSearch).toHaveBeenCalled()
    })
  })
})
