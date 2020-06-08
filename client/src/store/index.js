import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducer'




const canUseDom = !(typeof window === 'undefined')

const inititalState = {};

// ======================================================
  // Middleware Configuration
// ======================================================
const middleware = [thunk]

// ======================================================
  // Store Enhancers
// ======================================================
const enhancers = []

let composeEnhancers = compose

if ((process.env.NODE_ENV === 'development') && canUseDom) {
  const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  if (typeof composeWithDevToolsExtension === 'function') {
    composeEnhancers = composeWithDevToolsExtension
  }
}

const store = createStore(
  reducer,
  inititalState,
  applyMiddleware(thunk)

)

export default store;
