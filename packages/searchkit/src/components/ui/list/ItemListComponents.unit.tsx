import * as React from 'react'
import { mount } from 'enzyme'
import { fastClick } from '../../__test__/TestHelpers'
import { ItemList, CheckboxItemList } from './ItemListComponents'

import { ItemComponent, CheckboxItemComponent } from './ItemComponents'

import { MockList } from './MockList'

describe('ItemList Components', () => {
  it('ItemList should render and behave correctly', () => {
    this.wrapper = mount(<MockList listComponent={ItemList} />)
    expect(this.wrapper).toMatchSnapshot()

    this.wrapper.setProps({ disabled: true })
    expect(this.wrapper.find('.sk-item-list').hasClass('is-disabled')).toBe(true)
    expect(this.wrapper.find('.sk-item-list-option__count')).toHaveLength(4)
    this.wrapper.setProps({ showCount: false })
    expect(this.wrapper.find('.sk-item-list-option__count')).toHaveLength(0)

    expect(this.wrapper.find("input[type='checkbox']")).toHaveLength(0)
    this.wrapper.setProps({ itemComponent: CheckboxItemComponent })
    expect(this.wrapper.find("input[type='checkbox']")).toHaveLength(4)

    this.wrapper.setProps({ mod: 'my-item-list' })
    expect(this.wrapper.find('.my-item-list')).toHaveLength(1)

    expect(this.wrapper.instance().state.toggleItem).not.toHaveBeenCalled()
    fastClick(this.wrapper.find('.my-item-list-option').at(2))
    expect(this.wrapper.instance().state.toggleItem).toHaveBeenCalledWith('c')
  })

  it('check default props are set correctly', () => {
    expect(CheckboxItemList.defaultProps.itemComponent).toBe(CheckboxItemComponent)
    expect(ItemList.defaultProps.itemComponent).toBe(ItemComponent)
  })

  it('mod + classname can be updated', () => {
    this.wrapper = mount(
      <MockList listComponent={ItemList} mod="sk-item-list-updated" className="my-custom-class" />
    )

    expect(this.wrapper.find('.sk-item-list-updated').hasClass('my-custom-class')).toBe(true)
  })
})
