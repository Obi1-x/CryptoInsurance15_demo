import * as actionTypes from './actionTypes';
import { toast } from 'react-toastify';
import UserService from '../../service/UserService';
import EmploymentTypeService from '../../service/EmploymentTypeService';
import { createCorporate, createIndividual } from '../../service/NHFService';
import EmploymentInformationService from '../../service/EmploymentInformationService';
import FirmService from '../../service/FirmService';
// import { createSecurity } from '../../service/securityInformation';
import { getAffordability } from '../../service/nhfCalculatorService'
import LocalStore from '../../service/Storage.js';


// initialiaze the store
const localStore = new LocalStore();


const userService = new UserService();
const employmentTypeService = new EmploymentTypeService();
const employmentInformationService = new EmploymentInformationService();
const firmService = new FirmService()
let storeIdOfForm = null;

export const storeUserDB = (body) => async (dispatch) => {
    try {
        const response = await userService.create(body.data);
        storeIdOfForm = 1;
        if (response.data) {
            dispatch({ type: actionTypes.EMPLOYEE_STATE_CH, payload: { forwardRoute: true, prevRoute: false } });
            dispatch({ type: actionTypes.BACK_VIEW, payload: { state: false, data: 'no data' } });
            dispatch({ type: actionTypes.USER_DATA_DB, payload: response.data.data });
            dispatch({ type: actionTypes.AUTH_INITIATE_CLIENT_DATA, data: { ...body.localStore, auth_user: response.headers['x-auth-user'] } });
            const userData = { data: response.data.data, auth_user: response.headers['x-auth-user'] }
            localStore.storeItemObject({ ...body.localStore, userData }, "intent");
            toast.success("data save, proceed");
        }

    } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 409) {
            toast.error(error.response.data.error.message);
            setTimeout(() => {
                window.location = '/';
            }, 4000);
            // getFormStartingID()
        }

    }
}

// not yet implemented
//  get startting form data if same user didnt complet filling form on a different system
export const getFormStartingID = (body) => async (dispatch) => {
    try {
        const { data } = await userService.create(body.data);
        if (data) {
            toast.success("data save, proceed");
        }

    } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 409) {
            toast.error(error.response.data.error.message);
        }
        console.log(error.message);
    }
}



// not yet implemented
export const checkFormProgress = (body) => async (dispatch) => {
    try {
        const { data } = await EmploymentTypeService.create(body.data);
        if (data) {
            toast.success("data save, proceed");
            dispatch({ type: actionTypes.USER_DATA_DB, payload: data.data });
        }

    } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 409) {
            toast.error(error.response.data.error.message);
        }
        console.log(error.message);

    }
}






// export const fetchPosts = () => async (dispatch) => {
//     await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=10')
//         .then(res => {
//             dispatch({
//                 type: actionTypes.GET_POSTS,
//                 payload: res.data
//             })
//         }).catch(err => {
//             console.log(err);
//         });
// }

// to store employment category type 
export const storeEmploymentCategoryType = (body) => async (dispatch) => {
    try {
        const response = await employmentTypeService.create(body.data);
        storeIdOfForm = 2
        if (response.data) {
            dispatch({ type: actionTypes.VEC_DATA_DB, payload: response.data.data });
            dispatch({ type: actionTypes.VEC_DATA, payload: { selectedType: body.localStore.selectedType, auth_employmenttype: response.headers['x-auth-employmenttype'] } })
            const vecData = { data: response.data.data, auth_employmenttype: response.headers['x-auth-employmenttype'] }
            localStore.storeItemObject({ ...body.localStore, vecData }, "intent");
            toast.success('employee category saved, proceed ', {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

    } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 409) {
            toast.error(error.response.data.error.message);
            // getFormStartingID()

        }
        console.log(error.message);

    }
}


// to store employment category type  individual
export const storeEmploymentInformation = (body) => async (dispatch) => {
    try {
        toast.info("please while processing your data");
        // dispatch({ type: actionTypes.SUBMIT_BTN_STATE, payload: true });
        // 
        const response = await employmentInformationService.create(body.data);
        if (response.data.data) {

            const createNHF = await createIndividual(response.headers['x-auth-employmentinfo']);
            if (createNHF.status === 201) {
                dispatch({ type: actionTypes.EMPLOYMENT_INFO_DB, payload: response.data.data });
                dispatch({
                    type: actionTypes.EMPLOYEE_INFORMATION, payload: {
                        employmentInfo: { ...body.localStore.employmentInfo, NHFID: createNHF.data.data.NHFID },
                        auth_employmenttype: response.headers['x-auth-employmenttype']
                    }
                });
                const employmentInfoData = { data: response.data.data, auth_employmentinfo: response.headers['x-auth-employmentinfo'] };
                const appendNHF = { ...body.localStore.employmentInfo, NHFID: createNHF.data.data.NHFID };
                localStore.storeItemObject({
                    ...body.localStore, "employmentInfo": appendNHF, employmentInfoData
                }, "intent");
                toast.success('employee category saved, proceed ', {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                dispatch({ type: actionTypes.SUBMIT_BTN_STATE, payload: false });

            }
        }





    } catch (error) {
        dispatch({ type: actionTypes.SUBMIT_BTN_STATE, payload: false });
        console.log(error.response);
        if (error.response && error.response.status === 400) { toast.error(error.response.data.error.message); }

        if (error.response && error.response.status === 401) { toast.error(error.response.data.error.message); }
        if (error.response && error.response.status === 404) { toast.error(error.response.data.error.message); }
        if (error.response && error.response.status === 409) { toast.error(error.response.data.error.message); }


        console.log(error.message);

    }
}




export const storeSelfEmploymentInfo = (body) => async (dispatch) => {
    try {
        toast.info("please while processing your data");
        const res = await firmService.getNHFID({
            "x-auth-employmenttype": body.data["x-auth-employmenttype"],
            "parentNHF": body.localStore.employmentInfo.parentNHF
        });
        if (res.data) {
            const response = await employmentInformationService.create(body.data);
            if (response.data) {
                dispatch({ type: actionTypes.EMPLOYMENT_INFO_DB, payload: response.data.data });
                dispatch({ type: actionTypes.EMPLOYEE_INFORMATION, payload: { employmentInfo: body.localStore.employmentInfo, auth_employmenttype: response.headers['x-auth-employmenttype'] } })
                const employmentInfoData = {
                    data: response.data.data, auth_employmentinfo: response.headers['x-auth-employmentinfo']
                }
                localStore.storeItemObject({
                    ...body.localStore, employmentInfoData
                }, "intent");
                toast.success('employee category saved, proceed ', {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }


    } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 409) { toast.error(error.response.data.error.message); }
        if (error.response && error.response.status === 404) { toast.error(error.response.data.error.message); }
        if (error.response && error.response.status === 401) { toast.error(error.response.data.error.message); }

        console.log(error.message);

    }
}

// to store security information
export const storeSecurityInformation = (body) => async (dispatch) => {
    try {
        toast.info('please wait while processing your data ', {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        // setTimeout(() => {
        //     dispatch({
        //         type: actionTypes.FORM_SECURITY_INFORMATION, payload: {
        //             securityInfo: { name: 'ade' },

        //         }
        //     });
        //     dispatch({ type: actionTypes.SECURITY_INFO_DB, payload: { id: '01', name: 'dele' } });
        //     dispatch({ type: actionTypes.SUBMIT_BTN_STATE, payload: false });

        // }, 2000);
        const employType = await employmentInformationService.verifyEmployInfo(body.data);
        if (employType.status === 200) {
            const response = await userService.verifyUser(body.data);
            storeIdOfForm = 3;
            const storeEmploy = {
                auth_employmentinfo: employType.headers['x-auth-employmentinfo']
            }
            localStore.storeItemObject({ ...body.localStore, storeEmploy }, "intent");
            if (response.status === 200) {
                dispatch({ type: actionTypes.SECURITY_INFO_DB, payload: response.data.data });
                dispatch({
                    type: actionTypes.FORM_SECURITY_INFORMATION, payload: {
                        securityInfo: body.localStore.securityInfo,
                        auth_employmenttype: employType.headers['x-auth-employmentinfo'], auth_usertoken: response.headers['x-user-token']
                    }
                });
                const securityInfoData = { data: response.data.data, auth_usertoken: response.headers['x-user-token'] }
                localStore.storeItemObject({ ...body.localStore, securityInfoData }, "intent");
                toast.success('security information saved, proceed ', {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                // dispatch({ type: actionTypes.SUBMIT_BTN_STATE, payload: false });
                setTimeout(() => {
                    dispatch({ type: actionTypes.SUBMIT_BTN_STATE, payload: false });
                }, 3000);
            }
        }


    } catch (error) {
        dispatch({ type: actionTypes.SUBMIT_BTN_STATE, payload: false });
        console.log(error);
        if (error.response && error.response.status === 409) { toast.error(error.response.data.error.message); }
        if (error.response && error.response.status === 401) { toast.error(error.response.data.error.message); }
        if (error.response && error.response.status === 400) {
            toast.error(error.response.data.error.message);
        }
        console.log(error.message);

    }
}

// get Data for NHFCalculator
export const getNHFCalDetail = (body) => async (dispatch) => {
    getAffordability(body).then(res => {
        if (res.data) {
            storeIdOfForm = "3b"
            dispatch({ type: actionTypes.NHF_CALCULATOR_DB, payload: res.data.data })
            toast.success('NHF calculated detail populated, proceed', {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

    }, (error => {
        if (error.response && error.response.status === 409) { toast.error(error.response.data.error.message); }
        console.log(error);
    }));
}

// sample action to test hook with redux
export const updateVECData = (data) => {
    return { type: actionTypes.VEC_DATA, payload: data }
}


export const updateCalendarDuration = (data) => {
    return {
        type: actionTypes.CALENDAR_DURATION, payload: data
    }
}

export const updateRecordSearch = (data) => {
    return {
        type: actionTypes.RECORD_SEARCH, payload: data
    }
}

// store employer information to state
export const updateEmployerData = (data) => {
    return { type: actionTypes.EMPLOYER_DATA_DB, payload: data }
}

// corporate store employer information 1st step
export const storeEmployerInformation = (body) => async (dispatch) => {
    try {
        toast.info("please wait while processing your data");
        const response = await firmService.create(body.data);
        if (response.data) {
            const res = await firmService.getOne(response.data.data.id, response.headers['x-auth-firm'])
            if (res.data) {
                const createNHF = await createCorporate(response.headers['x-auth-firm']);
                if (createNHF.data) {
                    dispatch({
                        type: actionTypes.EMPLOYER_DATA_DB, payload: {
                            server: { ...res.data.data, NHFID: createNHF.data.data.NHFID },
                            localStore: { ...body.localStore.dataJob, NHFID: createNHF.data.data.NHFID },
                            auth_firmtoken: response.headers['x-auth-firm']
                        }
                    });
                    const companyInfoData = {
                        data: { ...res.data.data, NHFID: createNHF.data.data.NHFID }, auth_firmtoken: response.headers['x-auth-firm'],

                    }
                    localStore.storeItemObject({ ...body.localStore, companyInfoData }, "intent");
                    toast.success("company information saved, proceed");
                }
            }
        }


    } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 409) {
            toast.error(error.response.data.error.message);
            // setTimeout(() => {
            //     window.location = "/";
            // }, 4000);
        }
        if (error.response && error.response.status === 400) { toast.error(error.response.data.error.message); }
        console.log(error.message);

    }
}


// corporate store employer information 1st step
export const storeEmployerVerification = (body) => async (dispatch) => {
    try {
        toast.info('🤡 please wait while processing your data ', {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        const response = await firmService.updateFirmID({
            NHFID: body.localStore.data.NHFID,
            auth_firmtoken: body.localStore.auth_firmtoken,
            firmId: body.localStore.data.firmId
        });
        if (response.data.data) {

            const res = await firmService.verifyEmployer({ ...body.data.data, NHFID: body.localStore.data.NHFID });
            if (res.data) {
                toast.info('please wait while validating your data ', {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                dispatch({
                    type: actionTypes.EMPLOYER_CONGRAT_DB, payload: { server: { "data": res.data.data }, data: { ...body.localStore.data }, auth_firmtoken: res.headers['x-auth-firm'] }
                });
                localStore.storeItemObject({ ...body.localStore, auth_firmtoken: res.headers['x-auth-firm'] }, "intent");

                toast.success('company information saved, proceed ', {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                dispatch({ type: actionTypes.SUBMIT_BTN_STATE, payload: false });
            }
        }

    } catch (error) {
        console.log(error);
        dispatch({ type: actionTypes.SUBMIT_BTN_STATE, payload: false });
        if (error.response && error.response.status === 409) {
            toast.error(error.response.data.error.message);
            setTimeout(() => {
                window.location = '/';
            }, 3000);
        }
        if (error.response && error.response.status === 404) { toast.error(error.response.data.error.message); }
        if (error.response && error.response.status === 401) { toast.error(error.response.data.error.message); }
        if (error.response && error.response.status === 400) { toast.error(error.response.data.error.message); }


    }
}


export const logout = () => {
    return { type: actionTypes.AUTH_INITIATE_LOGOUT }
}

// export const updateClientData = (data) => {
//     return {
//         type: actionTypes.CLIENT_DATA,
//         payload: data
//     }
// }

// using with redux saga to store data step2 
// though should be use when u want to execute a task before storing data to store
export const updateClientData = (data) => {
    return { type: actionTypes.AUTH_INITIATE_CLIENT_DATA, data }
}

// sample action to test hook with redux
export const updateHookName = (data) => { return { type: actionTypes.HOOK_SAMPLE_NAME, payload: data }; }

export const updateSubmitBTNState = (data) => {
    return { type: actionTypes.SUBMIT_BTN_STATE, payload: data };
}

export const updateEmptyUserDB = (data) => {
    return { type: actionTypes.USER_DATA_DB, payload: data }
}

export const updateStateCh = (data) => {
    return { type: actionTypes.EMPLOYEE_STATE_CH, payload: data }
}


// employer Information update
export const updateEmployeeInformation = (data) => {
    return { type: actionTypes.EMPLOYEE_INFORMATION, payload: data }
}

// schema detail
export const updateSchemaData = (data) => {
    return { type: actionTypes.FORM_SCHEMA_DATA, payload: data }
}



// update Security Information
export const updateSecurityEmployeeInformation = (data) => {
    return { type: actionTypes.FORM_SECURITY_INFORMATION, payload: data }
}

// updatePropertySelected
export const updatePropertySelected = (data) => {
    return { type: actionTypes.SELECTED_PROPERTY, payload: data }
}

export const updateBackView = (data) => {
    return { type: actionTypes.BACK_VIEW, payload: data }
}


// check state if any property is selected from the list
export const updateCheckProperty = (data) => {
    return { type: actionTypes.CHECK_SELECTED_STATE, payload: data }
}

export const updateRemoveFile = (data) => {
    return { type: actionTypes.REMOVE_FILE, payload: data }
}

export const updateAddFile = (data) => {
    return { type: actionTypes.ADD_FILE, payload: data }
}

export const updateUploadedFile = (data) => {
    return { type: actionTypes.UPLOADED_FILE, payload: data }
}

// check state if calculator modal has being close to go to profile page
export const updateProfileSlide = (data) => {
    return { type: actionTypes.CHECK_USER_PROFILE_SLIDE_STATE, payload: data }
}



// check state if any property is selected from the list
export const updateCheckChosenProperty = (data) => {
    return { type: actionTypes.CHECK_SELECTED_PROPERTY_STATE, payload: data }
}

// check state if any property is selected from the list
export const updateLoginState = (data) => {
    return { type: actionTypes.CHECK_LOGIN_STATE, payload: data }
}

export const updateAccountUserType = (data) => {
    return { type: actionTypes.CLIENT_ACCOUNT_USER_TYPE, payload: data }
}

export const updateFBMNSettingState = (data) => {
    return {
        type: actionTypes.SETTING_POP_STATE, payload: data
    }
}

export const updateEmployeeList = (data) => {
    return {
        type: actionTypes.TOTAL_EMPLOYEE_DB, payload: data
    }
}

export const setUserToken = (data) => {
    return {
        type: actionTypes.SET_USER_TOKEN, payload: data
    }
}


export const checkAuthTimeout = (expirationTime) => {
    return { type: actionTypes.AUTH_CHECK_TIMEOUT, expirationTime: 2000 };
};


