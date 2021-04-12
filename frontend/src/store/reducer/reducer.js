import * as actionTypes from '../actions/index';
import { minCalendarMonth } from '../../libs/helper';
const initialState = {
    user: {}, posts: [], userDB: {}, userLogin: false, dataJob: {}, accountUserType: '', employmentInfo: {}, settingPOPState: false,
    hookSample: true, submitBTN: false, schemaDetail: {}, schemaSecurityDetail: {}, propertyDetail: null, propertyState: false, loginSelector: false, chosenPropertyState: false,
    VECDATADB: {}, VECDATA: {}, employmentInfoDB: {}, backView: { state: false, data: '' }, divStateChange: { forwardRoute: true, prevRoute: true },
    securityInfoDB: {}, NHFCalculator: {}, employerDB: {}, employerCongratDB: {}, profileSlide: false, totalEmployee: { totalUnits: 0, list: [] },
    addFile: [], uploadedFile: [], userToken: {}, calendarData: { startDate: minCalendarMonth(6), endDate: new Date().toISOString().split('T')[0] },
    dateSearch: '',
}
// const [userToken, setUserToken] = useState({});

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.LOGIN_USER:
            const newState = Object.assign({}, state);
            newState.user = action.resultEld
            return newState;

        case actionTypes.USER_DATA_DB:
            const serverData = Object.assign({}, state);
            serverData.userDB = action.payload;
            return serverData;

        case actionTypes.SET_USER_TOKEN:
            const serveruUserData = Object.assign({}, state);
            serveruUserData.userToken = action.payload;
            return serveruUserData;

        case actionTypes.ADD_FILE:
            const saveData = Object.assign({}, state);
            const store = action.payload;
            saveData.addFile = [...saveData.addFile, ...store];
            return saveData;

        case actionTypes.UPLOADED_FILE:
            const uploaded = Object.assign({}, state);
            const storedFile = action.payload;
            uploaded.addFile = [...storedFile];
            return uploaded;

        case actionTypes.REMOVE_FILE:
            const fileData = Object.assign({}, state);
            fileData.addFile = action.payload;
            return fileData;

        case actionTypes.TOTAL_EMPLOYEE_DB:
            const total = Object.assign({}, state);
            total.totalEmployee.totalUnits = action.payload.totalUnits;
            total.totalEmployee.list = action.payload.list;
            return total;

        case actionTypes.EMPLOYER_DATA_DB:
            const employerDetail = Object.assign({}, state);
            employerDetail.employerDB = action.payload;
            return employerDetail;


        case actionTypes.EMPLOYER_CONGRAT_DB:
            const employerCongrat = Object.assign({}, state);
            employerCongrat.employerCongratDB = action.payload;
            return employerCongrat;

        case actionTypes.VEC_DATA_DB:
            const VECDataDB = Object.assign({}, state);
            VECDataDB.VECDATADB = action.payload;
            return VECDataDB;

        // 
        case actionTypes.EMPLOYMENT_INFO_DB:
            const storeEmploymentInfo = Object.assign({}, state);
            storeEmploymentInfo.employmentInfoDB = action.payload;
            return storeEmploymentInfo;

        case actionTypes.EMPLOYEE_STATE_CH:
            const stateEmploymentInfo = Object.assign({}, state);
            stateEmploymentInfo.divStateChange = action.payload;
            return stateEmploymentInfo;


        case actionTypes.VEC_DATA:
            const VECData = Object.assign({}, state);
            VECData.VECDATA = action.payload;
            return VECData;

        case actionTypes.CLIENT_ACCOUNT_USER_TYPE:
            const accountUserTyp = Object.assign({}, state);
            accountUserTyp.accountUserType = action.payload;

            return accountUserTyp;

        case actionTypes.HOOK_SAMPLE_NAME:
            const hookTest = Object.assign({}, state);
            hookTest.hookSample = action.payload;
            return hookTest;

        case actionTypes.SUBMIT_BTN_STATE:
            const btnState = Object.assign({}, state);
            btnState.submitBTN = action.payload;
            return btnState;

        case actionTypes.EMPLOYEE_INFORMATION:
            const employeeData = Object.assign({}, state);
            employeeData.employmentInfo = action.payload;
            return employeeData;

        case actionTypes.FORM_SCHEMA_DATA:
            const schemaData = Object.assign({}, state);
            schemaData.schemaDetail = action.payload;
            return schemaData;

        // schemaSecurityDetail
        case actionTypes.FORM_SECURITY_INFORMATION:
            const schemaSec = Object.assign({}, state);
            schemaSec.schemaSecurityDetail = action.payload;
            return schemaSec;

        // schemaSecurityDetail
        case actionTypes.SECURITY_INFO_DB:
            const securityDB = Object.assign({}, state);
            securityDB.securityInfoDB = action.payload;
            return securityDB;

        case actionTypes.NHF_CALCULATOR_DB:
            const NHFCal = Object.assign({}, state);
            NHFCal.NHFCalculator = action.payload;
            return NHFCal;


        case actionTypes.BACK_VIEW:
            const chosenBackView = Object.assign({}, state);
            chosenBackView.backView = action.payload;
            return chosenBackView;

        case actionTypes.SELECTED_PROPERTY:
            const chosenProperty = Object.assign({}, state);
            chosenProperty.propertyDetail = action.payload;
            return chosenProperty;

        case actionTypes.CHECK_SELECTED_STATE:
            const currentState = Object.assign({}, state);
            currentState.propertyState = action.payload;
            return currentState;

        case actionTypes.CHECK_USER_PROFILE_SLIDE_STATE:
            const showSlide = Object.assign({}, state);
            showSlide.profileSlide = action.payload;
            return showSlide;

        case actionTypes.CHECK_LOGIN_STATE:
            const loginState = Object.assign({}, state);
            loginState.loginSelector = action.payload;
            return loginState;

        case actionTypes.CHECK_SELECTED_PROPERTY_STATE:
            const currentPropertyState = Object.assign({}, state);
            currentPropertyState.chosenPropertyState = action.payload;
            return currentPropertyState;

        case actionTypes.SETTING_POP_STATE:
            const settingState = Object.assign({}, state);
            settingState.settingPOPState = action.payload;
            return settingState;

        case actionTypes.CLIENT_DATA:
            const newStaten = Object.assign({}, state);
            newStaten.dataJob = action.payload;
            return newStaten;


        case actionTypes.CALENDAR_DURATION:
            const calenDuration = Object.assign({}, state);
            calenDuration.calendarData = action.payload;
            return calenDuration;

        case actionTypes.RECORD_SEARCH:
            const searchDate = Object.assign({}, state);
            searchDate.dateSearch = action.payload
            return searchDate;

        case actionTypes.GET_POSTS:
            return {
                ...state,
                posts: state.posts.concat(action.payload)
            }
        case actionTypes.AUTH_LOGOUT:
            return {
                ...state,
                userLogin: false
            }
        default:
            return state;
    }
}

export default reducer;