
import express from 'express';
import Memo from "../models/memo";
import mongoose from 'mongoose';

const router = express.Router();
// RESTful API
// GET: 얻는거
// POST: 주는거
// PUT: 업데이트
// DELETE: 삭제


// 메모 쓰기
// POST /api/memo
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
    let memo = new Memo({
        writer: req.session.loginInfo.username,
        contents: req.body.contents
    });

    memo.save(err => {
        if(err) throw err;
        return res.json({success: true});
    })

});


// 메모 수정
// PUT /api/memo/@userid
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
    Memo.findById(req.params.id, (err, resMemo) => {
        if(err) throw err;

        // 메모가 존재하지 않을 경우,
        if(!resMemo){ //@@@@@ 얘는 null 이 뜬다!
            return res.status(404).json({
                error: 'Cannot found memo',
                code: 4
            });
        }


        // 메모 있을 시, 작성자 검사
        if(resMemo.writer != req.session.loginInfo.username){
            return res.status(403).json({
                error: 'Permission Denied',
                code: 5
            });
        }

        // 메모 수정 후 저장.
        memo.contents = req.body.contents;
        memo.date.edited = new Date();
        memo.is_edited = true;

        memo.save((err, modMemo) => {
            if(err) throw err;
            return res.json({
                success: true,
                modMemo
            });
        });

    });

});


// 메모 삭제
// DELETE /api/memo/:id
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
    Memo.findById(req.params.id, (err, resMemo) => {
        if(err) throw err;

        if(!resMemo){
            return res.status(404).json({
                error: 'Cannot found memo',
                code: 3
            });
        }

        if(memo.writer != req.session,loginInfo.username) {
            return res.status(403).json({
                error: 'Permission denied.',
                code: 4
            });
        }

        Memo.remove({_id: req.param.id}, (err) => {
            if(err) throw err;
            res.json({success: true})
        });

    });

});


// 메모 리스트 받기
// GET /api/memo
router.get('/', (req, res) => {
    Memo.find()
        .sort({"_id": -1})  /// 최신 등록된 것 부터
        .limit(6)           /// 6개만 보여줌!
        .exec((err, memos) => {
            if(err) throw err;
            res.json(memos);
        });

    // 이 부분에 나중에 검색 관련된 부분이 구현될 예정!!

});

export default router;