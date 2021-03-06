//유저의 마이페이지
//유저 닉네임 비밀번호 수정,  회원탈퇴기능

var createError = require('http-errors')
var router = require('express').Router()
const User = require('../../../models/users')
const Board = require('../../../models/boards')
const Article = require('../../../models/articles')
const Comment = require('../../../models/comments')
const crypto = require('crypto')

//토큰을 위조한 것이 아니라 올바른 절차를 밞은 유저인지 확인하는 api
//화면 새로고침할때마다 이곳에서 유저에 대한 데이터를 받아감
router.get('/', function (req, res, next) {
    const _id = req.user._id
    User.findById({ _id }).lean()
        .then(r => {
            delete r.pwd
            res.send({ success: true, userData: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
});



router.all('*', function (req, res, next) {
    if (req.user.lv > 2) throw createError(403, '권한이 없습니다')
    next();
});




//이미지 수정
router.put('/img', (req, res, next) => {
    const _id = req.user._id;
    User.updateOne({ _id }, { $set: req.body })
        .then(r => {
            res.send({ success: true, msg: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })

})

//유저 이미지변경 api 추가

//유저 닉네임 비밀번호 수정,  회원탈퇴기능



router.put('/:_id', (req, res, next) => {

    const _id = req.params._id
    if (_id !== req.user._id)
        if (req.user.lv) throw createError(403, '권한이 없습니다')
    //비밀번호가 있다면 비밀번호를 암호화 하고 db수정
    if (req.body.pwd) {
        const { pwd } = req.body
        const p = crypto.scryptSync(pwd, _id.toString(), 64, { N: 1024 }).toString('hex')
        req.body.pwd = p
    }

    User.updateOne({ _id }, { $set: req.body })
        .then(r => {
            res.send({ success: true, msg: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

router.delete('/:_id', (req, res, next) => {
    const _id = req.params._id
    if (_id !== req.user._id)
        if (req.user.lv) throw createError(403, '권한이 없습니다')

    let isDelUser = false
    //id를 먼저 찾는다
    User.findByIdAndRemove(_id)
        .then((r) => {
            //아이디에 연결된 게시판 이름을 추가
            userBoard = r.myBoard
            //아이디과 연결된 댓글을 삭제
            isDelUser = true
            return Board.deleteOne({ name: r.myBoard })
        })
        .then(r => {
            res.send({ success: true, msg: r, token: req.token })
        }).catch(e => {
            isDelUser ? res.send({ success: true, msg: r }) : res.send({ success: false, msg: e.message }
            )
        })
})

module.exports = router;