
import React from 'react';
import {Link} from "react-router";
// 페이지를 새로 로딩하는 것을 막고,
// 라우트에 보여지는 내용만 변하게 해준다! (a태그는 리로딩!)

class Header extends React.Component {
    render() {

        const loginBtn = (
            <li>
                <Link to='/login'> {/*a태그를 사용하면 새로고침을 하므로 a 대신 Link 태그를 썼다!*/}
                    <i className="material-icons">vpn_key</i>
                </Link>
            </li>
        );

        const logoutBtn = (
            <li>
                <a onClick={this.props.onLogout}>
                    <i className="material-icons">lock_open</i>
                </a>
            </li>
        );


        return (
            // Reference:
            // - http://materializecss.com/navbar.html
            // - http://materializecss.com/icons.html
            // - http://materializecss.com/color.html

            <nav>  {/* 위에 한 줄 */}
                <div className="nav-wrapper blue darken-1"> {/* 그걸 파랑이로 만듦 */}
                    <Link to='/' className="brand-logo center">state.username</Link>

                    <ul>
                        <li><a><i className="material-icons">search</i></a></li>
                    </ul>

                    <div className="right">
                        <ul>
                            {this.props.isLoggedIn ? logoutBtn : loginBtn}
                        </ul>
                    </div>
                </div>
            </nav>

        );
    }
}

Header.defaultProps = {
    isLoggedIn: false,
    onLogout: () => {console.error("logout function not defined");}
};

// 이건 해도 되고 안해도 되는 거임!!
Header.propTypes = {
    isLoggedIn: React.PropTypes.bool,
    onLogout: React.PropTypes.func
};


export default Header;