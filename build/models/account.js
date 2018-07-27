'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 스키마 작성 부분
var Schema = _mongoose2.default.Schema;
// 암호를 암호화하여 저장할 수 있도록 하는 패키지


var Account = new Schema({
    username: String,
    password: String,
    created: { type: Date, default: Date.now }
});

// 암호화 작성 부분 (sync 차이를 잘 모르것네.,.)
// arrow method 쓰면 에러난다!
Account.methods.generateHash = function (password) {
    return _bcryptjs2.default.hashSync(password, 8); //salt가 뭐징
}; // 해시 생성

Account.methods.validateHash = function (password) {
    return _bcryptjs2.default.compareSync(password, this.password); // 입력값과 가지고 있는 값을 비교
}; // 비밀번호 비교

exports.default = _mongoose2.default.model('account', Account);
// 이름, 스키마, 컬랙션 이름
// 스키마 이름 추가 설정 없을 경우, 이름의 복수형으로 컬랙션 이름 사용!
// ex> account -> accounts