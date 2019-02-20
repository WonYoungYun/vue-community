

var router = require('express').Router()
const User = require('../../../../models/users')



// 권한으로 못보게 하려면..
// if (r.lv < req.lv) return res.send({ success: false, msg: `${name} 게시판을 볼 수 있는 자격이 없습니다.`})




router.get('/', function (req, res, next) {
    User.find()
        .then(r => {
            res.send({ success: true, users: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
});






module.exports = router;