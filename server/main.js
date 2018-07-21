
import express from 'express';
// 미들웨어 패키지들
import path from 'path';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';

// 라우팅 백엔드 코드
import api from './routes';

// 개발 서버를 위한 웹팩 세팅
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
const devPort = 4000;

const app = express();
const port = 3000;

app.use(morgan('dev')); // http 로깅 미들웨어
app.use(bodyParser.json()); // 요청에서 json으로 파싱할 때 사용되는 미들웨어

// 몽고디비 커넥션
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {console.log('Connected to mongodb server');} );
mongoose.connect('mongodb://localhost/codelab'); // codelab 디비에 접근
// username:password@host:port/database=
// 몽고디비 구현할 때, 자세히 알아보기


// 세션 미들웨어 코드
app.use(session({
    secret: 'CodeLab$1$234', // 쿠키 임의 변조 방지 암호
    resave: false,
    saveUninitialized: true
}));


// 프론트 엔드로 바로 연결해주는 거로 보임.
// express.static 은 정적 파일로 연결해주는 미들웨어 함수!
app.use('/', express.static(path.join(__dirname, './../public')) );


// 벡엔드 라우팅 연결
app.use('/api',api);


// 프론트엔드 라우팅 연결
app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, "./../public/index.html"));
});


// app.get('/hello', (req,res) => {
//     return res.send('Hello Codelab');
// });

app.listen(port, () => {
    console.log('Express is listening on port ', port);
});


// 에러 핸들러 (위에서 에러 뿜었을 시, 여기서 받아줌.)
app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).send("Something server internal error occurred.");
});


// 개발 서버 켜는 코드
if(process.env.NODE_ENV == 'development'){
    console.log('Server is running on dev. mode');
    const config = require('../webpack.dev.config');
    //import는 문서 최상위에서만 사용가능한듯!
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(devPort, () => {
        console.log('webpack-dev-server is listening on port ', devPort);
    });
}

