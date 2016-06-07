var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    mongoose = require('mongoose'),
    User = require('./models/User'),
    Chat = require('./models/Chat'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    router = require('./routes/server-routes'),
    users = {};

mongoose.connect((process.env.MONGODB_URI || 'mongodb://localhost'));

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

// All socket code goes inside here below
io.sockets.on('connection', function(socket) {
  // Query mongo and put in conditions for search {} is everything
  var query = Chat.find({});
  // Make variable above so you can put limit of last amount of messages on db
  // The -created takes the most recent however many number of messages i put in to load
  query.sort('-created').limit(9).exec(function(err, docs) {
    if (err) { throw err; }
    socket.emit('load old messages', docs);
  });

  // New user sign on
  socket.on('new user', function(data, callback) {
    if ( data in users ) {
      callback(false);
    } else {
      callback(true);
      socket.nickname = data;
      users[socket.nickname] = socket;
      updateNicknames();
    }
  });

  // Function to update nicknames duh
  function updateNicknames() {
    io.sockets.emit('usernames', Object.keys(users));
  }

  // Function to send message
  socket.on('send message', function(data, callback) {
    var msg = data.trim();
    // Save message to mongo db
    var newMsg = new Chat({ msg: msg, nickname: socket.nickname });
    newMsg.save(function(err) {
      if (err) { throw err; }
    });
    // Emit message to front end to display
    io.sockets.emit('new message', { msg: msg, nickname: socket.nickname });
  });
  // Function to disconnect and make user poof disapear
  socket.on('disconnect', function(data) {
    if ( !socket.nickname ) { return; }
      delete users[socket.nickname];
      updateNicknames();
  });
});

// router
app.use('/', router);

// Port to listen on
server.listen(process.env.PORT || 1337);
