
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
        // 로그인 핸들러
        this.handleLogin = this.handleLogin.bind(this); // 바인딩

    }

    handleChange(ev) {
        let nextState = {};
        nextState[ev.target.name] = ev.target.value;
        this.setState(nextState); // {username: ev.target.value 값으로 생성된다!
    }

    handleLogin() {
        let id = this.state.username;
        let pw = this.state.password;

        this.props.onLogin(id,pw)
            .then((success) => { // 로그인 컴포넌트에서  handleLogin!
                if(!success) this.setState({
                    password: ''
                });
            });
    }



    render() {
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
                        value={this.state.password}/>
                </div>
            </div>
        );

        const loginView = (
            <div>
                <div className='card-content'>
                    <div className='row'>
                        {inputBox}
                        <a className='waves-effect weves-light btn'
                            onClick={this.handleLogin}>SUBMIT</a>
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

        const registerView = (
            <div className='card-content'>
                <div className='row'>
                    {inputBox}
                    <a className="waves-effect waves-white btn">CREATE</a>
                </div>
            </div>
        );

        return (
            <div className='container auth'>
                <Link className="logo" to='/'>MEMO PAD</Link>
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
