import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from './redux/store'
import Base from './views/Base'

ReactDOM.render(
  <Provider store={store}>
    <Base />
  </Provider>,
  document.getElementById('root'),
)
