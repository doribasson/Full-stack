//for starting will type in terminal:  node server  or modemon: npm run server

//in package.json
// "scripts": {
//     "start": "node server",
//     "server": "nodemon server"
//   },
// **********************************************
const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Connect Database
connectDB();

app.get("/", (req, res) => res.send("API Running"));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5000; //locally 5000 and heroku PORT http://localhost:5000/ or in get postman

app.listen(PORT, () => console.log(`server started on porn ${PORT}`));
