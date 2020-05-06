//for starting will type in terminal:  node server  or modemon: npm run server

//in package.json
// "scripts": {
//     "start": "node server",
//     "server": "nodemon server"
//   },
// **********************************************
const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const ticket_booking = require("./routes/api/ticket_booking");
const flight_reschedule = require("./routes/api/flight_reschedule");

const app = express();

//Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/ticket_booking", ticket_booking);
app.use("/flight_reschedule", flight_reschedule);

//Serve static assets in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build")); //build folder to be a static

  //anything of the Routes above.. exmppale app.use("/api/users", require("./routes/api/users"));
  app.get("*", (req, res) => {
    //to load that html file.. __dirname, we going from current dircetry to client folder and to the build folder and we want to load the index.html
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000; //locally 5000 and heroku PORT http://localhost:5000/ or in get postman

app.listen(PORT, () => console.log(`server started on porn ${PORT}`));

// 1.new file create filte .gitignote
// 2.inside .gitignote -> node_modules/
// 3.git init -> for reository
// 4.npm init
// 5.npm i express express-validator bcryptjs config gravatar jsonwebtoken mongoose request
