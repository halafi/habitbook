import firebase from 'firebase'
import { createStore, applyMiddleware, compose } from 'redux'
import { reactReduxFirebase } from 'react-redux-firebase'
import { createLogger } from 'redux-logger'

import rootReducer from './common/reducers/index'

export default function configureStore() {
  const firebaseConfig = {
    apiKey: 'AIzaSyC9NtgdC1_pocsh97na5u82WNnsZpvE3lw',
    authDomain: 'concerning-habits.firebaseapp.com',
    databaseURL: 'https://concerning-habits.firebaseio.com',
    projectId: 'concerning-habits',
    storageBucket: 'concerning-habits.appspot.com',
    messagingSenderId: '988346533806',
  }

  // http://react-redux-firebase.com/docs/recipes/profile.html
  const rrfConfig = {
    // react-redux-firebase config
    userProfile: 'users', // where profiles are stored in database
    // presence: 'presence', // where list of online users is stored in database
    // sessions: 'sessions',
  }

  // initialize firebase instance
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // eslint-disable-line no-underscore-dangle

  if (process.env.NODE_ENV === 'production') {
    const createStoreWithFirebase = composeEnhancers(reactReduxFirebase(firebase, rrfConfig))(
      createStore,
    )
    return createStoreWithFirebase(rootReducer)
  }

  // development
  const logger = createLogger({
    collapsed: true,
    diff: true,
  })
  const createStoreWithFirebase = composeEnhancers(
    reactReduxFirebase(firebase, rrfConfig),
    applyMiddleware(logger),
  )(createStore)

  return createStoreWithFirebase(rootReducer)
}
