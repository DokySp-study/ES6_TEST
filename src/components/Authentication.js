
import React from "react";
import {Link} from "react-router";

class Authentication extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this); // 로그인 핸들러를 this에 바인딩

        this.handleRegister = this.handleRegister.bind(this);

        this.handleKeyPress = this.handleKeyPress.bind(this);

    }

    // input 값 변동 시, 뷰를 업데이트 해줌!
    handleChange(ev) {
        let nextState = {};
        nextState = {
            [ev.target.name]: ev.target.value
        };
        // nextState[대상] = 값; 이런 식으로 작성해도 문제는 없다!
        // 여기서 대괄호는 ES6 문법!
        this.setState(nextState); // {username: ev.target.value 값으로 생성된다!
    }

    handleLogin() {
        let id = this.state.username;
        let pw = this.state.password;

        this.props.onLogin(id,pw)  // :: 컨테이너에서 받아옴!
            .then((resSuccess) => { // cointainers/Login.js 에서  handleLogin!
                // success 는 handleLogin 에서 내보낸 리턴값!
                if(!resSuccess) this.setState({ // 실패 시, 패스워드를 공란으로 제출
                    password: ''
                });
            });
    }

    // 등록 핸들러
    handleRegister() {
        // let {username, password} = this.state;
        let id = this.state.username;
        let pw = this.state.password;

        this.props.onRegister(id, pw)
            .then( (success) => {
                if(!success){  // 컨테이너에서 등록 성공하면 T, 틀리면 F
                    this.setState({
                        password: ''
                    });
                }
            })

    }

    handleKeyPress(ev) {
        if(ev.charCode==13) {
            if(this.props.mode) {
                this.handleLogin();
            } else {
                this.handleRegister();
            }
        }
    }




    render() {
        // 아이디&패스워드 입력칸 모듈
        const inputBox = (
            <div>
                <div className='input-field col s12 username'>
                    <label>Username</label>
                    <input
                        name='username'
                        type='text'
                        className='validate'
                        onChange={this.handleChange}
                        value={this.state.username}/>
                </div>
                <div className='input-field col s12'>
                    <label>Password</label>
                    <input
                        name='password'
                        type='password'
                        className='validate'
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                        value={this.state.password}/>
                </div>
            </div>
        );

        // 로그인 화면 시 구성 및 동작
        const loginView = (
            <div>
                <div className='card-content'>
                    <div className='row'>
                        {inputBox}
                        <a className='waves-effect weves-light btn'
                            onClick={this.handleLogin}>SUBMIT</a>
                        {/*컨테이너에서 받아온 함수 콜하기 위한 핸들러 콜*/}
                    </div>
                </div>

                <div className='footer'>
                    <div className='card-content'>
                        <div className='right'>
                            New Here? <Link to='/register'>Create an accout</Link>
                        </div>
                    </div>
                </div>
            </div>
        );

        // 계정생성 화면 시 구성 및 동작
        const registerView = (
            <div className='card-content'>
                <div className='row'>
                    {inputBox}
                    <a className="waves-effect waves-white btn"
                       onClick={this.handleRegister}>CREATE</a>
                </div>
            </div>
        );

        return (
            <div className='container auth'>
                <Link className="logo" to='/'>COLABO</Link>
                <div className='card'> {/* 카드처럼 그림자를 넣어줌 */}
                    <div className='header blue white-text center'>
                        <div className="card-content">{this.props.mode ? "LOGIN" : "REGISTER"}</div>
                    </div>
                    {this.props.mode ? loginView : registerView}
                </div>
            </div>
        );
    }

}

Authentication.defaultProps = {
    mode: true,
    onLogin: (id,pw) => { console.log("login function not defined"); },
    onRegister: (id,pw) => {console.log("register function not defined"); }
};

Authentication.propTypes = {
    mode: React.PropTypes.bool,
    onLogin: React.PropTypes.func,
    onRegister: React.PropTypes.func
};

export default Authentication;
