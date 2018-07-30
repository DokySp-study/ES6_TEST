
import express from 'express';
import Proj from "../models/project";
import mongoose from 'mongoose';

const router = express.Router();
// RESTful API
// GET: 얻는거
// POST: 주는거
// PUT: 업데이트
// DELETE: 삭제


// 프로젝트 쓰기
// POST /api/project
// BODY SAMPLE: { contents: "string"}
// 1: 로그인 안됨, 2: 내용이 비어있
router.post('/', (req, res) => {
    // 로그인 확인
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: 'Not logged on',
            code: 1
        });
    }

    // 콘텐츠 유효성 검사
    if(typeof req.body.contents !== 'string'){
        return res.status(403).json({
            error: 'Empty Contents',
            code: 2
        });
    }
    if(req.body.contents === ""){
        return res.status(403).json({
            error: 'Empty Contents',
            code: 2
        });
    }

    // 메모 생성
    let proj = new Proj({
        writer: req.session.loginInfo.username,
        contents: req.body.contents
    });

    proj.save(err => {
        if(err) throw err;
        return res.json({success: true});
    })

});


// 메모 수정
// PUT /api/project/@userid
router.put('/:id', (req, res) => {

    //메모 아이디 유효성 검사
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "Invalid ID",
            code: 1
        });
    }

    // 콘텐츠 유효성 검사
    if(typeof req.body.contents !== 'string' || req.body.contents === ""){
        return res.status(400).json({
            error: "Empty Contents",
            code: 2
        });
    }

    // 로그인 상태 검사
    if(typeof req.session.loginInfo === 'undefined'){ // @@@@@ 얘는 undefined 가 뜬다
        return res.status(403).json({                    // nil과 비슷한 느낌!
            error: 'Not logged on',
            code: 3
        });
    }

    // 메모 찾기
    Proj.findById(req.params.id, (err, resProj) => {
        if(err) throw err;

        // 메모가 존재하지 않을 경우,
        if(!resProj){ //@@@@@ 얘는 null 이 뜬다!
            return res.status(404).json({
                error: 'Cannot found project',
                code: 4
            });
        }


        // 메모 있을 시, 작성자 검사
        if(resProj.writer != req.session.loginInfo.username){
            return res.status(403).json({
                error: 'Permission Denied',
                code: 5
            });
        }

        // 메모 수정 후 저장.
        proj.contents = req.body.contents;  //TODO: Router 제대로 동작하는지 확인해보기!
        proj.date.edited = new Date();
        proj.is_edited = true;

        proj.save((err, modProj) => {
            if(err) throw err;
            return res.json({
                success: true,
                modProj
            });
        });

    });

});


// 메모 삭제
// DELETE /api/project/:id
router.delete('/:id', (req, res) => {

    // 메모 아이디 유효성 검사
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "Invalid ID",
            code: 1
        });
    }

    // 로그인 되어있는지 확인
    if(typeof req.session.loginInfo !== "undefined") {
        return res.status(403).json({
            error: 'Not logged on',
            code: 2
        });
    }

    // 메모 확인 후, 작성자 확인
    Proj.findById(req.params.id, (err, resProj) => {
        if(err) throw err;

        if(!resProj){
            return res.status(404).json({
                error: 'Cannot found project',
                code: 3
            });
        }

        if(proj.writer != req.session,loginInfo.username) {
            return res.status(403).json({
                error: 'Permission denied.',
                code: 4
            });
        }

        Proj.remove({_id: req.param.id}, (err) => {
            if(err) throw err;
            res.json({success: true})
        });

    });

});


// 메모 리스트 받기
// GET /api/project
router.get('/', (req, res) => {
    Proj.find()
        .sort({"_id": -1})  /// 최신 등록된 것 부터
        .limit(6)           /// 6개만 보여줌!
        .exec((err, projs) => {
            if(err) throw err;
            return res.json(projs); // 이 데이터를 액션생성자 projListRequest가 받음!!
        });

});


// STEP04 추가구현
// 메모 더 읽기 (예전 || 새로운)

// ** 이전 및 새로운 메모 구분법??
//  =>> _id 값이 기존에 있는 데이터에 계속 쌓이는 식으로 번호가 메겨진다!
//      즉, 번호가 낮은 게 예전꺼고, 높은게 새로운거!!
//  ex> 5b5b2b7d6d381a0ae3e600a0, 5b5b2eff6d381a0ae3e600a1, 5b5b35726d381a0ae3e600a2

// GET /api/project/:listType/:id
// error 1: 리스트 형식 에러  |  2: 아이디 형식 에러
router.get('/:listType/:id', (req,res) => {
    let listType = req.params.listType;
    let id = req.params.id;

    // 리스트 타입 유효성 검사
    if(listType !== 'old' && listType !== 'new'){ // 올드나 뉴 둘 다 아닌 경우!
        return res.status(400).json({
            error: "INVALID LISTTYPE",
            code: 1
        });
    }

    // 메모아이디 유효성 검사
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            error: "INVALID ID",
            code: 2
        });
    }

    // string으로 되어있는 id를 몽구스 오브젝트로 바꿔줌!
    let objId = new mongoose.Types.ObjectId(req.params.id);


    if(listType === 'new'){
        Proj.find({_id: {$gt: objId}}) // 몽고디비 쿼리(Greater Then) http://solarisailab.com/archives/1908
            .sort({_id: -1}) // 내림차순
            .limit(6) // 6개만
            .exec((err,projs) => {
                if(err) return err;
                return res.json(projs);
            });
    } else {
        Proj.find({_id: {$lt: id}}) // objId 나 id 나 결과는 똑같다.. 뭐로 전달해줘도 상관 없는듯!
            .sort({_id: -1}) // 내림차순
            .limit(6)
            .exec((err,projs) => {
                if(err) return err;
                return res.json(projs);
            });
        // ** 리턴이 종료의 역할이 큰듯하다..
        //      붙이나 안붙이나 response 로 전달하는데에는 크게 영향이 없음..
    }


})







export default router;