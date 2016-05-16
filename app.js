var express = require('express'),
    mongoose = require('mongoose'),
    User = require('./models/User'),
    app = express(),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    router = require('./routes/server-routes');

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

// router
app.use('/', router);

// Port to listen on
app.listen(process.env.PORT || 1337);
