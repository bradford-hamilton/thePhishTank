var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.connect((process.env.MONGODB_URI || 'mongodb://localhost' )+ '/test' );

//Prepare mongoose schema
var userSchema = new Schema({
  username: String,
  email: String,
  password: String
});
var User = mongoose.model('User', userSchema);

module.exports = User;
