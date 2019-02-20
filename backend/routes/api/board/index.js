
var createError = require('http-errors');
var router = require('express').Router();
const Board = require('../../../models/boards')
const User = require('../../../models/users')
const Article = require('../../../models/articles')
const moment = require('moment')

//보기위한 게시판 호출
router.get('/read/:name', (req, res, next) => {
    const name = req.params.name
    Board.findOneAndUpdate({ name }, { $inc: { 'inCnt': 1 } })
        .then(r => {
            res.send({ success: true, d: r, req_user: req.user._id, token: req.token })
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
            res.send({ success: true, d: r, token: req.token })
        }).catch(e => {
            res.send({ success: false, msg: e.message })
        })
})


//게시판의 이름은 유니크하다.
router.post('/', (req, res, next) => {
    const { name, content, color } = req.body
    const _id = req.user._id
    //이미 게시판이 있는지, 같은이름의 다른 게시판이 있는지 check

    User.findById({ _id })
        .then(r => {
            if (r.myBoard) throw createError(400, '이미 게시판이 있습니다.')
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
    let userId = ""
    Board.findById(_id).populate('_user', 'id')
        .then(r => {
            if (!r) throw createError(400, '잘못된 요청입니다.')
            userId = r._user._id
            //게시글 숫자를 센다
            return Article.countDocuments({ _board: _id })
        })
        .then((r) => {
            //유저 아이디에 게시글 쓴 수를 빼줌
            return User.findByIdAndUpdate(userId, { $inc: { 'cnt.atc': -parseInt(r) } })
        })
        .then((r) => {
            //유저 아이디의 보드 정보 초기화
            return User.findByIdAndUpdate(userId, { $set: { myBoard: "" } })
        })
        .then(() => {
            //boardid 연관된 댓글 전부 삭제
            return Comment.deleteMany({ _board: _id })
        })
        .then((r) => {
            //게시판의 게시글 전체 삭제
            return Article.deleteMany({ _board: _id })
        })
        .then((r) => {
            //게시판 삭제
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
            if (!r) throw createError(400, '잘못된 요청입니다.')
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