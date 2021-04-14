import * as actionTypes from '../actions/index';
const initialState = {
    status: false, posts: [], submitBTN: false, schemaDetail: {}, userData: {}
}
// const [userToken, setUserToken] = useState({});

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.LOGIN_USER:
            const newState = Object.assign({}, state);
            newState.user = action.payload
            console.log('newState', newState);
            return newState;

        case actionTypes.SUBMIT_BTN_STATE:
            const btnState = Object.assign({}, state);
            btnState.submitBTN = action.payload;
            return btnState;
        case actionTypes.FORM_SCHEMA_DATA:
            const schemaData = Object.assign({}, state);
            schemaData.schemaDetail = action.payload;
            return schemaData;

        case actionTypes.USER_INSURE_REC:
            const userInsureRec = Object.assign({}, state);
            userInsureRec.userData = action.payload;
            return schemaData;

        case actionTypes.GET_POSTS:
            return {
                ...state,
                posts: state.posts.concat(action.payload)
            }
        default:
            return state;
    }
}

export default reducer;