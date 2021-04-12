import { takeEvery } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes'
import { logoutSaga, checkAuthTimeoutSaga, clientDataSaga } from './auth.js';

export function* watchAuth() {
    yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga);
    yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga);
    // using with redux saga to store data step4 
    // though should be use when u want to execute a task before storing data to store
    yield takeEvery(actionTypes.AUTH_INITIATE_CLIENT_DATA, clientDataSaga);


}