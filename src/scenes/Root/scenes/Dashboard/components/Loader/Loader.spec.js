import React from 'react'
import { shallow } from 'enzyme'

import Loader from './Loader'

describe('Loader', () => {
  it('renders component', () => {
    const wrapper = shallow(<Loader />)
    expect(wrapper.getElement()).toMatchSnapshot()
  })
})
