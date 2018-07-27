import React from 'react';
import { Header } from "components";
// 컴포넌트 인덱스를 만들어 두어서 이런 식으로 처리가 가능하다!

import { connect } from 'react-redux';
import {getStatusRequest, logoutRequest} from "../actions/authentication";


class App extends React.Component {

    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    // render 다음에 실행되는 함수!
    componentDidMount() {
        // 쿠키를 이름으로 찾음
        function getCookie(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();  // ??
        }

        // 로그인 데이터를 쿠키로부터 찾아옴
        let loginData = getCookie('key');

        // 로그인 데이터가 애초에 없다면 암것두 안함
        if(typeof loginData === "undefined") return;

        // 쿠키에 있는 base64 로그인 데이터를 복호화하고 JSON 파싱
        loginData = JSON.parse(atob(loginData));

        // 로그인 데이터가 안에 없다면 암것두 안함
        if(!loginData.isLoggedIn) return;

        // 세션에 쿠키가 있는지 검사
        // 쿠키가 아직 유효한지 검사함!
        this.props.getStatusRequest()
            .then( () => {
                console.log(this.props.status);
                // 세션이 유효하지 않다면
                if(!this.props.status.valid) {

                    // 로그아웃 시킴
                    loginData = {
                        isLoggedIn: false,
                        username: ''
                    };

                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));

                    // 세션 만료 알림
                    let $toastContent = $(<span style="color: #FFB4BA">Your session is expired, Please sign-in again.</span>)
                    Materialize.toast($toastContent, 5000);

                }
            });

    }


    handleLogout() {
        this.props.logoutRequest()
            .then( () => {

                Materialize.toast("Good bye", 3000);

                let loginData = {
                    isLoggedIn: false,
                    username: ''
                };

                document.cookie = 'key=' + btoa(JSON.stringify(loginData));

            });
    }



    render(){

        //let re = /(login|register)/;
        // let isAuth = re.test(this.props.location.pathname);

        let isAuth;

        switch (this.props.location.pathname) {
            case "/login": isAuth = true; break;
            case "/register": isAuth = true; break;
        }

        return (
            <div>
                {isAuth ? undefined : <Header
                                        isLoggedIn={this.props.status.isLoggedIn}
                                        onLogout={this.handleLogout}/>}
                {this.props.children}
            </div>
        );
    }
}


const mapStateToProps = (state) => ({ // 여기 status 확인해보기
    status: state.authentication.status
})

const mapDispatchToProps = (dispatch) => ({
    getStatusRequest: () => dispatch(getStatusRequest()),
    logoutRequest: () => dispatch(logoutRequest())
})


export default connect(mapStateToProps, mapDispatchToProps)(App);
