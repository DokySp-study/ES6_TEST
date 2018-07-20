'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/signup', function (req, res) {
    res.json({ success: 1 });
});

router.post('/signin', function (req, res) {
    res.json({ success: 1 });
});

router.post('/getinfo', function (req, res) {
    res.json({ success: 1 });
});

router.post('/logout', function (req, res) {
    res.json({ success: 1 });
});

exports.default = router;