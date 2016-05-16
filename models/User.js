var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//Prepare mongoose schema
var userSchema = new Schema({
  username: String,
  email: String,
  password: String
});
var User = mongoose.model('User', userSchema);

module.exports = User;
