import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';
import {PROJ_LIST_SUCCESS} from "../actions/ActionTypes";

const initialState = {
    post: {
        status: 'INIT',
        error: -1
    },
    list: {
        status: "INIT",
        data: [],
        isLast: false
    }
};

export default function project(state, action) {

    if (typeof state === "undefined")
        state = initialState;

    ///////////////
    //// 프로젝트 등록
    switch (action.type) {

        case types.PROJ_POST:
            return update(state, {
                post: {
                    status: {$set: "WAITING"},
                    error: {$set: -1}
                }
            });
        case types.PROJ_POST_SUCCESS:
            return update(state, {
                post: {
                    status: {$set: "SUCCESS"}
                }
            });
        case types.PROJ_POST_FAILURE:
            return update(state, {
                post: {
                    status: "FAILURE",
                    error: {$set: action.error}
                    // 액션생성자에서 라우터에서 나오는 에러코드를 발송함! (actions/project.js::44)
                    // data.code 1: 로그인 안됨, 2: 내용이 비어있
                }
            });
        //////////////////////
        //// 프로젝트 정보 받아오기
        case types.PROJ_LIST:
            return update(state, {
                list: {
                    status: {$set: "WAITING"}
                }
            });
        case types.PROJ_LIST_SUCCESS:
            // action type: PROJ_LIST_SUCCESS,
            //     data,
            //     isInitial,
            //     listType
            if (action.isInitial)
                return update(state, {
                    list: {
                        status: {$set: "SUCCESS"},
                        data: {$set: action.data},
                        isLast: {$set: action.data.length < 6}
                        // 6개 이하일 경우, 마지막 페이지로 인삭
                        // 무한 스크롤 대응 코드
                    }
                });
            else {

                if (action.listType === 'new') {
                    return update(state, {
                        list: {
                            // 최신 프로젝트 업데이트 경우, 기존에 있는 프로젝트 위에 끼워넣음!
                            status: {$set: "SUCCESS"},
                            data: {$unshift: action.data},
                            // $unshift :: 배열의 앞 부분에 데이터를 추가
                            // $push :: 배열의 뒷 부분에 추가 할 때
                        }
                    });
                } else {
                    return update(state, {
                        list: {
                            // 예전 프로젝트 업데이트 경우, 기존에 있는 프로젝트 뒤에 추가함!
                            status: {$set: "SUCCESS"},
                            data: {$push: action.data},
                            isLast: {$set: action.data.length < 6}
                        }
                    });
                }
            }


            // 새로운/오래된 메모 로딩할 부분! (나중에 구현)
            return state;

        case types.PROJ_LIST_FAILURE:
            return update(state, {
                list: {
                    status: {$set: "FAILURE"}
                }
            });

        default:
            return state;

    }


}