var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// chat Schema
var chatSchema = new Schema({
  msg: String,
  nickname: String,
  created: { type: Date, default: Date.now }
});

// mongoose model
var Chat = mongoose.model('Message', chatSchema)

module.exports = Chat;
