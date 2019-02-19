
var createError = require('http-errors');
var router = require('express').Router();
const Board = require('../../../models/boards')
const User = require('../../../models/users')
const moment = require('moment')

//보기위한 게시판 호출
router.get('/read/:name', (req, res, next) => {
    const name = req.params.name
    Board.findOneAndUpdate({ name }, { $inc: { 'inCnt': 1 } })
        .then(r => {
            res.send({ success: true, d: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

router.get('/list', (req, res, next) => {
    Board.find().sort({ regDate: -1 }).populate('_user', 'id name img')
        .then(rs => {
            res.send({ success: true, ds: rs, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})




//자신의 게시판을 관리하기위한 게시판 호출
//게시판을 수정하고 삭제하는건 lv이 1인 유저만 가능하다.
router.all('*', function (req, res, next) {
    if (req.user.lv > 1) throw createError(403, '권한이 없습니다')
    next();
});

router.get('/', (req, res, next) => {
    const _id = req.user._id
    User.findById({ _id })
        .then(r => {
            return Board.findOne({ name: r.myBoard }).populate('_user', 'id')
        })
        .then(r => {
            console.log(r)
            res.send({ success: true, d: r, token: req.token })
        }).catch(e => {
            res.send({ success: false, msg: e.message })
        })
})


//게시판의 이름은 유니크하다.
router.post('/', (req, res, next) => {
    console.log("리퀘바디", req.body)
    const { name, content, color } = req.body
    const _id = req.user._id
    //이미 게시판이 있는지, 같은이름의 다른 게시판이 있는지 check

    User.findById({ _id })
        .then(r => {
            if (r.myBoard) throw new Error('이미 게시판이 있습니다.')
            return Board.create({ name, content, color, regDate: moment().format("YYYY-MM-DD"), _user: _id })
        })
        .then(() => {
            return User.updateOne({ _id }, { $set: { 'myBoard': name } })
        })
        .then(r => {
            res.send({ success: true, msg: r, token: req.token })
        })
        .catch(e => {
            next(createError(400, e.message))
            res.send({ success: false, msg: e.message })
        })
})

router.delete('/:_id', (req, res, next) => {
    const _id = req.params._id
    Board.findById(_id).populate('_user', 'id')
        .then(r => {
            return User.findByIdAndUpdate(r._user._id, { $set: { myBoard: "" } })
        })
        .then(() => {
            return Board.deleteOne({ _id })
        })
        .then(r => {
            res.send({ success: true, msg: r, token: req.token })
        }).catch(e => {
            res.send({ success: false, msg: e.message })
        })
})


router.put('/:_id', (req, res, next) => {

    const _id = req.params._id

    Board.findById(_id).populate('_user', 'id')
        .then(r => {
            return User.findByIdAndUpdate(r._user._id, { $set: { myBoard: req.body.name } })
        })
        .then(() => {
            return Board.updateOne({ _id }, { $set: req.body })
        })
        .then(r => {
            res.send({ success: true, msg: r, token: req.token })
        }).catch(e => {
            res.send({ success: false, msg: e.message })
        })

})



router.all('*', function (req, res, next) {
    next(createError(404, '그런 api 없어'));
});

module.exports = router;