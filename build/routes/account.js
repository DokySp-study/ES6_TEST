'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _account = require('../models/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// POST /api/account/signup (회원가입)
// BODY SAMPLE: { "username": "test", "password": "test" }
// ERR 1: BAD ID / 2: BAD PW / 3: EXIST ID
router.post('/signup', function (req, res) {

    // 아이디 체크
    var usernameRegex = /^[a-z0-9]+$/; // TODO: 정규식인가..?

    if (!usernameRegex.test(req.body.username)) {
        return res.status(400).json({
            error: "Bad username",
            code: 1
        });
    }

    // 비밀번호 체크
    //typeof: https://msdn.microsoft.com/ko-kr/library/259s7zc1(v=vs.94).aspx

    if (req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: "Bad password",
            code: 2
        });
    }

    // 아이디가 이미 존재하는지 확인
    _account2.default.findOne({ username: req.body.username }, function (err, exists) {
        if (err) throw err;
        if (exists) {
            return res.status(400).json({
                error: "User name exists",
                code: 3
            });
        }

        // 계정 생성
        var account = new _account2.default({
            username: req.body.username,
            password: req.body.password
        });

        account.password = account.generateHash(account.password);

        account.save(function (err) {
            if (err) throw err;
            return res.json({ success: true });
        });
    });
});

// POST /api/account/signin (로그인)
router.post('/signin', function (req, res) {

    // 아이디 형식 확인
    if (typeof req.body.username !== 'string') {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    _account2.default.findOne({ username: req.body.username }, function (err, resAccount) {
        if (err) throw err;

        // 아이디 확인
        if (!resAccount) {
            return res.status(401).json({
                error: "Cannot found username",
                code: 2
            });
        }

        // 암호 확인
        if (!resAccount.validateHash(req.body.password)) {
            return res.status(401).json({
                error: "Wrong password",
                code: 3
            });
        }

        // 로그인 성공 & 세션 생성
        var session = req.session;
        session.loginInfo = { // JS 특성상 특정 선언 없이 속성값을 만들 수 있다!
            _id: resAccount._id,
            username: resAccount.username
        };

        return res.json({
            success: true
        });
    });
});

// GET /api/account/getinfo (세션 확인)
// 새로고침 시 리렌더링 할 때 쿠키 유효성 확인!
router.get('/getinfo', function (req, res) {
    if (typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            error: 1
        });
    }

    res.json({ info: req.session.loginInfo });
});

// POST /api/account/logout
router.post('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) throw err;
    });
    return res.json({ success: true });
});

//에러 처리는 이 파일의 부모 파일에서 진행한다!
exports.default = router;