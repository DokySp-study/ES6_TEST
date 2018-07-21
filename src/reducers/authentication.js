
import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    login: {
        status: "INIT"
    },
    status: {
        isLoggedIn: false,
        currentUser: ''
    }
};


// 리듀서 코드
export default function authentication(state, action) {

    if(typeof state === 'undefined')
        state = initialState;

    switch (action.type) {
        case types.AUTH_LOGIN:
            return update(state, {
                login: {
                    status: {$set: 'WAITING'}
                }
            });
        case types.AUTH_LOGIN_SUCCESS:
            return update(state, { // TODO: 이게 다 뭐냐...
                login: {
                    status: {$set: 'SUCCESS'}
                },
                status: {
                    isLoggedIn: {$set: true},
                    currentUser: {$set: action.username}
                }
            });
        case types.AUTH_LOGIN_FAILURE:
            return update(state, {
                login: {
                    status: {$set: 'FAILURE'}
                }
            });
        default:
            return state;
    }


}