import { selectedUserIdSelector } from './dashboardSelectors'

describe('Dashboard selectors', () => {
  it('#selectedUserIdSelector', () => {
    const state = {
      dashboard: {
        selectedUser: 'someId',
      },
    }
    expect(selectedUserIdSelector(state)).toEqual('someId')
  })
})
