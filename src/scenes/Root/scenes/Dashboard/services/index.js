// @flow

import { DASHBOARD_SELECT_USER } from './actions/dashboardActions'

export type State = {
  selectedUser: ?string, // uid
}

const initialState = {
  selectedUser: null, // user to view
}

export default function(state: State = initialState, action: Object) {
  if (!action.type) {
    return state
  }

  switch (action.type) {
    case DASHBOARD_SELECT_USER:
      return {
        ...state,
        selectedUser: action.payload,
      }
    default:
      return state
  }
}
