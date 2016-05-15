var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

router.get('/', function(request, response) {
  response.sendFile("/Users/bradford/Workspace/Playground/galvanize/gschoolProjects/q1-project/public/html/index.html", {
    user: request.user
  });
});

router.get('/register', function(request, response) {
    resposne.sendFile("/Users/bradford/Workspace/Playground/galvanize/gschoolProjects/q1-project/public/html/index.html", {

    });
});

router.post('/register', function(request, response) {
  Account.register(new Account({ username : request.body.username }), request.body.password, function(err, account) {
    if (err) {
      return response.sendFile("/Users/bradford/Workspace/Playground/galvanize/gschoolProjects/q1-project/public/html/index.html", { account : account });
    }
    passport.authenticate('local')(request, response, function () {
      response.redirect('/');
    });
  });
});

router.post('/', passport.authenticate('local'), function(request, response) {
    response.redirect('/');
});

router.get('/logout', function(request, response) {
    request.logout();
    response.redirect('/');
});

router.get('/news', ensureAuthenticated, function(request, response) {
  response.sendFile("/Users/bradford/Workspace/Playground/galvanize/gschoolProjects/q1-project/public/html/news.html", {
    isAuthenticated: request.isAuthenticated(),
    user: request.user
  });
});

router.get('/profile', ensureAuthenticated, function(request, response) {
    response.sendFile('/Users/bradford/Workspace/Playground/galvanize/gschoolProjects/q1-project/public/html/news.html', {
      isAuthenticated: request.isAuthenticated(),
      user: request.user
    });
});

function ensureAuthenticated(request, response, next) {
  if ( request.isAuthenticated() ) {
    next();
  } else {
    response.redirect('/');
  }
};

module.exports = router;
