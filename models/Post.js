const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    //array of user object that hace a id (Schema.Types.ObjectId,)
    {
      user: {
        type: Schema.Types.ObjectId, //that way we know which like came from witch user
        ref: "users"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        require: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: String,
        default:
          new Date().toDateString() + " " + new Date().toLocaleTimeString()
      }
    }
  ],
  date: {
    type: String,
    default: new Date().toDateString() + " " + new Date().toLocaleTimeString()
  }
});

module.exports = Post = mongoose.model("post", PostSchema);
