import * as actionTypes from './actionTypes';
import { toast } from 'react-toastify';

// export const storeUserDB = (body) => async (dispatch) => {
//     try {
//         const response = await userService.create(body.data);
//         storeIdOfForm = 1;
//         if (response.data) {
//             dispatch({ type: actionTypes.EMPLOYEE_STATE_CH, payload: { forwardRoute: true, prevRoute: false } });
//             dispatch({ type: actionTypes.BACK_VIEW, payload: { state: false, data: 'no data' } });
//             dispatch({ type: actionTypes.USER_DATA_DB, payload: response.data.data });
//             dispatch({ type: actionTypes.AUTH_INITIATE_CLIENT_DATA, data: { ...body.localStore, auth_user: response.headers['x-auth-user'] } });
//             const userData = { data: response.data.data, auth_user: response.headers['x-auth-user'] }
//             localStore.storeItemObject({ ...body.localStore, userData }, "intent");
//             toast.success("data save, proceed");
//         }

//     } catch (error) {
//         console.log(error);
//         if (error.response && error.response.status === 409) {
//             toast.error(error.response.data.error.message);
//             setTimeout(() => {
//                 window.location = '/';
//             }, 4000);
//             // getFormStartingID()
//         }

//     }
// }


export const logStatus = (data) => {
    return { type: actionTypes.LOGIN_USER, payload: data }
}



