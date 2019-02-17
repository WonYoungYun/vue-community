const mongoose = require('mongoose')
const cfg = require('../config')
const crypto = require('crypto')
const moment = require('moment')

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
const userSchema = new mongoose.Schema({
    name: { type: String, default: '' },//유저 닉네임
    id: { type: String, default: '', unique: true, index: true },//유저 아이디
    pwd: { type: String, default: '' },//유저 비밀번호
    lv: { type: Number, default: 2 }, //유저 권한 0,1,2,3 이며 1은 작가 2는 독자 3은 방문자, 0은 매니저
    img: { type: String, default: '' }, //유저 이미지
    regDate: { type: String, dafault: '' },    //계정생성일
    blocked: { type: Boolean, default: false }    //정지 상태
    //자신소유 보드,
    //자신이 좋아요 한 게시판


})

const User = mongoose.model('User', userSchema)
// User.collection.dropIndexes({ name: 1})

// User.deleteMany({}).then(r => console.log(r))
User.findOne({ id: cfg.admin.id })
    .then((r) => {
        // console.log(r)
        if (!r) {
            const regDate = moment().format("YYYY-MM-DD")
            return User.create({ id: cfg.admin.id, pwd: cfg.admin.pwd, name: cfg.admin.name, lv: 0, regDate: regDate })
        }
        console.log("관리자 계정 생성")
        // if (r.lv === undefined) return User.updateOne({ _id: r._id }, { $set: { lv: 0, inCnt: 0 } }) // 임시.. 관리자 계정 레벨 0으로..
        return Promise.resolve(null)
    })
    .then(r => {
        if (!r) Promise.resolve(null)
        if (r.pwd !== cfg.admin.pwd) Promise.resolve(null)
        if (r) console.log(`admin:${r.id} created!`)
        const pwd = crypto.scryptSync(r.pwd, r._id.toString(), 64, { N: 1024 }).toString('hex')
        console.log(pwd)
        return User.updateOne({ _id: r._id }, { $set: { pwd } })
    })
    .then((r) => {
        if (r) console.log(`password changed!`)
    })
    .catch((e) => {
        console.error("어드민", e.message)
    })
module.exports = User