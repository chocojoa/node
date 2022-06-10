var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret : 'secret key', //암호화 하는 데 쓰일 키
    resave : false, // 세션에 변경 사항이 없어도 항상 다시 저장할지 여부
    saveUninitialized : true, //초기화 되지 않은 세션을 스토어(저장소)에 강제로 저장할지 여부
  })
);

app.use(flash());

app.use(function(req, res, next) {
  if(req.session) {    
    res.locals.session = req.session.passport;
  } 
  next();
});

var passport = require('./lib/passport')(app);
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth')(passport);
var boardRouter = require('./routes/board');

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/board', boardRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
