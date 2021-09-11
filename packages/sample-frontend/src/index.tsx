import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { GlobalStyles } from './components/GlobalStyles'

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
  </React.StrictMode>,
  document.getElementById('app')
)

if (undefined /* [snowpack] import.meta.hot */) {
  // @ts-ignore: Object is possibly 'null'.
  undefined /* [snowpack] import.meta.hot */
    .accept()
}
