import * as actionTypes from '../actions/index';
import { minCalendarMonth } from '../../libs/helper';
const initialState = {
    status: false, posts: [],
}
// const [userToken, setUserToken] = useState({});

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.LOGIN_USER:
            const newState = Object.assign({}, state);
            newState.user = action.resultEld
            return newState;


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