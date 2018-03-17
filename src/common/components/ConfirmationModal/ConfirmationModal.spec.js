import React from 'react'
import { shallow } from 'enzyme'
import { DialogTitle } from 'material-ui/Dialog'

import ConfirmationModal from './ConfirmationModal'

describe('ConfirmationModal', () => {
  it('renders component', () => {
    const wrapper = shallow(
      <ConfirmationModal title="Title" open onClose={jest.fn()} onConfirm={jest.fn()} />,
    )
    expect(wrapper.getElement()).toMatchSnapshot()
    expect(wrapper.props()).toMatchSnapshot()
    expect(wrapper.find(DialogTitle).props().children).toEqual('Title')
  })

  it('default title', () => {
    const wrapper = shallow(
      <ConfirmationModal title="Title" open onClose={jest.fn()} onConfirm={jest.fn()} />,
    )
    expect(wrapper.find(DialogTitle).props().children).toEqual('Title')
    const wrapper2 = shallow(<ConfirmationModal open onClose={jest.fn()} onConfirm={jest.fn()} />)
    expect(wrapper2.find(DialogTitle).props().children).toEqual('Confirm')
  })
})
