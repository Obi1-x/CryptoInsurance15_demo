import { createStore, applyMiddleware, compose } from 'redux';
// is use for redux middleware implementation 
import reduxThunk from 'redux-thunk';
import reducer from './store/reducer/reducer.js';

export const middlewares = [reduxThunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const createStoreWithMiddleware = composeEnhancers(applyMiddleware(...middlewares))(createStore);
export const store = createStoreWithMiddleware(reducer);
