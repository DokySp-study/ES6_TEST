
// 액션 타입
import {AUTH_LOGIN, AUTH_LOGIN_FAILURE, AUTH_LOGIN_SUCCESS} from "./ActionTypes";
// Axios
import axios from 'axios';


// authentication

// login
export function loginRequest(username, password) {
    return (dispatch) => {

        // 로그인 API가 막 시작됨
        dispatch(login());

        // API REQUEST
        return axios.post('/api/account/signin', {username, password})
            .then((res) => {
                // 성공
                dispatch(loginSuccess(username));
            })
            .catch((err => {
                // 실패
                dispatch(loginFailure());
            }));

        // 리액트에서는 뷰를 관리하는 API 이기 때문에
        // 리퀘스트를 하기 위해 다른 것(axios)이 필요함!
        // axios 로 상황에 따라 다른 액션을 설정할 수 있음!

        // thunk 는 비동기처리 API로 아래와 같이 동작
        // let A = ()=>(1+2);
        // let X = A();
        // A()가 호출 된 후에 1+2 연산이 실행됨!

        // 즉, 함수를 리턴하고, 리턴하는 함수는 콜한 함수가 호출된 후에 동작하게 됨!

    }
}

export function login() {
    return {
        type: AUTH_LOGIN
    };
}

export function loginSuccess(username) {
    return {
        type: AUTH_LOGIN_SUCCESS,
        username
    };
}

export function loginFailure() {
    return {
        type: AUTH_LOGIN_FAILURE
    };
}
