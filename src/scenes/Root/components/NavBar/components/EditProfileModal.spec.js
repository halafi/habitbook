import React from 'react'
import { shallow } from 'enzyme'

import EditProfileModal from './EditProfileModal'

describe('EditProfileModal', () => {
  it('renders component', () => {
    const wrapper = shallow(
      <EditProfileModal
        firebase={{ updateProfile: jest.fn() }}
        open
        onClose={jest.fn()}
        profile={{ userName: 'foo', displayName: 'bar' }}
      />,
    )
    expect(wrapper.getElement()).toMatchSnapshot()
    expect(wrapper.props()).toMatchSnapshot()
  })
})
