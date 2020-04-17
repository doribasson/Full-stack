const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

// mongoose.connect(db)
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false //to disable this msg from terminal DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify
    });
    console.log("mongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1); //Exit process with failure
  }
};

module.exports = connectDB;
