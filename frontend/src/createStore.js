import { createStore, applyMiddleware, compose } from 'redux';
// is use for redux middleware implementation 
import reduxThunk from 'redux-thunk';
import reducer from './store/reducers/reducer.js';
import createSagaMiddleware from 'redux-saga';
import { watchAuth } from './store/sagas'

export const middlewares = [reduxThunk];

export const sagaMiddleware = createSagaMiddleware();

// export const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
// export const store = createStoreWithMiddleware(reducer);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const createStoreWithMiddleware = composeEnhancers(applyMiddleware(...middlewares, sagaMiddleware))(createStore);
export const activateSaga = () => sagaMiddleware.run(watchAuth);
export const store = createStoreWithMiddleware(reducer);

// export const store = (): any => {
//     const Store = createStore(
//         reducer,
//         applyMiddleware(reduxThunk)
//     );
//     // use the same saga middleware that you have enhanced your store with
//     sagaMiddleware.run(logoutSaga);
//     return Store;
// }
