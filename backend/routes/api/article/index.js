var createError = require('http-errors');
var router = require('express').Router();

const Board = require('../../../models/boards')
const Article = require('../../../models/articles')
const User = require('../../../models/users')
const moment = require('moment')
const Comment = require('../../../models/comments')




router.get('/list/:_board', (req, res, next) => {
    const _board = req.params._board
    const { page } = req.query
    console.log(req.query, req.params)
    if (!(page)) throw createError(400, '잘못된 요청입니다.')
    order = '_id'//날짜 순 정렬
    limit = 8//30개씩 주기
    skip = limit * (parseInt(page) - 1); //페이지 1번일때 30개 스킵
    const s = {}
    s[order] = -1
    //s['title'] =-1 or 1 이런형식으로 즉 밑의 sort에 넣으면  sort({title:1})이런형식으로됨
    const f = {}
    if (_board) f._board = _board
    let total = 0

    //페이징시 몽고에게 꼭 줘야하는것
    //countDocuments는 개수만 return하는 것 카운트가 몇개인지 적어서 프론트에 돌려줘야함
    Article.countDocuments(f)
        .where('title')
        .then(r => {
            total = r
            return Article.find(f)
                .where('title')
                .sort(s)
                .skip(skip)
                .limit(limit)
                .select('-content')
                .populate('_user', 'id name')
        })
        .then(rs => {
            res.send({ success: true, t: total, ds: rs, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})


router.get('/read/:_id', (req, res, next) => {
    const _id = req.params._id
    let atc = {}
    Article.findByIdAndUpdate(_id, { $inc: { 'cnt.view': 1 } }).populate('_user', 'id name img')
        .then(r => {
            if (!r) throw createError(400, '잘못된 요청입니다.')
            atc = r
            return Comment.find({ _article: atc._id }).populate('_user', 'id name img').sort({ regDate: -1 }).limit(8)

        })
        .then(rs => {
            if (rs) atc.comments = rs
            res.send({ success: true, d: atc, req_user: req.user._id, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })

})

router.all('*', function (req, res, next) {
    if (req.user.lv > 1) throw createError(403, '권한이 없습니다')
    next();
});

router.post('/:_board', (req, res, next) => {
    const _board = req.params._board
    if (!_board) throw createError(400, '게시판이 선택되지 않았습니다.')
    const { title, content } = req.body
    Board.findByIdAndUpdate(_board, { $inc: { 'atcCnt': 1 } })
        .then(r => {
            if (!r) throw createError(400, '잘못된 게시판 입니다.')
            if (r._user.toString() !== req.user._id) throw createError(403, '자신의 게시판에만 작성할 수 있습니다.')
            return User.findByIdAndUpdate(r._user._id, { $inc: { 'cnt.atc': 1 } })
        })
        .then(r => {
            const atc = {
                title,
                content,
                _board,
                regDate: moment().format('YYYY-MM-DD'),
                _user: req.user._id
            }
            return Article.create(atc)
        })
        .then(r => {
            res.send({ success: true, d: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

router.put('/:_id', (req, res, next) => {
    const _id = req.params._id
    if (!req.body.title) throw createError(400, '제목이 없습니다.')
    if (req.user._id !== req.body.id) throw createError(403, '자신이 쓴 게시글만 수정할 수 있습니다!')
    Article.findById(_id)
        .then(r => {
            if (!r) throw createError(400, '게시물이 존재하지 않습니다')
            return Article.findByIdAndUpdate(_id, { $set: req.body })
        })
        .then(() => {
            return Article.findById(_id)

        })
        .then(r => {
            res.send({ success: true, d: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

router.delete('/:_id', (req, res, next) => {

    const _id = req.params._id
    let boardId = "";
    Article.findById(_id)
        .then(r => {
            if (!r) throw createError(400, '게시물이 존재하지 않습니다')
            if (req.user._id !== r._user.toString()) throw createError(403, '자신이 쓴 게시글만 삭제할 수 있습니다!')
            boardId = r._board
            return User.findByIdAndUpdate(r._user, { $inc: { 'cnt.atc': -1 } })
        })
        .then(r => {
            return Board.findByIdAndUpdate(boardId, { $inc: { 'atcCnt': -1 } })
        })
        .then(() => {
            return Article.deleteOne({ _id })
        })
        .then(r => {
            res.send({ success: true, d: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

module.exports = router;