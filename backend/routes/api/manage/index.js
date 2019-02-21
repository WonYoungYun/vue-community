var express = require('express');
var router = express.Router();
const createError = require('http-errors')


router.use('/users', require('./users'))


module.exports = router;