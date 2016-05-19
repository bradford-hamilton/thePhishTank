var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Chat Schema
var chatSchema = new Schema({
  msg: String,
  nickname: String,
  created: { type: Date, default: Date.now }
});

// Mongoose model
var Chat = mongoose.model('Message', chatSchema);

module.exports = Chat;
