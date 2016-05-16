var express = require('express'),
    mongoose = require('mongoose'),
    User = require('./models/User'),
    app = express(),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;



mongoose.connect((process.env.MONGODB_URI || 'mongodb://localhost' )+ '/test' );

// Static assets
app.use(express.static('./public'));

// Set views
app.set('view engine', 'jade');
app.set('views', './views');

// Set middleware
app.use( bodyParser.urlencoded({ extended: false }) );
app.use(session({
  secret: 'super-secret',
  resave: true,
  saveUninitialized: true
}));

// Set passport middleware
app.use( passport.initialize() );
app.use( passport.session() );

// Serialize user
passport.serializeUser(function(user, done) {
  return done(null, user._id);
});

// Deserialize user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Register strategy
passport.use('registerUser', new LocalStrategy(
  { passReqToCallback: true },
  function(req, username, password, done) {
    var newUser = new User({
      username: username,
      password: password,
      email: req.body.email
    });
    newUser.save(function(err) {
      if (err) {
        return done(err);
      }
      return done(null, newUser);
    });
  }
));

// Login strategy
passport.use('loginStrategy', new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (password !== user.password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// Define register route
app.route('/register')
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
app.route('/')
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
app.route('/news').get(function(request, response) {
  if (!request.user) {
    response.redirect('/');
    return;
  }
  response.render('news');
});

// Define profile route
app.route('/profile').get(function(request, response) {
  if (!request.user) {
    response.redirect('/');
    return;
  }
  response.render('profile');
});

app.listen(process.env.PORT || 1337);
