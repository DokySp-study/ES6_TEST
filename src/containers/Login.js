
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
        this.handleLogin = this.handleLogin.bind(this); //TODO: ?????
    }

    handleLogin(id, pw) {
        return this.props.loginRequest(id, pw)
            .then( () => {
                if(this.props.status === "SUCCESS"){
                    // create session data
                    let loginData = {
                        isLoggedIn: true,
                        username: id
                    };

                    document.cookie = 'key' + btoa(JSON.stringify(loginData)); //TODO: ??????

                    Materialize.toast('Welcome, ' + id + '!', 2000);
                    browserHistory.push('/');
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
                    mode={true}
                    onLogin={this.handleLogin}/>
            </div>
        )
    }

}

const mapStateToProps = (state) => ({
    status: state.authentication.login.status
});

const mapDispatchToProps = (dispatch) => ({
    loginRequest: (id,pw) => {
        return dispatch(loginRequest(id,pw));
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(Login);