
import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    login: {
        status: "INIT"
    },
    register: {
        status: "INIT",
        error: -1
    },
    status: {
        valid: false, // 로그인 세션 확인용
        isLoggedIn: false,
        currentUser: ''
    }
};


// 리듀서 코드
export default function authentication(state, action) {

    if(typeof state === 'undefined')
        state = initialState;

    switch (action.type) {
        ////////////
        //// 로그인 시
        case types.AUTH_LOGIN:
            return update(state, { // 이거 이뮤터블인가..? => 코렉트!!
                login: { // 로그인 상태값을 대기로 바꿈.
                    status: {$set: 'WAITING'} // $set 연산을 두지 않으면 나머지 값이 모두 삭제됨!
                }
            });
        case types.AUTH_LOGIN_SUCCESS:
            return update(state, {
                login: {  // 로그인 상태값을 성공으로 바꿈.
                    status: {$set: 'SUCCESS'}
                },
                status: { // 세션 상태값 업데이트
                    isLoggedIn: {$set: true},
                    currentUser: {$set: action.username}
                }
            });
        case types.AUTH_LOGIN_FAILURE:
            return update(state, {
                login: { // 로그인 상태값을 실패로 바꿈.
                    status: {$set: 'FAILURE'}
                }
            });


        //////////////
        //// 계정 등록 시
        case types.AUTH_REGISTER:
            return update(state, {
                register: {
                    status: {$set: "WAITING"},
                    error: {$set: -1}
                }
            });
        case types.AUTH_REGISTER_SUCCESS:
            return update(state, {
                register: {
                    status: {$set: "SUCCESS"}
                }
            });
        case types.AUTH_REGISTER_FAILURE:
            return update(state, {
                register: {
                    status: {$set: "FAILURE"},
                    error: {$set: action.error}  // actions/auth.js 에 정의된 객체
                }
            });


        /////////////
        //// 로그인 코드
        case types.AUTH_GET_STATUS:
            return update(state, {
                status: {
                    isLoggedIn: {$set: true} // 로그인 된 상태에서 새로고침 시, 버튼 블링킹 방지
                    // 이거 설정 안했을 시, 로그인 상테에서 -> 로그아웃 -> 로그인됨!
                    // 따라서 일단 로그인 상태로 두고, 유효하지 않을 때 로그아웃 시킴!
                }
            });
        case types.AUTH_GET_STATUS_SUCCESS:
            return update(state, {
                status: {
                    valid: {$set: true},
                    currentUser: {$set: action.username} // auth.js 액션생성자에서 등록하둔거!
                }
            });
        case types.AUTH_GET_STATUS_FAILURE:
            return update(state, {
                status:{
                    isLoggedIn: {$set: false},
                    valid: {$set: false}
                }
            });

        ///////////////
        //// 로그아웃 코드
        case types.AUTH_LOGOUT:
            return update(state, {
                status: {
                    isLoggedIn: {$set: false},
                    currentUser: {$set: ""}
                }
            });


        default:
            return state;
    }

}