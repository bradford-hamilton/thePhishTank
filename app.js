var express = require('express'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    app = express(),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


mongoose.connect('mongodb://localhost/test', function(err) {
  if (err) {
    return console.log(err);
  }

  //Prepare mongoose schema
  var userSchema = new Schema({
    username: String,
    email: String,
    password: String
  });
  var User = mongoose.model('User', userSchema);

  // Set views
  app.set('view engine', 'jade');
  app.set('views', './');

  // Set middleware
  app.use( bodyParser.urlencoded() );
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

  // Register logic
  passport.use('registerUser', new LocalStrategy(
    { passReqToCallback: true },
    function(request, username, password, done) {
      var newUser = new User({
        username: username,
        password: password,
        email: request.body.email
      });
      newUser.save(function(err) {
        if (err) {
          return done(err);
        }
        return done(null, newUser);
      });
    }
  ));

  app.route('/register')
    .get(function(request, response) {
      response.render('index');
    })

});
