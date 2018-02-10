import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'

import DateTimePicker from './DateTimePicker'
import { GOAL_DATE_TIME } from '../../consts/dateTimeConsts'

describe('DateTimePicker', () => {
  const dateNow = Date.now
  beforeEach(() => {
    Date.now = jest.fn(() => 1518110488752) // lock at "2018-02-08T18:21:45+01:00"
  })
  afterEach(() => {
    Date.now = dateNow
  })
  it('renders component', () => {
    const wrapper = shallow(
      <DateTimePicker
        id="test-picker"
        label="Date Time"
        value={moment()
          .subtract(5, 'd')
          .valueOf()}
        onChange={null}
      />,
    )
    expect(wrapper.getElement()).toMatchSnapshot()
    expect(wrapper.props()).toMatchSnapshot()
  })
  it('value change work', () => {
    const val1 = moment()
      .subtract(5, 'd')
      .valueOf()

    const val2 = moment()
      .add(5, 'd')
      .valueOf()

    let wrapper = shallow(
      <DateTimePicker id="test-picker" label="Date Time" value={val1} onChange={null} />,
    )
    expect(moment(wrapper.props().value).format(GOAL_DATE_TIME)).toEqual('2018-02-03T18:21')
    wrapper = shallow(
      <DateTimePicker id="test-picker" label="Date Time" value={val2} onChange={null} />,
    )
    expect(moment(wrapper.props().value).format(GOAL_DATE_TIME)).toEqual('2018-02-13T18:21')
  })
})
