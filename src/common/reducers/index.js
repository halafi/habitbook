// @flow

import { combineReducers } from 'redux'
import { firebaseReducer } from 'react-redux-firebase'
import dashboardReducer from '../../scenes/Root/scenes/Dashboard/services'

import type { State as DashboardState } from '../../scenes/Root/scenes/Dashboard/services'
import type { Firebase } from '../records/Firebase/Firebase'

export type GlobalState = {
  firebase: Firebase,
  dashboard: DashboardState,
}

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  dashboard: dashboardReducer,
})

export default rootReducer
