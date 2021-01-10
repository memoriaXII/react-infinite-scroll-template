import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import reducers from "./reducers"
import thunk from "redux-thunk"

ReactDOM.render(
  <Provider store={createStore(reducers, applyMiddleware(thunk))}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
)

serviceWorker.unregister()
