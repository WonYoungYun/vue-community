var createError = require('http-errors');
var router = require('express').Router();
const Board = require('../../../../models/boards')


//매니저가 다른 것을 지우는 것이기 때문에 params를 써야함
//매니저는 게시판을 수정하는 것이 불가능

router.get('/', function (req, res, next) {
    Board.find().populate('_user', 'id')
        .then(rs => {
            res.send({ success: true, ds: rs, token: req.token })
        })
        .catch(e => {
            res.send({ success: false })
        })
});


router.delete('/:_id', (req, res, next) => {
    const _id = req.params._id
    Board.deleteOne({ _id })
        .then(r => {
            res.send({ success: true, msg: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

module.exports = router;