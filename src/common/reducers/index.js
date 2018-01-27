import { combineReducers } from 'redux'
import { firebaseReducer } from 'react-redux-firebase'
import dashboardReducer from './dashboardReducer'

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  dashboard: dashboardReducer,
})

export default rootReducer
