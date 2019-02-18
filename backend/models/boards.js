const mongoose = require('mongoose')

mongoose.set('userCreateIndex', true)

const boardSchema = new mongoose.Schema({
    name: { type: String, default: '', index: true, unique: true }, //게시판 이름
    inCnt: { type: Number, default: 0 }, //방문자 수
    content: { type: String, default: '' },//게시판에 대한 소개
    atcCnt: { type: Number, default: 0 },//게시글 숫자
    regDate: { type: String, dafault: '' },
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },//주인인 유저

})

const board = mongoose.model('Board', boardSchema)
module.exports = board