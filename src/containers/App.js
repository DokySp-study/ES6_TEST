import React from 'react';
import { Header } from "components";
// 컴포넌트 인덱스를 만들어 두어서 이런 식으로 처리가 가능하다!

class App extends React.Component {

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
                {isAuth ? undefined : <Header/>}
                {this.props.children}
            </div>
        );
    }
}

export default App;
