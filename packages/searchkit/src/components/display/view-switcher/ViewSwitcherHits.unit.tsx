import * as React from 'react'
import { mount } from 'enzyme'
import * as _ from 'lodash'
import { fastClick } from '../../__test__/TestHelpers'
import { SearchkitManager } from '../../../core'
import { Select } from '../../ui/list'
import { ViewSwitcherToggle } from './ViewSwitcherToggle'
import { ViewSwitcherHits } from './ViewSwitcherHits'
import { ViewSwitcherConfig } from './ViewSwitcherConfig'

const MovieHitsGridItem = (props) => <div className="grid-item">{props.result.title}</div>

const MovieHitsListItem = (props) => <div className="list-item">{props.result.title}</div>

const MovieList = (props) => <div className="custom-list">{_.map(props.hits, '_id').join(',')}</div>

describe('View Switcher Hits component', () => {
  describe('renders correctly', () => {
    beforeEach(() => {
      this.searchkit = SearchkitManager.mock()

      this.searchkit.setResults({
        hits: {
          hits: [
            { _id: 1, title: 1 },
            { _id: 2, title: 2 }
          ],
          total: 2
        }
      })
      this.setWrapper = (props = {}) => {
        this.wrapper = mount(
          <div>
            <ViewSwitcherHits
              searchkit={this.searchkit}
              hitComponents={[
                {
                  key: 'grid',
                  title: 'Grid',
                  itemComponent: MovieHitsGridItem,
                  defaultOption: true
                },
                { key: 'list', title: 'List', itemComponent: MovieHitsListItem },
                { key: 'custom-list', title: 'Custom List', listComponent: MovieList }
              ]}
              highlightFields={['title']}
              hitsPerPage={12}
              sourceFilter={['title']}
            />
            <ViewSwitcherToggle
              searchkit={this.searchkit}
              translations={{ Grid: 'My Grid' }}
              {...props}
            />
          </div>
        )
      }

      this.ViewOptionsAccessor = this.searchkit.accessors.accessors[0]
    })

    it('View Switcher Hits', () => {
      this.setWrapper()
      expect(this.wrapper).toMatchSnapshot()

      fastClick(this.wrapper.find('.sk-toggle-option').at(1))
      this.wrapper.update()

      expect(this.wrapper).toMatchSnapshot()

      fastClick(this.wrapper.find('.sk-toggle-option').at(2))

      expect(this.wrapper).toMatchSnapshot()
    })

    it('custom mod, className, listComponent', () => {
      this.setWrapper({
        mod: 'my-view-switcher',
        className: 'customClass',
        listComponent: Select
      })

      expect(this.wrapper).toMatchSnapshot()
    })

    it('Works with ViewSwitcherConfig', () => {
      this.wrapper = mount(
        <div>
          <ViewSwitcherConfig
            searchkit={this.searchkit}
            hitComponents={[
              { key: 'grid', title: 'Grid', itemComponent: MovieHitsGridItem, defaultOption: true },
              { key: 'list', title: 'List', itemComponent: MovieHitsListItem },
              { key: 'custom-list', title: 'Custom List', listComponent: MovieList }
            ]}
          />
          <ViewSwitcherHits
            searchkit={this.searchkit}
            highlightFields={['title']}
            hitsPerPage={12}
            sourceFilter={['title']}
          />
          <ViewSwitcherToggle searchkit={this.searchkit} translations={{ Grid: 'My Grid' }} />
        </div>
      )

      expect(this.wrapper).toMatchSnapshot()
      fastClick(this.wrapper.find("div[data-key='list']"))
      expect(this.wrapper.find("div[data-key='list']").hasClass('is-active')).toBe(true)
      expect(this.wrapper).toMatchSnapshot()
    })

    it('renders null when no accessor available', () => {
      this.wrapper = mount(
        <div>
          <ViewSwitcherToggle searchkit={this.searchkit} translations={{ Grid: 'My Grid' }} />
        </div>
      )
      expect(this.wrapper).toMatchSnapshot()
    })
  })
})
