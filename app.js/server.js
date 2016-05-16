var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var jade = require('jade');


var passport = require('passport');
var passportLocal = require('passport-local');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

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

passport.use(new passportLocal.Strategy(verifyCredentials));

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
    response.render('index', {
      isAuthenticated: request.isAuthenticated(),
      user: request.user
    });
});

app.get('/news', ensureAuthenticated, function(request, response) {
  response.render("news", {
    isAuthenticated: request.isAuthenticated(),
    user: request.user
  });
});

app.get('/profile', ensureAuthenticated, function(request, response) {
    response.render('profile', {
      isAuthenticated: request.isAuthenticated(),
      user: request.user
    });
})

app.post('/', passport.authenticate('local'), function(request, response) {
  response.render('profile')
});

app.get('/logout', function(request, response) {
  request.logout();
  response.redirect('/');
});

app.listen(process.env.PORT || 1337);
