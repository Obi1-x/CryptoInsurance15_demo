import { put } from 'redux-saga/effects';
import { delay } from 'redux-saga/effects';
import * as actions from '../actions/index';
/* * after a func turns it to a generator which are 
func that can be implemented incrementally they
can be pause also */

export function* logoutSaga(action) {
    /* yield means it will only run next line of code if the
    present line of code has been executed  */
    yield localStorage.removeItem('usersPrunedge');
    put({ type: action.AUTH_LOGOUT });
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime);
    yield put(actions.logout())

}

// using with redux saga to store data step3 
// though should be use when u want to execute a task before storing data to store
export function* clientDataSaga(action) {
    yield put({ type: actions.CLIENT_DATA, payload: action.data });
}

// redux saga for client account user type
// export function* clientAccountUserTypeSaga(action) {
//     yield put({ type: actions.CLIENT_ACCOUNT_USER_TYPE, payload: action.data });
// }


