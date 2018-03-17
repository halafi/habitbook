import React from 'react'
import { shallow } from 'enzyme'

import Welcome from './Welcome'

describe('Welcome', () => {
  it('renders component', () => {
    const wrapper = shallow(<Welcome />)
    expect(wrapper.getElement()).toMatchSnapshot()
    expect(wrapper.props()).toMatchSnapshot()
    expect(wrapper.props()).toEqual({
      classes: { card: 'Welcome-card-1', media: 'Welcome-media-2' },
    })
  })
})
