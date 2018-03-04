import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import Reboot from 'material-ui/Reboot'

import Root from './scenes/Root/Root'
import configureStore from './common/services/configureStore'

const store = configureStore()
const theme = createMuiTheme()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
}

render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <Reboot />
      <Root />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('container'),
)
