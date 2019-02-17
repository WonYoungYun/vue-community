//회원가입, 로그인

var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const jwt = require('jsonwebtoken')
const User = require('../../../models/users')
const cfg = require('../../../config')
const crypto = require('crypto')
const moment = require('moment')
const request = require('request')

const signToken = (_id, id, lv, name, rmb) => {
    return new Promise((resolve, reject) => {
        const o = {
            issuer: cfg.jwt.issuer,
            expiresIn: cfg.jwt.expiresIn, // 3분
            algorithm: cfg.jwt.algorithm
        }
        if (rmb) o.expiresIn = cfg.jwt.expiresInRemember // 6일
        jwt.sign({ _id, id, lv, name }, cfg.jwt.secretKey, o, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}



router.post('/in', (req, res, next) => {
    const { id, pwd, remember } = req.body
    if (!id) throw createError(400, '아이디가 없습니다')
    if (!pwd) throw createError(400, '비밀번호가 없습니다')
    if (remember === undefined) throw createError(400, '기억하기가 없습니다.')

    let u = {}
    User.findOne({ id }).lean()
        .then((r) => {
            if (!r) throw new Error('존재하지 않는 아이디입니다.')

            const p = crypto.scryptSync(pwd, r._id.toString(), 64, { N: 1024 }).toString('hex')
            if (r.pwd !== p) throw new Error('비밀번호가 틀립니다.');
            delete r.pwd
            u = r
            //blocked 됬을때 return
            if (r.blocked) return res.send({ success: false, msg: "차단당했습니다. 관리자에게 문의하세요" })
            return signToken(r._id, r.id, r.lv, r.name, r.regDate, remember)
        })
        .then((r) => {
            res.send({ success: true, token: r, userData: u })
        })
        .catch((e) => {
            res.send({ success: false, msg: e.message })
            // next(createError(401, e.massage))
        })
})


router.post('/up', (req, res) => {
    const u = {
        ...req.body,
        regDate: moment().format("YYYY-MM-DD")
    }
    if (!u.id) throw createError(400, '아이디가 없습니다.')
    if (!u.pwd) throw createError(400, '비밀번호가 없습니다.')
    if (!u.name) throw createError(400, '이름이 없습니다.')
    if (!u.response) throw createError(400, '로봇 검증이 없습니다')
    console.log(u)
    const ro = {
        uri: 'https://www.google.com/recaptcha/api/siteverify',
        json: true,
        form: {
            secret: cfg.recaptchaSecretKey,
            response: u.response,
            remoteip: req.ip
        }
    }

    request.post(ro, (err, response, body) => {
        if (err) throw createError(401, '로봇 검증 실패입니다')
        User.findOne({ id: u.id })
            .then(r => {
                if (r) throw createError(400, '이미 등록되어 있는 아이디입니다.')
                return User.create(u)
            })
            .then(r => {
                const pwd = crypto.scryptSync(r.pwd, r._id.toString(), 64, { N: 1024 }).toString('hex')
                return User.updateOne({ _id: r._id }, { $set: { pwd } })
            })
            .then(r => {
                res.send({ success: true })
            })
            .catch(e => {
                res.send({ success: false, msg: e.message })
            })
    })
})

module.exports = router;