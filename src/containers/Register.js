
import React from 'react';
import Authentication from "../components/Authentication";
//
import { connect } from 'react-redux';
import { registerRequest } from "../actions/authentication";
//
import { browserHistory } from 'react-router';


class Register extends React.Component {

    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleRegister(id,pw) {

        return this.props.registerRequest(id,pw)
            .then( () => {
                if(this.props.status === "SUCCESS") { // 리덕스 스토어 내용이 참일 경우
                    Materialize.toast("Success! Please sign in.", 5000);
                    browserHistory.push('/login');
                    return true;
                } else {
                    // ERR 1: BAD ID / 2: BAD PW / 3: EXIST ID -> 백엔드 라우터 파일!
                    let errorMsg = [
                        'Invalid Username',
                        'Password is too short',
                        'Username already exists'
                    ];

                    let $toastContent = $('<span style="color: #FFB4BA">' + errorMsg[this.props.errorCode-1] + '</span>');
                    Materialize.toast($toastContent, 3000);
                    return false;
                }
            } );
    }


    render() {
        return (
            <div>
                <Authentication
                    mode={false}
                    onRegister={this.handleRegister}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.register.status, // 리듀서 auth.js 에 등록된 state 불러옴
        errorCode: state.authentication.register.error
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        registerRequest: (id, pw) => dispatch(registerRequest(id,pw))
    }
)

export default connect(mapStateToProps, mapDispatchToProps)(Register);


// TODO: 리덕스 스토어 생성 과정
//
// 1. 액션 설정
//  (1). ActionType 설정
//  (2). auth.js 에 디스패치할 액션 생성자 및 함수 설정
//
// 2. 리듀서 설정
//  (1). 액션 타입에 맞는 스토어 수정 동작 지정
//
// 3. 컨테이너에서 스토어에 연결
//  (1). 이 파일에서처럼 리덕스의 프롭과 디스패치를 프롭스로 변환하여 넘김.
//  (2). 리덕스에 등록한 디스패치 함수에 대한 핸들러 구현
//
// 4. 컴포넌트에서 props로 받아오기
//  (1).