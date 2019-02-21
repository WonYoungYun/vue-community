const router = require('express').Router()
const createError = require('http-errors')
const Article = require('../../../models/articles')
const Comment = require('../../../models/comments')
const User = require('../../../models/users')





//댓글 읽는법 2가지 전체읽기(페이징), 하나의 댓글 읽기 페이징먼저 구현
//하나 댓글 읽을떄는 req.user._id를 return 해야함

router.get('/list/:_article', (req, res, next) => {
    const _article = req.params._article
    const { page } = req.query
    if (!(page)) throw createError(400, '잘못된 요청입니다.')
    order = 'regDate'//날짜 순 정렬
    limit = 8//30개씩 주기
    skip = limit * (parseInt(page)); //이미 게시글을 부를때 댓글을 불렀기 떄문에 스킵
    const s = {}
    s[order] = -1
    //s['title'] =-1 or 1 이런형식으로 즉 밑의 sort에 넣으면  sort({title:1})이런형식으로됨
    const f = {}
    if (_article) f._article = _article
    let total = 0

    //페이징시 몽고에게 꼭 줘야하는것
    //countDocuments는 개수만 return하는 것 카운트가 몇개인지 적어서 프론트에 돌려줘야함
    Comment.countDocuments(f)
        .where('_id')
        .then(r => {
            total = r
            return Comment.find(f)
                .where('_id')
                .sort(s)
                .skip(skip)
                .limit(limit)
                .populate('_user', 'id name img')
        })
        .then(rs => {
            res.send({ success: true, ct: total, ds: rs, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})



router.all('*', function (req, res, next) {
    if (req.user.lv > 2) throw createError(403, '권한이 없습니다')
    next();
});

router.post('/:_article', (req, res, next) => {
    const _article = req.params._article
    if (!_article) throw createError(400, '게시글이 선택되지 않았습니다.')
    const { content } = req.body

    let boardId = "";
    //게시글을 찾아 댓글 수 +1
    Article.findByIdAndUpdate(_article, { $inc: { 'cnt.comment': 1 } })
        .then((r) => {

            if (!r) throw createError(400, '잘못된 게시글입니다')
            //게시글과 연결된 게시판의 아이디를 가져온다.
            boardId = r._board
            //댓글 쓴 유저를 찾아 댓글 수 +1
            return User.findByIdAndUpdate(req.user._id, { $inc: { 'cnt.com': 1 } })
        })
        .then(() => {
            const cmt = {
                content,
                _article,
                _user: req.user._id,
                _board: boardId
            }
            return Comment.create(cmt)
        })
        .then(r => {
            if (!r) throw createError(400, '댓글이 생성되지 않았습니다')
            res.send({ success: true, d: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

router.put('/:_cmt', (req, res, next) => {
    const _id = req.params._cmt
    if (!req.body.content) throw createError(400, '제목이 없습니다.')
    Comment.findById(_id)
        .then(r => {
            if (!r) throw createError(400, '게시물이 존재하지 않습니다')
            return Comment.findByIdAndUpdate(_id, { $set: { content: req.body.content } })
        })
        .then(() => {
            return Comment.findById(_id)

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
    let atcId = "";
    Comment.findById(_id)
        .then(r => {
            if (!r) throw createError(400, '댓글이 존재하지 않습니다')
            if (req.user.lv !== 0)
                if (req.user._id !== r._user.toString()) throw createError(403, '자신이 쓴 댓글만 삭제할 수 있습니다!')
            atcId = r._article

            return User.findByIdAndUpdate(r._user, { $inc: { 'cnt.com': -1 } })
        })
        .then(r => {
            return Article.findByIdAndUpdate(atcId, { $inc: { 'cnt.comment': -1 } })
        })
        .then(() => {
            return Comment.deleteOne({ _id })
        })
        .then(r => {
            res.send({ success: true, d: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})




module.exports = router;