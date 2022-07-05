import * as React from 'react'
import * as ReactDOM from 'react-dom'

import "skeleton-css/css/skeleton.css"
import "./css/index.scss";

// redux
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from "redux-thunk"
import reducers from './reducers'

// routing
import createHistory from 'history/createHashHistory'
import { Route, Redirect } from 'react-router'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

// logger
import logger from 'redux-logger'

//Components
import MainContainer from "./components/containers/MainContainer"

//Models
import { AppState } from "./models/state"

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const routermiddleware = routerMiddleware(history)

// init store
// const defaultState: AppState = {
//   approval: {designs:[] },
//   catalog: {dummy: ""}
// }

const store = createStore<AppState>(
  combineReducers<AppState>({
    ...reducers,
    router: routerReducer
  }),
  //defaultState,
  applyMiddleware(thunk, routermiddleware, logger)
)

ReactDOM.render(
  <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */}
    <ConnectedRouter history={history}>
        <Route path="/" component={MainContainer}/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
)