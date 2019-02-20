const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)
const commentSchema = new mongoose.Schema({
    content: { type: String, default: '' },
    regDate: { type: Date, default: Date.now },
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    _board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', index: true },
    _article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', index: true }
})

const comment = mongoose.model('Comment', commentSchema)
module.exports = comment