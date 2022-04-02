var env = require('dotenv/config')
var createError = require('http-errors');
var path = require('path');
var logger = require('morgan');
var formathelpers = require('./helpers/formathelpers')
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var querystring = require('querystring');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session(
  { secret: '0dc529ba-5051-4cd6-8b67-c9a901bb8bdf',
    resave: false,
    saveUninitialized: false 
  }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
//app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',  require('./routes/index'));
app.use('/authorize', require('./routes/authorize'));
app.use('/list', require('./routes/list'));
app.use('/item',  require('./routes/item'));
app.use('/updateitem', require('./routes/updateitem') );
app.use('/deleteitem',  require('./routes/deleteitem'));
app.use('/webhook', require('./routes/webhook'));


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

formathelpers.register();

module.exports = app;
