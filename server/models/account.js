
import mongoose from 'mongoose';
// 암호를 암호화하여 저장할 수 있도록 하는 패키지
import bcrypt from 'bcryptjs';


// 스키마 작성 부분
const Schema = mongoose.Schema;

const Account = new Schema({
    username: String,
    password: String,
    created: {type: Date, default: Date.now }
});


// 암호화 작성 부분 (sync 차이를 잘 모르것네.,.)
// arrow method 쓰면 에러난다!
Account.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, 8); //salt가 뭐징
}; // 해시 생성

Account.methods.validateHash = function(password) {
    return bcrypt.compareSync(password, this.password); // 입력값과 가지고 있는 값을 비교
}; // 비밀번호 비교

export default mongoose.model('account', Account);
// 이름, 스키마, 컬랙션 이름
// 스키마 이름 추가 설정 없을 경우, 이름의 복수형으로 컬랙션 이름 사용!
// ex> account -> accounts