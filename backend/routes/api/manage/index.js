var express = require('express');
var createError = require('http-errors');
var router = express.Router();


router.use('/users', require('./users'))


module.exports = router;