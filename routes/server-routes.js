var express = require('express'),
    passport = require('passport'),
    router = express.Router();

// Define register route
router.route('/register')
  .get(function(request, response) {
    response.render('register');
  })
  .post(function(request, response, next) {
    passport.authenticate('registerUser', function(err, user, info){
      if (err) {
        return response.send({ err: err, info: info });
      }
      response.send(user);
    })(request, response, next);
  });

// Define login route
router.route('/')
  .get(function(request, response) {
    response.render('index');
  })
  .post(function(request, response, next) {
    passport.authenticate('loginStrategy', function(err, user, info){
      if (err) {
        return response.send({ err: err});
      }
      if (!user) {
        return response.send(info);
      }
      request.login(user, function(err) {
        if(err) {
          return response.send(err);
        }
        return response.redirect('/profile');
      })
    })(request, response, next);
  });


// Define news route
router.route('/news').get(function(request, response) {
  if (!request.user) {
    response.redirect('/');
    return;
  }
  response.render('news');
});

// Define profile route
router.route('/profile').get(function(request, response) {
  if (!request.user) {
    response.redirect('/');
    return;
  }
  response.render('profile');
});

// Define logout route
router.get('/logout', function(request, response) {
  request.logout();
  response.redirect('/');
});

module.exports = router;
