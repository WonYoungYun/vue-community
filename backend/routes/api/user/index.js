//유저의 마이페이지
//유저 닉네임 비밀번호 수정,  회원탈퇴기능

var createError = require('http-errors')
var router = require('express').Router()
const User = require('../../../models/users')

//토큰을 일부러 만든게아니라 올바른 절차를 밞은 유저인지 확인하는 api
//화면 새로고침할때마다 이곳에서 유저에 대한 데이터를 받아감
router.get('/', function (req, res, next) {
    const id = req.user.id
    User.findOne({ id }).lean()
        .then(r => {
            delete r.pwd;
            res.send({ success: true, msg: "올바른 유저", token: req.token, userData: r })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })

});

//유저 이미지변경 api 추가




router.put('/:_id', (req, res, next) => {
    const _id = req.params._id
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
    User.deleteOne({ _id })
        .then(r => {
            res.send({ success: true, msg: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

module.exports = router;