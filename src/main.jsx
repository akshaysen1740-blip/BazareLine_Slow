import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import _ from 'lodash'
import moment from 'moment'
import 'moment/min/locales'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import './styles.css'

// so we can poke at things from the console
window._ = _
window.moment = moment
window.__ENV__ = import.meta.env

moment.locale('en-in')

// StrictMode removed: effects were running twice and doubling API calls
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>
)
