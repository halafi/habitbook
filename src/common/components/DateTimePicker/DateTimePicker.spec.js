import React from 'react'
import { shallow, render } from 'enzyme'

import DateTimePicker from './DateTimePicker'

describe('<DateTimePicker />', () => {
  it('renders <DateTimePicker /> component', () => {
    const wrapper = shallow(<DateTimePicker />)
    expect(wrapper.getElement()).toMatchSnapshot()
  })
})
