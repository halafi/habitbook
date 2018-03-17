// @flow

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import Reboot from 'material-ui/Reboot'

import Root from './scenes/Root/Root'
import configureStore from './configureStore'

const store = configureStore()
const theme = createMuiTheme()

const registerServiceWorker = false || process.env.NODE_ENV === 'production'

if (registerServiceWorker && 'serviceWorker' in navigator) {
  // $FlowFixMe
  navigator.serviceWorker.register('service-worker.js')
}

const container = document.getElementById('container')

if (container) {
  render(
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <Reboot />
        <Root />
      </MuiThemeProvider>
    </Provider>,
    container,
  )
}
