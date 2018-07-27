import React from 'react';
import ReactDOM from 'react-dom';

// 라우팅 코드
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
// 컨테이너 컴포넌트
import {App, Home, Login, Register} from 'containers';

// 리덕스 관련 컴포넌트들
import {Provider} from 'react-redux'; // 리덕스를 리액트에서 묶어주는 역할!!
import {createStore, applyMiddleware} from 'redux';
import reducers from 'reducers';
import thunk from 'redux-thunk';

const store = createStore(reducers, applyMiddleware(thunk));
// thunk 란?
//  - 비동기 처리를 할 때 사용하는 미들웨어
//  - dispatch() 할 때, action, action creator 함수가 들어가는데
//    액션생성자 자체로는  HTTP 요청이 불가능! thunk 쓰면
//     ajax 요청 후 결과값에 따라 다른 action을 디스패치할 수 있음!

const rootElement = document.getElementById('root');
ReactDOM.render(
    // <App/>
    // 프로바이더로 묶어주면 이 안에 있는 컨테이너들이 리덕스 스토어를 공유함!
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="home" component={Home}/>
                <Route path="login" component={Login}/>
                <Route path="register" component={Register}/>
            </Route>
        </Router>
    </Provider>
    , rootElement
);
