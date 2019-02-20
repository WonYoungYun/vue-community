const mongoose = require('mongoose')

mongoose.set('userCreateIndex', true)

const articleSchema = new mongoose.Schema({
    title: { type: String, default: '', index: true },
    content: { type: String, default: '' },
    cnt: {
        view: { type: Number, default: 0 },
        comment: { type: Number, default: 0 }
    },
    regDate: { type: String, default: '' },
    comments: [], //댓글 넣을 배열
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    _board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', index: true }
})

const article = mongoose.model('Article', articleSchema)

module.exports = article