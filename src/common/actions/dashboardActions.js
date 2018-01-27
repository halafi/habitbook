// action types
export const DASHBOARD_SELECT_USER = 'DASHBOARD_SELECT_USER'

// action creators
export const selectUser = uid => ({
  type: DASHBOARD_SELECT_USER,
  payload: uid,
})
