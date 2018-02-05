const express = require('express');
const path = require('path');
const config = require('config');
const compress = require('compression');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const authentication = require('./app/routes/login.routes');
const user = require('./app/routes/users.routes');
const userFeeds = require('./app/routes/users.feeds.routes');
const feeds = require('./app/routes/global.feeds.routes');
// require routes
// const index = require('./app/routes/index');


const app = express();
const devEnv = process.env.NODE_ENV === 'development'

// database connection
mongoose.connect(config.mongo_uri)
.then(connected => console.log('rss-feed DB connected'))
.catch(err => console.error.bind(console, 'rss-feed DB connection error: '));

if (!devEnv) app.use(compress())
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'dist')));

// routes
app.use('/user', user);
app.use('/user-feeds', userFeeds);
app.use('/auth', authentication);
app.use('/feeds', feeds);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json(err);
});

module.exports = app;
