/* eslint-disable import/first */
// Webpack hot module replacement
module.hot?.accept()

import React from 'react'
import ReactDOM from 'react-dom'
import { Helmet } from 'react-helmet'
import { BrowserRouter } from 'react-router-dom'

import { App } from './App'

ReactDOM.render(
  <BrowserRouter>
    <Helmet>
      <title>Bryce Wilson</title>
    </Helmet>
      <App />
  </BrowserRouter>
  ,
  document.getElementById('root')
)
