

var createError = require('http-errors')
var router = require('express').Router()
const User = require('../../../../models/users')
const Board = require('../../../../models/boards')



// 권한으로 못보게 하려면..
// if (r.lv < req.lv) return res.send({ success: false, msg: `${name} 게시판을 볼 수 있는 자격이 없습니다.`})




router.get('/', function (req, res, next) {
    User.find()
        .then(r => {
            res.send({ success: true, users: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
});


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
    User.findById({ _id })
        .then(r => {
            //유저보드를 먼저 삭제
            return Board.deleteOne({ name: r.myBoard })
        })
        .then(() => {
            return User.deleteOne({ _id })
        }
        ).then(r => {
            res.send({ success: true, msg: r, token: req.token })
        }).catch(e => {
            res.send({ success: false, msg: e.message })
        })

})






module.exports = router;