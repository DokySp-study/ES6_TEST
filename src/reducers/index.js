
import authentication from './authentication';
import project from './project';

import {combineReducers} from 'redux';

// 여러 개의 리듀서를 컴바인해줌!!
export default combineReducers({
    authentication,
    project
});

