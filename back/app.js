var createError = require('http-errors');
var express = require('express');

var logger = require('morgan');

const cors = require('cors')
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var timeRouter = require('./routes/time');

var app = express();

app.use(cors())


//Connect DB
mongoose.connect('mongodb://127.0.0.1:27017/medicalApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Data Base medicalApp Connected'))
  .catch(err => console.log(err));
//////

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// view engine setup
app.use(logger('dev'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/time', timeRouter);

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
  res.json({
    message: err.message
  })
});

module.exports = app;
