import reducer from './index'
import { selectUser } from './actions/dashboardActions'

describe('Root reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      selectedUser: null,
    })
  })

  it('should handle DASHBOARD_SELECT_USER', () => {
    const selectUserSomeIdAction = selectUser('someId')
    const deselectUserAction = selectUser(null)

    expect(reducer({}, selectUserSomeIdAction)).toEqual({
      selectedUser: 'someId',
    })
    expect(
      reducer(
        {
          selectedUser: 'oldId',
        },
        selectUserSomeIdAction,
      ),
    ).toEqual({
      selectedUser: 'someId',
    })
    // deselect user
    expect(
      reducer(
        {
          selectedUser: 'oldId',
        },
        deselectUserAction,
      ),
    ).toEqual({
      selectedUser: null,
    })
  })
})
