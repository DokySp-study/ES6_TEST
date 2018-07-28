
import {PROJ_POST, PROJ_POST_SUCCESS, PROJ_POST_FAILURE} from "./ActionTypes";
import {PROJ_LIST, PROJ_LIST_SUCCESS, PROJ_LIST_FAILURE} from "./ActionTypes"

import axios from 'axios';


// ************************
// ** 프로젝트 관련 액션 생성자 **
// ************************

export function projPost() {
    return {
        type: PROJ_POST
    };
}

export function projPostSuccess() {
    return {
        type: PROJ_POST_SUCCESS
    };
}

export function projPostFailure() {
    return {
        type: PROJ_POST_FAILURE,
        error
    };
}

export function projPostRequest(contents) {
    return (dispatch) => {

        dispatch(projPost());

        // 프로젝트 쓰기
        // POST /api/project
        // BODY SAMPLE: { contents: "string"}
        // data.code 1: 로그인 안됨, 2: 내용이 비어있
        return axios.post('/api/project', {contents}) // 액션생성자에서 라우터에 요청해서 메모를 등록함!!
            .then((res) => {
                dispatch(projPostSuccess());
            })
            .catch((error) => {
                dispatch(projPostFailure(error.response.data.code));
            });

    }
}


// *****************************
// ** 프로젝트 데이터 관련 액션 생성자 **
// *****************************

// 파라미터
//  - isInitial: 이니셜 로딩 유무 확인
//  - listType: (Optional) 오래된 또는 새로운 메모 불러옴
//  - id: (Op.) 메모 아이디 (맨 아래 또는 맨 위에 메모의 아이디)
//  - username: (Op.) 해당 유저의 메모를 찾아옴

export function projList() {
    return {
        type: PROJ_LIST
    }
}

export function projListSuccess(data, isInitial, listType) {
    return {
        type: PROJ_LIST_SUCCESS,
        data,
        isInitial,
        listType
    }
}

export function projListFailure() {
    return {
        type: PROJ_LIST_FAILURE
    }
}

export function projListRequest(isInitial, listType, id, username) {
    return dispatch => {

        dispatch(projList());

        let url = '/api/project';
        // 파라미터에 따라 url 세팅이 달라짐

        // GET /api/project/:listType/:id
        // error 1: 리스트 형식 에러  |  2: 아이디 형식 에러
        if(typeof username === "undefined"){
            // 유저 이름이 없는 경우, 모든 문서를 열람하게 한다!
            // (초기 ? 그냥겟 : 특정 조건 겟)
            url = isInitial ? url : url + '/' + listType + "/" + id;

            // url: `${url}/${listType}/${id}` 이렇게 줄여쓸 수 있다! (템플릿 리터럴)
        } else {
            // 특정 유저의 프로젝트만 불러온다.
        }


        return axios.get(url) // get이라 전달해야 하는 데이터 파라미터가 없다!
            .then((res) => { // get 으로 넘어온 데이터를 받아온다!
                // res.data 로 몽고디비에서 가져온 오브젝트를 전달한다!
                dispatch(projListSuccess(res.data, isInitial, listType));
            })
            .catch((err) => {
                dispatch(projListFailure());
            });


    };
}