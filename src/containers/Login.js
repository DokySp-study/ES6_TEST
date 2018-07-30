
import React from 'react';
import { Authentication } from "components";

// Redux
import {connect} from 'react-redux';
import {loginRequest} from 'actions/authentication';

// handleLogin 을 위한 라우팅
import {browserHistory} from 'react-router';


class Login extends React.Component {

    constructor(props){
        super(props);
        this.handleLogin = this.handleLogin.bind(this); // handleLogin을 이 컴포넌트(this)에 바인딩 시켜준다!
    }

    // 로그인 핸들러 구현
    // 리덕스와 연결시켜주는 용도!
    handleLogin(id, pw) {
        return this.props.loginRequest(id, pw) // 리덕스 스테이트를 프롭으로 받음! => actions/auth.js
            .then( () => { // 아작스 요청 후 동작됨!
                // 로그인 리퀘스트 이후 작업 후, 리턴함!
                if(this.props.status === "SUCCESS"){ // 상태가 로그인 된 상태라면,

                    // create session data
                    let loginData = {
                        isLoggedIn: true,
                        username: id
                    };

                    document.cookie = 'key=' + btoa(JSON.stringify(loginData)); //base64 인코딩
                    // 로그인이 성공된 세션 정보를 쿠키에 저장함!

                    // Materialize 프레임워크: 알림 기능
                    Materialize.toast('Welcome, ' + id + '!', 2000);
                    browserHistory.push('/'); // 라우팅 트리거 (<Link>와 같은 역할!)
                    // 저자 각주: browserHistoy 를 사용함으로서, 뒤로가기를 해도 페이지가 새로 리로딩되지 않고 필요한부분만 리렌더링하게끔 해줍니다.
                    return true;
                } else {
                    let $toastContent = $("<span style='color: #FFB4BA;'>Incorrect username or password</span>");
                    Materialize.toast($toastContent, 2000);
                    return false;
                }
            });

    }


    render() {
        return (
            <div>
                <Authentication
                    mode={true} // 트루로 프롭값을 넘기면 Auth 컴포넌트가 구분하여 처리!
                    // handleLogin으로 접근이 안된다 -> 바인딩 해주어야 함!
                    onLogin={this.handleLogin}/>
            </div>
        )
    }

}


// 리액트-리덕스
const mapStateToProps = (state) => ({ // 리덕스 스테이트를 프롭으로 연결
    status: state.authentication.login.status
});

const mapDispatchToProps = (dispatch) => ({ // 리덕스 디스패치를 프롭 연결
    loginRequest: (id,pw) => {
        return dispatch(loginRequest(id,pw));
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(Login);