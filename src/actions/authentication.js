// 액션 타입
import {AUTH_LOGIN, AUTH_LOGIN_FAILURE, AUTH_LOGIN_SUCCESS} from "./ActionTypes";
import {AUTH_REGISTER, AUTH_REGISTER_FAILURE, AUTH_REGISTER_SUCCESS} from "./ActionTypes";
import {AUTH_GET_STATUS, AUTH_GET_STATUS_SUCCESS, AUTH_GET_STATUS_FAILURE} from "./ActionTypes";
import {AUTH_LOGOUT} from "./ActionTypes";

// Axios
import axios from 'axios';
// 엑시오스를 사용하면, 리엑트에서 http 리퀘스트가 가능해진다!
// 엑시오스는 기본적으로 Promise 문법을 따른다!

// authentication

// ***********************
// ** 로그인 관련 액션 생성자 **
// ***********************

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


// **********************
// ** 등록 관련 액션 생성자 **
// **********************
export function register() {
    return {
        type: AUTH_REGISTER
    };
}

export function registerSuccess() {
    return {
        type: AUTH_REGISTER_SUCCESS
    }
}


export function registerFailure(error) {
    return {
        type: AUTH_REGISTER_FAILURE,
        error  // 에러 타입이 3가지라서 에러 값도 따로 전달해주도록 함!
        // ERR 1: BAD ID / 2: BAD PW / 3: EXIST ID -> 백엔드 라우터 파일!
    }
}

export function registerRequest(username, password) {
    return (dispatch) => {
        // 시작 코드
        dispatch(register());

        // 동작 코드(액션 생성자)를 리스폰드에 따라 변화를 줌!
        return axios.post('/api/account/signup', {username, password})
            .then((res) => {
                dispatch(registerSuccess());
            })
            .catch((error) => { // error.response 클래스에 config, data, headers, request,status, statusText, __proto 객체가 있음!!
                // 그냥 에러를 출력하면 텍스트 형태로밖에 나오지 않음!
                // console.log(error.response.data); //TODO: 디스패치에서 라우터 에러 잡아내는 방법
                // data 에는 code:(에러 코드를 담음) // error:(에러 메시지) 형태로 됨!
                // 이는 라우터(/api/account/signup<account.js>)에서 지정한 에러 형태가 전달되는 것으로 보임!
                dispatch(registerFailure(error.response.data.code));
            })

    };
}


// ***********************
// ** 로그인 관련 액션 생성자 **
// **********************
export function getStatus() {
    return {
        type: AUTH_GET_STATUS
    };
}

export function getStatusSuccess(username) {
    return {
        type: AUTH_GET_STATUS_SUCCESS,
        username
    };
}

export function getStatusFailure() {
    return {
        type: AUTH_GET_STATUS_FAILURE
    };
}

export function getStatusRequest() {
    return (dispatch) => {

        dispatch(getStatus());

        // router/account.js::96l 117l
        return axios.get('/api/account/getInfo')
            .then((response) => {
                dispatch(getStatusSuccess(response.data.info.username));
            })
            .catch((err) => {
                dispatch(getStatusFailure())
            });

    };
}


// ************************
// ** 로그아웃 관련 액션 생성자 **
// ************************
export function logout() {
    return {
        type: AUTH_LOGOUT
    }
}

export function logoutRequest() {
    return (dispatch) => {
        return axios.post('/api/account/logout')
            .then((res) => {
                dispatch(logout());
            });
    }
}