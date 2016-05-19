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
      return response.redirect('/profile');
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
        return response.send({ err: err });
      }
      if (!user) {
        return response.redirect('/');
      }
      request.login(user, function(err) {
        if(err) {
          return response.redirect('/');
        }
        return response.redirect('/profile');
      })
    })(request, response, next);
  });

// Define profile route
router.route('/profile').get(function(request, response) {
  if (!request.user) {
    response.redirect('/');
    return;
  }
  response.render('profile');
});

// Define news route
router.route('/news').get(function(request, response) {
  if (!request.user) {
    response.redirect('/');
    return;
  }
  response.render('news');
});

// Define chat route
router.get('/chat', function(request, response) {
  if (!request.user) {
    reponse.redirect('/');
    return
  }
  response.render('chat'); 
})

// Define logout route
router.get('/logout', function(request, response) {
  request.logout();
  response.redirect('/');
});

module.exports = router;
