var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var passport = require('passport');
var passportLocal = require('passport-local');
// var passportHttp = require('passport-http');

var app = express();

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

passport.use(new passportLocal.Strategy(verifyCredentials));
// passport.use(new passportHttp.BasicStrategy(verifyCredentials));

function verifyCredentials (username, password, done) {
  if ( username === password ) {
    done(null, { id: username, name: username });
  } else {
    done(null, null);
  }
};

passport.serializeUser(function(user, done) {
  //would do query against database here I think
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  //would query against database again I believe
  done(null, { id: id, name: id });
});

function ensureAuthenticated(request, response, next) {
  if ( request.isAuthenticated() ) {
    next();
  } else {
    response.redirect('/');
  }
};

app.get('/', function(request, response) {
    response.sendFile("/Users/bradford/Workspace/Playground/galvanize/gschoolProjects/q1-project/public/html/index.html", {
      isAuthenticated: request.isAuthenticated(),
      user: request.user
    });
});

app.post('/', passport.authenticate('local'), function(request, response) {
  response.sendFile('/Users/bradford/Workspace/Playground/galvanize/gschoolProjects/q1-project/public/html/profile.html')
});

app.get('/logout', function(request, response) {
  request.logout();
  response.redirect('/');
});

// //for any folder in api (change to anything i want authenticated) we want to auth
// app.use('/api', passport.authenticate('basic', { session: false } ));
//
// app.get('/api/data', ensureAuthenticated, function(request, response) {
//   response.json([
//     { value: 'foo' },
//     { value: 'bar' },
//     { value: 'baz' }
//   ]);
// });

app.listen(process.env.PORT || 1337);
