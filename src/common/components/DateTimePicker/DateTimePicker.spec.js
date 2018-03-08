import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'

import DateTimePicker from './DateTimePicker'

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
    expect(
      wrapper
        .children()
        .first()
        .props().value,
    ).toEqual('2018-02-03')
    expect(
      wrapper
        .children()
        .last()
        .props().value,
    ).toEqual('18:21')
    wrapper = shallow(
      <DateTimePicker id="test-picker" label="Date Time" value={val2} onChange={null} />,
    )
    expect(
      wrapper
        .children()
        .first()
        .props().value,
    ).toEqual('2018-02-13')
    expect(
      wrapper
        .children()
        .last()
        .props().value,
    ).toEqual('18:21')
  })

  it('works with minValue', () => {
    // TODO
  })
})
