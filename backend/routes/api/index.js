


var express = require('express');
var router = express.Router();
var createError = require('http-errors');




router.use('/user', require('./user'))

router.all('*', function (req, res, next) {
    next(createError(404, '그런 api 없어'));
});


module.exports = router;
