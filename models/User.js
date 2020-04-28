const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
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
      // type: String,
      type: Date,
      // default: new Date().toDateString() + " " + new Date().toLocaleTimeString()
      default: Date.now //automatic current time
      // default: () => new Date().toLocaleString("he-IL", { timeZone: "GMT" })
      // default: () => new Date().toLocaleString("he-IL", { timeZone: "GMT" })
      // default: () => new Date().toTimeString()
    }
  } //,{ timestamps: { createdAt: true, updatedAt: false } } ... { timestamps: true }
);

module.exports = User = mongoose.model("user", UserSchema);

// username: {
//   type: String,
//   required: true,
//   unique: true,
//   trim: true,  //"  hello", or "hello ", or "  hello ", would end up being saved as "hello" in Mongo - i.e. white spaces will be removed from both sides of the string.
//   minlength: 3
// },
// }, {
// timestamps: true,
// });
