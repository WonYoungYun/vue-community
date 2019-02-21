var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const createError = require('http-errors')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../', 'frontend', 'dist')));

//개발시에만 cors 사용
if (process.env.NODE_ENV !== 'production') app.use(cors())



app.use('/api', require('./routes/api'))


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);

    if (err.status === 404) res.redirect('/')
    res.send({ msg: err.message })


});



const mongoose = require('mongoose')

console.log(`${process.env.NODE_ENV} started!`)


const cfg = require('./config')

mongoose.connect(cfg.dbUrl, { useNewUrlParser: true }, (err) => {
    if (err) return console.error(err)


})


module.exports = app;
