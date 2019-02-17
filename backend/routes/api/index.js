
var express = require('express');
var router = express.Router();
var createError = require('http-errors');
const jwt = require('jsonwebtoken')
const moment = require('moment')
const cfg = require('../../config')




//회원가입, 로그인
router.use('/sign', require('./sign'))

const verifyToken = (t) => {
    return new Promise((resolve, reject) => {
        if (!t) resolve({ id: 'guest', name: '손님', lv: 3 })
        if ((typeof t) !== 'string') reject(new Error('문자가 아닌 토큰 입니다.'))
        if (t.length < 10) resolve({ id: 'guest', name: '손님', lv: 3 })
        jwt.verify(t, cfg.jwt.secretKey, (err, v) => {
            if (err) reject(err)
            resolve(v)
        })
    })
}

const signToken = (_id, id, lv, name, regDate, exp) => {
    return new Promise((resolve, reject) => {
        const o = {
            issuer: cfg.jwt.issuer,
            expiresIn: cfg.jwt.expiresIn, // 3분
            algorithm: cfg.jwt.algorithm,
            expiresIn: exp
        }
        jwt.sign({ _id, id, lv, name, regDate }, cfg.jwt.secretKey, o, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

const getToken = async (t) => {
    let vt = await verifyToken(t)
    if (vt.lv > 2) return { user: vt, token: null }
    const diff = moment(vt.exp * 1000).diff(moment(), 'seconds')
    // return vt
    const expSec = (vt.exp - vt.iat)
    if (diff > expSec / cfg.jwt.expiresInDiv) return { user: vt, token: null }

    const nt = await signToken(vt._id, vt.id, vt.lv, vt.name, vt.regDate, expSec)
    vt = await verifyToken(nt)
    return { user: vt, token: nt }
}
router.all('*', function (req, res, next) {
    // 토큰 검사
    getToken(req.headers.authorization)
        .then((v) => {
            req.user = v.user
            req.token = v.token
            next()
        })
        .catch(e => next(createError(401, e.message)))
})

router.all('*', function (req, res, next) {
    if (req.user.lv > 2) throw createError(403, '권한이 없습니다')
    next();
});

//유저 데이터를 가져가기위한 하나의 userAPI
router.use('/user', require('./user'))


//유저 관리를 위한 API
router.use('/manage', require('./manage'))




router.all('*', require('./notFound'))


module.exports = router;
