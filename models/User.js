const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true //we dont want pepo;e register with the same email
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String //attch profile to your email
  },
  date: {
    type: Date,
    default: Date.now //automatic current time
  }
});

module.exports = User = mongoose.model("user", UserSchema);
