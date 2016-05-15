var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var passportLocal = require('passport-local');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }) );
app.use(cookieParser());
app.use(expressSession({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use( passport.initialize() );
app.use( passport.session() );

app.use(express.static('/Users/bradford/Workspace/Playground/galvanize/gschoolProjects/q1-project/public/images'));
app.use(express.static('/Users/bradford/Workspace/Playground/galvanize/gschoolProjects/q1-project/public/scripts'));
app.use(express.static('/Users/bradford/Workspace/Playground/galvanize/gschoolProjects/q1-project/public/stylesheets'));
app.use(express.static('/Users/bradford/Workspace/Playground/galvanize/gschoolProjects/q1-project/public/html'));

app.use('/', routes);

//Passport config
var Account = require('./models/account');
passport.use(new passportLocal.Strategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//mongoose
mongoose.connect('mongodb://localhost/passport_local_mongoose_express4');

// 404 forwarded to error handler
app.use(function(request, response, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//error handler that prints stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, request, response, next) {
    response.status(err.status || 500);
    response.render('error', {
      message: err.message,
      error: err
    });
  });
};

//error handler when live with no stacktraces leaked to user
app.use(function(err, request, response, next) {
  response.status(err.status || 500);
  response.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(process.env.PORT || 1337);

module.exports = app;




/*
function ensureAuthenticated(request, response, next) {
  if ( request.isAuthenticated() ) {
    next();
  } else {
    response.redirect('/');
  }
};
*/


/*
app.get('/', function(request, response) {
    response.sendFile("/Users/bradford/Workspace/Playground/galvanize/gschoolProjects/q1-project/public/html/index.html", {
      isAuthenticated: request.isAuthenticated(),
      user: request.user
    });
});

*/
// app.get('/news', ensureAuthenticated, function(request, response) {
//   response.sendFile("/Users/bradford/Workspace/Playground/galvanize/gschoolProjects/q1-project/public/html/news.html", {
//     isAuthenticated: request.isAuthenticated(),
//     user: request.user
//   });
// });

// app.get('/profile', ensureAuthenticated, function(request, response) {
//     response.render('profile', {
//       isAuthenticated: request.isAuthenticated(),
//       user: request.user
//     });
// });

// app.post('/', passport.authenticate('local'), function(request, response) {
//   response.sendFile('/Users/bradford/Workspace/Playground/galvanize/gschoolProjects/q1-project/public/html/profile.html')
// });

// app.get('/logout', function(request, response) {
//   request.logout();
//   response.redirect('/');
// });
