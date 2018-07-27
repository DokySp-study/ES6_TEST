'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 개발 서버를 위한 웹팩 세팅

// 미들웨어 패키지들
var devPort = 4000;

// 라우팅 백엔드 코드


var app = (0, _express2.default)();
var port = 3000;

app.use((0, _morgan2.default)('dev')); // http 로깅 미들웨어
app.use(_bodyParser2.default.json()); // 요청에서 json으로 파싱할 때 사용되는 미들웨어

// 몽고디비 커넥션
var db = _mongoose2.default.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log('Connected to mongodb server');
});
_mongoose2.default.connect('mongodb://localhost/codelab'); // codelab 디비에 접근
// username:password@host:port/database=
// 몽고디비 구현할 때, 자세히 알아보기


// 세션 미들웨어 코드
app.use((0, _expressSession2.default)({
    secret: 'CodeLab$1$234', // 쿠키 임의 변조 방지 암호
    resave: false,
    saveUninitialized: true
}));

// 프론트 엔드로 바로 연결해주는 거로 보임.
// express.static 은 정적 파일로 연결해주는 미들웨어 함수!
app.use('/', _express2.default.static(_path2.default.join(__dirname, './../public')));

// 벡엔드 라우팅 연결
app.use('/api', _routes2.default);

// 프론트엔드 라우팅 연결
app.get('*', function (req, res) {
    res.sendFile(_path2.default.resolve(__dirname, "./../public/index.html"));
});

// app.get('/hello', (req,res) => {
//     return res.send('Hello Codelab');
// });

app.listen(port, function () {
    console.log('Express is listening on port ', port);
});

// 에러 핸들러 (위에서 에러 뿜었을 시, 여기서 받아줌.)
app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).send("Something server internal error occurred.");
});

// 개발 서버 켜는 코드
if (process.env.NODE_ENV == 'development') {
    console.log('Server is running on dev. mode');
    var config = require('../webpack.dev.config');
    //import는 문서 최상위에서만 사용가능한듯!
    var compiler = (0, _webpack2.default)(config);
    var devServer = new _webpackDevServer2.default(compiler, config.devServer);
    devServer.listen(devPort, function () {
        console.log('webpack-dev-server is listening on port ', devPort);
    });
}